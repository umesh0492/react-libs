#!/usr/bin/env node
/**
 * generate-performance-report.mjs
 *
 * Runs `vitest run --reporter=json` to capture per-test timing data,
 * then computes P50/P95/P99 latency percentiles and writes a human-readable
 * Markdown performance report to docs/performance-report.md.
 *
 * Usage:  node scripts/generate-performance-report.mjs
 *         npm run perf
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'docs');
const OUT_FILE = join(OUT_DIR, 'performance-report.md');
const JSON_TMP = join(ROOT, '.vitest-report.json');

// ---------------------------------------------------------------------------
// 1. Configuration & Exclusions
// ---------------------------------------------------------------------------
const EXCLUDE_PATTERNS = [
  'Introduction.stories.tsx', // Heavy documentation
  'DesignTokens.stories.tsx', // Heavy documentation
  '.stories.tsx',             // All stories (browser-based, high overhead)
];

// ---------------------------------------------------------------------------
// 2. Run vitest with JSON reporter
// ---------------------------------------------------------------------------
console.log('⏱  Running test suite (json reporter)…');
const start = Date.now();

let rawJson;
try {
  execSync(
    `npx vitest run --reporter=json --outputFile="${JSON_TMP}" --coverage=false`,
    { cwd: ROOT, stdio: ['ignore', 'ignore', 'ignore'] }
  );
  // Even on threshold failure (coverage off here), results are written
} catch {
  // vitest exits non-zero if tests fail — we still want to parse timings
}

try {
  rawJson = JSON.parse(
    await import('fs').then(m => m.readFileSync(JSON_TMP, 'utf8'))
  );
} catch {
  // Fallback: try native fs read (top-level await may not work in all Node versions)
  const { readFileSync } = await import('fs');
  try {
    rawJson = JSON.parse(readFileSync(JSON_TMP, 'utf8'));
  } catch (e) {
    console.error('❌  Failed to parse vitest JSON output:', e.message);
    process.exit(1);
  }
}

const totalWallMs = Date.now() - start;

// ---------------------------------------------------------------------------
// 2. Extract per-test timing
// ---------------------------------------------------------------------------
/** @type {{ file: string, suite: string, name: string, durationMs: number, status: string }[]} */
const tests = [];

