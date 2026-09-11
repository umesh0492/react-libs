#!/usr/bin/env node
/**
 * scripts/check-bundle-size.mjs
 *
 * Enforces strict size budgets on production build artifacts:
 * - dist/index.js (main UI component bundle)
 * - dist/utils.js (pure RSC utilities)
 * - dist/india/index.js (India compliance and domain bundle)
 * - dist/analytics/index.js (telemetry and analytics bundle)
 * - dist/pdf.js (PDF viewer subpath)
 * - dist/hooks/use-toast.js (toast notification hook)
 * - dist/style.css (compiled Tailwind v4 CSS bundle)
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());

// Size limits in Kilobytes (KB = 1024 bytes)
const BUDGETS = [
  {
    file: 'dist/index.js',
    label: 'Root UI Bundle (ESM)',
    maxRawKb: 460,
    maxGzipKb: 95,
  },
  {
    file: 'dist/utils.js',
    label: 'RSC Pure Utils (ESM)',
    maxRawKb: 12,
    maxGzipKb: 4,
  },
  {
    file: 'dist/india/index.js',
    label: 'India Pure Subpath (ESM)',
    maxRawKb: 25,
    maxGzipKb: 8,
  },
  {
    file: 'dist/india/react/index.js',
    label: 'India React Subpath (ESM)',
    maxRawKb: 30,
    maxGzipKb: 8,
  },
  {
    file: 'dist/analytics/index.js',
    label: 'Analytics Subpath (ESM)',
    maxRawKb: 40,
    maxGzipKb: 10,
  },
  {
    file: 'dist/pdf.js',
    label: 'PDF Subpath (ESM)',
    maxRawKb: 25,
    maxGzipKb: 7,
  },
  {
    file: 'dist/hooks/use-toast.js',
    label: 'use-toast Hook (ESM)',
    maxRawKb: 6,
    maxGzipKb: 2,
  },
  {
    file: 'dist/button.js',
    label: 'Button Subpath (ESM)',
    maxRawKb: 15,
    maxGzipKb: 5,
  },
  {
    file: 'dist/dialog.js',
    label: 'Dialog Subpath (ESM)',
    maxRawKb: 25,
    maxGzipKb: 8,
  },
  {
    file: 'dist/card.js',
    label: 'Card Subpath (ESM)',
    maxRawKb: 15,
    maxGzipKb: 5,
  },
  {
    file: 'dist/badge.js',
    label: 'Badge Subpath (ESM)',
    maxRawKb: 15,
    maxGzipKb: 5,
  },
  {
    file: 'dist/input.js',
    label: 'Input Subpath (ESM)',
    maxRawKb: 15,
    maxGzipKb: 5,
  },
  {
    file: 'dist/style.css',
    label: 'Compiled Tailwind CSS',
    maxRawKb: 180,
    maxGzipKb: 35,
  },
];

function formatKb(bytes) {
  return (bytes / 1024).toFixed(2) + ' KB';
}

function checkBundleSizes() {
  console.log('\n📦 Verifying Bundle Size Budgets...\n');

  let hasErrors = false;
  const results = [];

  for (const budget of BUDGETS) {
    const filePath = join(ROOT, budget.file);

    if (!existsSync(filePath)) {
      results.push({
        file: budget.file,
        label: budget.label,
        status: 'MISSING',
        error: `File not found: ${budget.file}. Did you run "npm run build"?`,
      });
      hasErrors = true;
      continue;
    }

    const content = readFileSync(filePath);
    const rawBytes = statSync(filePath).size;
    const gzipBytes = gzipSync(content).length;

    const rawKb = rawBytes / 1024;
    const gzipKb = gzipBytes / 1024;

    const rawPassed = rawKb <= budget.maxRawKb;
    const gzipPassed = gzipKb <= budget.maxGzipKb;
    const passed = rawPassed && gzipPassed;

    if (!passed) {
      hasErrors = true;
    }

    results.push({
      file: budget.file,
      label: budget.label,
      status: passed ? 'PASS' : 'FAIL',
      rawBytes,
      rawKb,
      maxRawKb: budget.maxRawKb,
      rawPassed,
      gzipBytes,
      gzipKb,
      maxGzipKb: budget.maxGzipKb,
      gzipPassed,
    });
  }

  // Print formatted report table
  const colFile = 24;
  const colRaw = 20;
  const colGzip = 20;
  const colStatus = 8;

  console.log(
    'Asset'.padEnd(colFile) +
    'Raw (Max Budget)'.padEnd(colRaw) +
    'Gzip (Max Budget)'.padEnd(colGzip) +
    'Status'.padEnd(colStatus)
  );
  console.log('─'.repeat(colFile + colRaw + colGzip + colStatus));

  for (const res of results) {
    if (res.status === 'MISSING') {
      console.log(
        res.file.padEnd(colFile) +
        'MISSING'.padEnd(colRaw) +
        'MISSING'.padEnd(colGzip) +
        '❌ FAIL'.padEnd(colStatus)
      );
      continue;
    }

    const rawStr = `${formatKb(res.rawBytes)} (<= ${res.maxRawKb} KB)`;
    const gzipStr = `${formatKb(res.gzipBytes)} (<= ${res.maxGzipKb} KB)`;
    const statusStr = res.status === 'PASS' ? '✅ PASS' : '❌ FAIL';

    console.log(
      res.file.padEnd(colFile) +
      rawStr.padEnd(colRaw) +
      gzipStr.padEnd(colGzip) +
      statusStr.padEnd(colStatus)
    );
  }

  console.log('─'.repeat(colFile + colRaw + colGzip + colStatus));

  if (hasErrors) {
    console.error('\n❌ Bundle size budget exceeded or required assets missing!');
    for (const res of results) {
      if (res.status === 'MISSING') {
        console.error(`  - ${res.file}: ${res.error}`);
      } else if (res.status === 'FAIL') {
        if (!res.rawPassed) {
          console.error(
            `  - ${res.file} (raw): ${formatKb(res.rawBytes)} exceeds budget of ${res.maxRawKb} KB (+${(res.rawKb - res.maxRawKb).toFixed(2)} KB)`
          );
        }
        if (!res.gzipPassed) {
          console.error(
            `  - ${res.file} (gzip): ${formatKb(res.gzipBytes)} exceeds budget of ${res.maxGzipKb} KB (+${(res.gzipKb - res.maxGzipKb).toFixed(2)} KB)`
          );
        }
      }
    }
    process.exit(1);
  }

  console.log('\n✅ All bundle size budgets passed successfully!\n');
  process.exit(0);
}

checkBundleSizes();
