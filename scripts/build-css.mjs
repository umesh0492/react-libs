#!/usr/bin/env node
/**
 * scripts/build-css.mjs
 *
 * Standalone CSS Architecture Build Script:
 * 1. Compiles src/styles/tailwind-bundle.css into dist/style.css using @tailwindcss/cli with --minify.
 * 2. Appends dist/index.css (extracted by tsup for calendar animations/component styles) if present.
 * 3. Verifies final file size and presence of utility classes (e.g. flex).
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, appendFileSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INPUT_CSS = join(ROOT, 'src', 'styles', 'tailwind-bundle.css');
const DIST_DIR = join(ROOT, 'dist');
const OUTPUT_CSS = join(DIST_DIR, 'style.css');
const INDEX_CSS = join(DIST_DIR, 'index.css');

async function buildCss() {
  console.log('🎨 Starting standalone CSS bundle build...');

  if (!existsSync(DIST_DIR)) {
    mkdirSync(DIST_DIR, { recursive: true });
  }

  if (!existsSync(INPUT_CSS)) {
    console.error(`❌ Input CSS file not found at ${INPUT_CSS}`);
    process.exit(1);
  }

  // 1. Run @tailwindcss/cli to build tailwind-bundle.css -> dist/style.css
  const localCli = join(ROOT, 'node_modules', '.bin', 'tailwindcss');
  const cliCommand = existsSync(localCli)
    ? `"${localCli}"`
    : 'npx --yes @tailwindcss/cli';

  console.log(`⚡ Compiling ${INPUT_CSS} -> ${OUTPUT_CSS}...`);
  try {
    execSync(`${cliCommand} -i "${INPUT_CSS}" -o "${OUTPUT_CSS}" --minify`, {
      cwd: ROOT,
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('❌ Tailwind CLI compilation failed:', error.message);
    process.exit(1);
  }

  // 2. Append dist/index.css if extracted by tsup
  if (existsSync(INDEX_CSS)) {
    console.log('📦 Found dist/index.css, appending extracted styles to dist/style.css...');
    const indexCssContent = readFileSync(INDEX_CSS, 'utf8');
    if (indexCssContent.trim().length > 0) {
      appendFileSync(OUTPUT_CSS, `\n/* Component styles extracted by tsup */\n${indexCssContent}\n`);
    }
  } else {
    console.log('ℹ️  No dist/index.css found to append.');
  }

  // 3. Verify output
  if (!existsSync(OUTPUT_CSS)) {
    console.error(`❌ Output file ${OUTPUT_CSS} does not exist.`);
    process.exit(1);
  }

  const stats = statSync(OUTPUT_CSS);
  const sizeKb = (stats.size / 1024).toFixed(2);
  const content = readFileSync(OUTPUT_CSS, 'utf8');

  // Verify utility classes (e.g. flex)
  const utilityChecks = ['flex'];
  const missing = utilityChecks.filter((cls) => !content.includes(cls));

  if (missing.length > 0) {
    console.error(`❌ Verification failed: missing expected utility classes (${missing.join(', ')})`);
    process.exit(1);
  }

  if (stats.size < 10000) {
    console.error(`❌ Verification warning/error: file size is suspiciously small (${sizeKb} KB)`);
    process.exit(1);
  }

  console.log(`✅ dist/style.css successfully generated and verified!`);
  console.log(`   Final size: ${sizeKb} KB (${stats.size.toLocaleString()} bytes)`);
  console.log(`   Verified utilities: ${utilityChecks.join(', ')} present.`);

  process.exit(0);
}

buildCss();