for (const testFile of rawJson.testResults ?? []) {
  const filePath = testFile.name ?? testFile.testFilePath ?? '';
  const relPath = filePath.replace(ROOT + '/', '');

  // Skip excluded patterns
  if (EXCLUDE_PATTERNS.some(p => relPath.includes(p))) {
    continue;
  }

  // Derive component name from file path: src/components/ui/forms/button.test.tsx → Button
  // Handles __tests__ directory: src/components/ui/core/__tests__/popover.test.tsx → Core / Popover
  const componentMatch = relPath.match(/\/ui\/([^/]+)\/(?:__tests__\/)?([^/]+)\.test\./);
  const component = componentMatch
    ? `${capitalize(componentMatch[1])} / ${capitalize(componentMatch[2].replace(/-/g, ' '))}`
    : relPath.replace(/^src\//, '');

  for (const assertionResult of testFile.assertionResults ?? []) {
    tests.push({
      file: relPath,
      component,
      name: assertionResult.fullName ?? assertionResult.title ?? '(unnamed)',
      durationMs: assertionResult.duration ?? 0,
      status: assertionResult.status ?? 'unknown',
    });
  }
}

// ---------------------------------------------------------------------------
// 3. Compute statistics
// ---------------------------------------------------------------------------
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function percentile(sortedArr, p) {
  if (!sortedArr.length) return 0;
  const idx = Math.ceil((p / 100) * sortedArr.length) - 1;
  return round1(sortedArr[Math.max(0, idx)]);
}

function mean(arr) {
  if (!arr.length) return 0;
  return round1(arr.reduce((a, b) => a + b, 0) / arr.length);
}

function bar(value, max, width = 20) {
  const filled = Math.round((value / max) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

const durations = tests.map(t => t.durationMs).sort((a, b) => a - b);
const passing = tests.filter(t => t.status === 'passed');
const failing = tests.filter(t => t.status === 'failed');
const skipped = tests.filter(t => t.status === 'pending' || t.status === 'skipped');

const globalStats = {
  count: tests.length,
  passing: passing.length,
  failing: failing.length,
  skipped: skipped.length,
  mean: mean(durations),
  p50: percentile(durations, 50),
  p95: percentile(durations, 95),
  p99: percentile(durations, 99),
  max: round1(durations[durations.length - 1] ?? 0),
  min: round1(durations[0] ?? 0),
  totalWallMs,
};

// Per-component breakdown
/** @type {Map<string, { durations: number[], pass: number, fail: number }>} */
const byComponent = new Map();

for (const t of tests) {
  if (!byComponent.has(t.component)) {
    byComponent.set(t.component, { durations: [], pass: 0, fail: 0 });
  }
  const entry = byComponent.get(t.component);
  entry.durations.push(t.durationMs);
  if (t.status === 'passed') entry.pass++;
  else if (t.status === 'failed') entry.fail++;
}

// Sort by P95 desc
const componentRows = [...byComponent.entries()]
  .map(([comp, data]) => {
    const sorted = [...data.durations].sort((a, b) => a - b);
    return {
      component: comp,
      count: data.durations.length,
      pass: data.pass,
      fail: data.fail,
      mean: mean(sorted),
      p50: percentile(sorted, 50),
      p95: percentile(sorted, 95),
      p99: percentile(sorted, 99),
    };
  })
  .sort((a, b) => b.p95 - a.p95);

// Slowest individual tests (top 15)
const slowest = [...tests]
  .sort((a, b) => b.durationMs - a.durationMs)
  .slice(0, 15)
  .map(t => ({ ...t, durationMs: round1(t.durationMs) }));

// ---------------------------------------------------------------------------
// 4. Generate Markdown
// ---------------------------------------------------------------------------
const now = new Date().toISOString().replace('T', ' ').replace(/\..+/, '') + ' UTC';
const maxP95 = Math.max(...componentRows.map(r => r.p95), 1);

const md = `# ⚡ Component Library — Performance Report

> **Generated:** ${now}  
> **Test suite:** \`@umesh0492/react-libs\`  
> **Total wall time:** ${(totalWallMs / 1000).toFixed(2)}s  
> **Note:** Documentation and Storybook stories are excluded from this report to focus on core component logic performance.

---

## 📊 Global Summary

| Metric | Value |
|---|---|
| Total tests | **${globalStats.count}** |
| ✅ Passing | **${globalStats.passing}** |
| ❌ Failing | **${globalStats.failing}** |
| ⏭ Skipped | **${globalStats.skipped}** |
| Mean duration | **${globalStats.mean} ms** |
| P50 (median) | **${globalStats.p50} ms** |
| P95 | **${globalStats.p95} ms** |
| P99 | **${globalStats.p99} ms** |
| Slowest test | **${globalStats.max} ms** |
| Fastest test | **${globalStats.min} ms** |

---

## 🧩 Per-Component Breakdown

> Sorted by P95 latency (slowest first). Bar chart is relative to highest P95 = ${maxP95}ms.

| Component | Tests | Pass | Fail | Mean | P50 | P95 | P99 | Latency Profile |
|---|---|---|---|---|---|---|---|---|
${componentRows
  .map(
    r =>
      `| ${r.component} | ${r.count} | ${r.pass} | ${r.fail === 0 ? r.fail : `**${r.fail}**`} | ${r.mean}ms | ${r.p50}ms | ${r.p95}ms | ${r.p99}ms | \`${bar(r.p95, maxP95)}\` |`
  )
  .join('\n')}

---

## 🐌 15 Slowest Individual Tests

| # | Test | Duration |
|---|---|---|
${slowest
  .map(
    (t, i) =>
      `| ${i + 1} | \`${t.name}\` | **${t.durationMs}ms** |`
  )
  .join('\n')}

---

## 📈 Duration Distribution

\`\`\`
P50 ─────── ${globalStats.p50}ms   ${'░'.repeat(Math.round((globalStats.p50 / (globalStats.max || 1)) * 40))}
P95 ─────── ${globalStats.p95}ms   ${'█'.repeat(Math.round((globalStats.p95 / (globalStats.max || 1)) * 40))}
P99 ─────── ${globalStats.p99}ms   ${'█'.repeat(Math.round((globalStats.p99 / (globalStats.max || 1)) * 40))}
MAX ─────── ${globalStats.max}ms   ${'█'.repeat(40)}
\`\`\`

---

## ✅ Interpretation Guide

| P-value | Threshold | Meaning |
|---|---|---|
| **P50 < 50ms** | 🟢 Excellent | Median test is fast — good baseline |
| **P95 < 200ms** | 🟢 Good | 95% of tests complete quickly |
| **P99 < 500ms** | 🟡 Acceptable | Long-tail tests under 500ms |
| **P99 > 500ms** | 🔴 Investigate | Check for async timeouts or heavy renders |

---

*Report auto-generated by \`scripts/generate-performance-report.mjs\`. Run \`npm run perf\` to regenerate.*
`;

// ---------------------------------------------------------------------------
// 5. Write outputs — Markdown + JSON for Storybook dashboard
// ---------------------------------------------------------------------------
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, md, 'utf8');

