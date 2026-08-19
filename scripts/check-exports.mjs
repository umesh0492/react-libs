#!/usr/bin/env node
/**
 * check-exports.mjs
 *
 * Verifies that all components in src/components/ui/ are exported from src/index.ts.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const UI_DIR = join(ROOT, 'src', 'components', 'ui');
const ENTRY_FILE = join(ROOT, 'src', 'index.ts');

function getFiles(dir, allFiles = []) {
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

const missing = [];

for (const file of componentFiles) {
  const relPath = relative(join(ROOT, 'src'), file).replace(/\.tsx$/, '');
  const fileName = file.split('/').pop().replace(/\.tsx$/, '');
  
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
  console.error('❌  MISSING EXPORTS FOUND');
  console.error('    The following components are defined but not exported from src/index.ts:\n');
  for (const m of missing) {
    console.error(`    - ${m.name} (${m.file}.tsx)`);
  }
  console.error('\n    Add them to src/index.ts to fix this error.');
  process.exit(1);
}

console.log('✅  All UI components are properly exported.');
process.exit(0);
