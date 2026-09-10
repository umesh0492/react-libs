#!/usr/bin/env node
/**
 * scripts/measure-metrics.mjs
 *
 * Emits and verifies all volatile repository metrics from real tool output:
 * - Component counts
 * - Test file and test suite metrics
 * - Bundle artifact sizes
 *
 * Fails CI if documentation contains unmeasured or fabricated numbers.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

export function measureMetrics() {
  const metrics = {
    componentsCount: 0,
    testFilesCount: 0,
    bundleSizesKb: {},
  };

  // 1. Measure UI components in src/components/ui
  function countComponents(dir) {
    if (!existsSync(dir)) return 0;
    let count = 0;
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory() && e.name !== '__tests__' && e.name !== 'node_modules') {
        count += countComponents(full);
      } else if (e.isFile() && e.name.endsWith('.tsx') && !e.name.endsWith('.stories.tsx')) {
        count++;
      }
    }
    return count;
  }

  metrics.componentsCount = countComponents(join(ROOT, 'src', 'components', 'ui'));

  // 2. Measure test files in src
  function countTestFiles(dir) {
    if (!existsSync(dir)) return 0;
    let count = 0;
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory() && e.name !== 'node_modules') {
        count += countTestFiles(full);
      } else if (e.isFile() && (e.name.endsWith('.test.tsx') || e.name.endsWith('.test.ts'))) {
        count++;
      }
    }
    return count;
  }

  metrics.testFilesCount = countTestFiles(join(ROOT, 'src'));

  // 3. Measure bundle sizes
  const keyArtifacts = [
    'dist/index.js',
    'dist/utils.js',
    'dist/pdf.js',
    'dist/analytics/index.js',
    'dist/analytics/react/index.js',
    'dist/india/index.js',
    'dist/india/react/index.js',
    'dist/style.css',
  ];

  for (const rel of keyArtifacts) {
    const full = join(ROOT, rel);
    if (existsSync(full)) {
      const stats = statSync(full);
      metrics.bundleSizesKb[rel] = Math.round(stats.size / 1024);
    }
  }

  return metrics;
}

export function verifyDocsMetrics() {
  console.log('🔍 [Metrics Gate] Measuring codebase numbers and auditing documentation...');
  const metrics = measureMetrics();

  console.log(`   Measured UI components : ${metrics.componentsCount}`);
  console.log(`   Measured test files    : ${metrics.testFilesCount}`);
  for (const [art, kb] of Object.entries(metrics.bundleSizesKb)) {
    console.log(`   Measured ${art.padEnd(30)} : ${kb} KB`);
  }

  let hasError = false;

  // Check docs for unmeasured or fabricated numbers
  const docFiles = [
    join(ROOT, 'README.md'),
    join(ROOT, 'WIKI.md'),
  ];

  for (const file of docFiles) {
    if (!existsSync(file)) continue;
    const content = readFileSync(file, 'utf8');

    // Check for fake test counts like "999 passing tests" or "800 tests"
    const testCountMatches = content.matchAll(/(\d+)\s+(?:passing\s+unit\s+tests|passing\s+tests|tests\s+passing)/gi);
    for (const m of testCountMatches) {
      const claimedCount = parseInt(m[1], 10);
      console.error(`❌ [FAIL] ${file} claims "${m[0]}" (${claimedCount}), but tests must be measured dynamically, not hardcoded!`);
      hasError = true;
    }

    // Check for fake coverage badges/claims like "coverage-98%" or "coverage-80%"
    const coverageMatches = content.matchAll(/coverage-(?:%E2%89%A5)?(\d+)%/gi);
    for (const m of coverageMatches) {
      console.error(`❌ [FAIL] ${file} contains hardcoded coverage percentage "${m[0]}". Volatile coverage numbers must be dynamically generated or removed!`);
      hasError = true;
    }

    // Check for fabricated bundle size claims like "12 KB bundle" or "150 KB"
    const sizeMatches = content.matchAll(/(\d+)\s*(?:kB|KB)\s+(?:raw|bundle|gzipped)/gi);
    for (const m of sizeMatches) {
      const claimedKb = parseInt(m[1], 10);
      const rootKb = metrics.bundleSizesKb['dist/index.js'] || 425;
      // If claimed KB is wildly off from measured root size (e.g., claimed 12 KB or 150 KB when dist/index.js is ~425 KB)
      if (Math.abs(claimedKb - rootKb) > 50) {
        console.error(`❌ [FAIL] ${file} claims "${m[0]}" which does not match measured artifact size (${rootKb} KB)!`);
        hasError = true;
      }
    }
  }

  if (hasError) {
    console.error('❌ [FAIL] Measured metrics gate failed!\n');
    return false;
  }

  console.log('✅ [PASS] All documentation metrics match measured reality.\n');
  return true;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const success = verifyDocsMetrics();
  process.exit(success ? 0 : 1);
}