// Write structured JSON for the Storybook Performance story to consume
const jsonData = {
  generatedAt: now,
  totalWallMs,
  global: globalStats,
  components: componentRows,
  slowest,
};

const storiesDir = join(ROOT, 'src', 'stories');
mkdirSync(storiesDir, { recursive: true });
writeFileSync(
  join(storiesDir, 'performance-data.json'),
  JSON.stringify(jsonData, null, 2),
  'utf8'
);

// Cleanup temp file
try {
  const { unlinkSync } = await import('fs');
  unlinkSync(JSON_TMP);
} catch { /* ignore */ }

console.log(`✅  Report written to docs/performance-report.md`);
console.log(`✅  Data written to src/stories/performance-data.json`);
console.log(`\n📊  Summary:`);
console.log(`    Tests : ${globalStats.count} (${globalStats.passing} pass, ${globalStats.failing} fail)`);
console.log(`    P50   : ${globalStats.p50}ms`);
console.log(`    P95   : ${globalStats.p95}ms`);
console.log(`    P99   : ${globalStats.p99}ms`);
console.log(`    Wall  : ${(totalWallMs / 1000).toFixed(2)}s`);

// ---------------------------------------------------------------------------
// 6. Performance Gate Check
// ---------------------------------------------------------------------------
const THRESHOLD = parseInt(process.env.PERF_P95_THRESHOLD || '400', 10);
if (globalStats.p95 > THRESHOLD) {
  console.error(`\n❌  PERFORMANCE GATE FAILED`);
  console.error(`    Global P95 latency (${globalStats.p95}ms) exceeds threshold (${THRESHOLD}ms).`);
  console.error(`    Check docs/performance-report.md for details.`);
  process.exit(1);
}

// Also check individual components
const INDIVIDUAL_THRESHOLD_MULTIPLIER = 3.0; // Allow 3.0x for individual components (accounts for cold start/JSDOM overhead)
const slowComponents = componentRows.filter(r => r.p95 > THRESHOLD * INDIVIDUAL_THRESHOLD_MULTIPLIER); 

if (slowComponents.length > 0) {
  console.error(`\n❌  PERFORMANCE GATE FAILED (Individual Components)`);
  for (const c of slowComponents) {
    console.error(`    ${c.component}: P95 is ${c.p95}ms (Limit: ${THRESHOLD * INDIVIDUAL_THRESHOLD_MULTIPLIER}ms)`);
  }
  process.exit(1);
}

console.log(`\n✅  Performance gate passed (Threshold: ${THRESHOLD}ms)`);
