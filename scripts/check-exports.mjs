#!/usr/bin/env node
/**
 * check-exports.mjs
 *
 * Verifies:
 * 1. All UI components in src/components/ui/ are exported from src/index.ts (unless exempt).
 * 2. All India UI components in src/india/components/ are exported from src/india/react/index.ts.
 * 3. All India domain modules in src/india/ are exported from src/india/index.ts.
 * 4. Invariant: src/index.ts does NOT leak/re-export any India domain modules.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const UI_DIR = join(ROOT, 'src', 'components', 'ui');
const ENTRY_FILE = join(ROOT, 'src', 'index.ts');
const INDIA_DIR = join(ROOT, 'src', 'india');
const INDIA_ENTRY = join(INDIA_DIR, 'index.ts');
const INDIA_REACT_ENTRY = join(INDIA_DIR, 'react', 'index.ts');
const INDIA_COMPONENTS_DIR = join(INDIA_DIR, 'components');

function getFiles(dir, allFiles = []) {
  if (!existsSync(dir)) return allFiles;
  const files = readdirSync(dir);
  for (const file of files) {
    const name = join(dir, file);
    if (statSync(name).isDirectory()) {
      getFiles(name, allFiles);
    } else {
      if (file.endsWith('.tsx') && !file.endsWith('.test.tsx') && !file.endsWith('.stories.tsx')) {
        allFiles.push(name);
      }
    }
  }
  return allFiles;
}

const componentFiles = getFiles(UI_DIR);
const entryContent = readFileSync(ENTRY_FILE, 'utf8');

// Subpath exemptions (e.g. dedicated subpaths / client-only components)
const SUBPATH_EXEMPTIONS = ['components/ui/data-display/pdf-viewer'];

const missing = [];

for (const file of componentFiles) {
  const relPath = relative(join(ROOT, 'src'), file).replace(/\.tsx$/, '');
  const fileName = file.split('/').pop().replace(/\.tsx$/, '');
  
  if (SUBPATH_EXEMPTIONS.includes(relPath)) {
    continue;
  }
  
  // Check for export * from './path' or export { name } from './path'
  const exportPattern = new RegExp(`from\\s+['"]\\.\\/${relPath}['"]`, 'i');
  
  if (!exportPattern.test(entryContent)) {
    missing.push({
      file: relPath,
      name: fileName
    });
  }
}

if (missing.length > 0) {
  console.error('❌  MISSING UI EXPORTS FOUND');
  console.error('    The following components are defined but not exported from src/index.ts:\n');
  for (const m of missing) {
    console.error(`    - ${m.name} (${m.file}.tsx)`);
  }
  console.error('\n    Add them to src/index.ts to fix this error.');
  process.exit(1);
}

// ─── India React Component Exports ──────────────────────────────────────────
if (existsSync(INDIA_REACT_ENTRY) && existsSync(INDIA_COMPONENTS_DIR)) {
  const indiaReactContent = readFileSync(INDIA_REACT_ENTRY, 'utf8');
  const indiaComponents = getFiles(INDIA_COMPONENTS_DIR);
  const missingIndiaComponents = [];

  for (const file of indiaComponents) {
    const baseName = file.split('/').pop().replace(/\.tsx$/, '');
    const pattern = new RegExp(`from\\s+['"].*${baseName}['"]`, 'i');
    if (!pattern.test(indiaReactContent)) {
      missingIndiaComponents.push(baseName);
    }
  }

  if (missingIndiaComponents.length > 0) {
    console.error('❌  MISSING INDIA REACT EXPORTS FOUND');
    console.error('    The following components are missing from src/india/react/index.ts:\n');
    for (const name of missingIndiaComponents) {
      console.error(`    - ${name}`);
    }
    process.exit(1);
  }
}

// ─── India Pure Domain Exports ──────────────────────────────────────────────
if (existsSync(INDIA_ENTRY)) {
  const indiaContent = readFileSync(INDIA_ENTRY, 'utf8');
  const indiaModules = ['validators', 'tax', 'constants', 'locations'];
  for (const mod of indiaModules) {
    const pattern = new RegExp(`from\\s+['"]\\.\\/${mod}['"]`, 'i');
    if (!pattern.test(indiaContent)) {
      console.error(`❌  MISSING INDIA DOMAIN EXPORT: ${mod} is not exported in src/india/index.ts`);
      process.exit(1);
    }
  }
}

// ─── Domain Isolation Invariant ─────────────────────────────────────────────
if (/from\s+['"]\.\/india/i.test(entryContent)) {
  console.error('❌  DOMAIN LEAK: src/index.ts imports from ./india! Core must remain domain-neutral.');
  process.exit(1);
}

// ─── Analytics Client Isolation Invariant ──────────────────────────────────
if (/from\s+['"]\.\/lib\/analytics\/react/i.test(entryContent) || /from\s+['"]\.\/analytics\/react/i.test(entryContent)) {
  console.error('❌  CLIENT LEAK: src/index.ts must not import ./analytics/react! Analytics client must remain isolated.');
  process.exit(1);
}

const ANALYTICS_ENTRY = join(ROOT, 'src', 'lib', 'analytics', 'index.ts');
if (existsSync(ANALYTICS_ENTRY)) {
  const analyticsContent = readFileSync(ANALYTICS_ENTRY, 'utf8');
  if (/from\s+['"]\.\/react/i.test(analyticsContent)) {
    console.error('❌  BOUNDARY LEAK: src/lib/analytics/index.ts must not export ./react! Pure engine must be isolated from React.');
    process.exit(1);
  }
}

console.log('✅  All UI components and subpath exports are properly verified.');
process.exit(0);
