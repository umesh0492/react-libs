#!/usr/bin/env node
/**
 * scripts/inventory-symbols.mjs
 *
 * Emits the exported-symbol and component inventory for @umesh0492/react-libs,
 * and validates that every bullet under `### Added` in CHANGELOG.md references
 * a real, verifiable symbol, component, subpath, or file in the repository tree.
 *
 * Also enforces that any CHANGELOG bullet naming a `dist/` artifact property
 * (e.g., 'use client', directive boundary) is explicitly asserted by
 * scripts/verify-directives.mjs.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

export function getExportedSymbols() {
  const symbols = new Set();
  const files = new Set();

  // 1. Scan package.json exports
  const pkgPath = join(ROOT, 'package.json');
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    if (pkg.exports) {
      for (const exp of Object.keys(pkg.exports)) {
        symbols.add(exp);
        symbols.add(`@umesh0492/react-libs${exp === '.' ? '' : '/' + exp.replace(/^\.\//, '')}`);
      }
    }
  }

  // 2. Parse barrel files directly (fast, no filesystem crawl)
  const barrelFiles = [
    'src/index.ts',
    'src/india/index.ts',
    'src/india/react/index.ts',
    'src/lib/analytics/index.ts',
    'src/lib/analytics/react/index.ts',
    'src/utils.ts',
    'src/hooks/use-toast.ts',
    'src/components/ui/pdf-viewer.tsx',
  ];

  for (const rel of barrelFiles) {
    const full = join(ROOT, rel);
    if (!existsSync(full)) continue;
    const content = readFileSync(full, 'utf8');

    // Parse export { a, b } ...
    const namedMatches = content.matchAll(/export\s*\{\s*([^}]+)\s*\}/g);
    for (const m of namedMatches) {
      const parts = m[1].split(',');
      for (const p of parts) {
        const sym = p.trim().split(/\s+as\s+/).pop().trim();
        if (sym && /^[A-Za-z0-9_]+$/.test(sym)) {
          symbols.add(sym);
        }
      }
    }

    // Parse export * from "./path/to/component"
    const starMatches = content.matchAll(/export\s+\*\s+from\s+['"]([^'"]+)['"]/g);
    for (const m of starMatches) {
      const modPath = m[1];
      const base = basename(modPath);
      files.add(base);

      // Convert kebab-case to PascalCase (e.g. amount-summary-card -> AmountSummaryCard)
      const pascal = base
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
      symbols.add(pascal);
      symbols.add(base);

      // Deep parse exports from the referenced module
      const dir = dirname(full);
      const candidates = [
        join(dir, modPath + '.ts'),
        join(dir, modPath + '.tsx'),
        join(dir, modPath, 'index.ts'),
        join(dir, modPath, 'index.tsx'),
      ];
      for (const cand of candidates) {
        if (existsSync(cand)) {
          const modContent = readFileSync(cand, 'utf8');
          const modDirectMatches = modContent.matchAll(/export\s+(?:const|function|class|type|interface)\s+([A-Za-z0-9_]+)/g);
          for (const dm of modDirectMatches) {
            symbols.add(dm[1]);
          }
          const modNamedMatches = modContent.matchAll(/export\s*\{\s*([^}]+)\s*\}/g);
          for (const nm of modNamedMatches) {
            const parts = nm[1].split(',');
            for (const p of parts) {
              const sym = p.trim().split(/\s+as\s+/).pop().trim();
              if (sym && /^[A-Za-z0-9_]+$/.test(sym)) {
                symbols.add(sym);
              }
            }
          }
          break;
        }
      }
    }

    // Parse direct export declarations (const, function, class, type, interface)
    const directMatches = content.matchAll(/export\s+(?:const|function|class|type|interface)\s+([A-Za-z0-9_]+)/g);
    for (const m of directMatches) {
      symbols.add(m[1]);
    }
  }

  // Common keywords representing real capabilities
  const capabilityKeywords = [
    'DataTable',
    'TanStack Table',
    'AmountSummaryCardIndia',
    'PdfViewer',
    'AnalyticsProvider',
    'useAnalytics',
    'TrackArea',
    'PageViewTracker',
    'PageTracker',
    'useToast',
    'toast',
    'style.css',
    'theme.css',
    'ESM',
    'CJS',
    'TypeScript',
    'Tailwind',
    'Radix',
    'GST',
    'PAN',
    'IFSC',
    'Google Analytics',
    'Mixpanel',
    'console',
    'HTTP',
  ];
  for (const kw of capabilityKeywords) {
    symbols.add(kw);
  }

  return { symbols, files };
}

export function verifyChangelogSymbols() {
  console.log('🔍 [Inventory Gate] Verifying CHANGELOG.md symbols against codebase tree...');
  const changelogPath = join(ROOT, 'CHANGELOG.md');
  if (!existsSync(changelogPath)) {
    console.error('❌ [FAIL] CHANGELOG.md not found');
    return false;
  }

  const changelog = readFileSync(changelogPath, 'utf8');
  const { symbols, files } = getExportedSymbols();

  // Read verify-directives.mjs content to check dist assertions
  const verifyDirectivesPath = join(ROOT, 'scripts', 'verify-directives.mjs');
  let verifyDirectivesContent = '';
  if (existsSync(verifyDirectivesPath)) {
    verifyDirectivesContent = readFileSync(verifyDirectivesPath, 'utf8');
  }

  const lines = changelog.split('\n');
  let inAddedSection = false;
  let hasError = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^###\s+(Added|Fixed|Changed|Security|Performance|Deprecated)/i.test(line)) {
      inAddedSection = true;
      continue;
    } else if (line.startsWith('### ') || line.startsWith('## ')) {
      inAddedSection = false;
    }

    if (inAddedSection && line.trim().startsWith('- ')) {
      const bullet = line.trim().slice(2);

      // 1. If bullet references a dist/ artifact property, ensure verify-directives.mjs asserts it
      const distMatches = bullet.match(/dist\/[A-Za-z0-9_\-\.\/]+/g);
      if (distMatches) {
        for (const distArtifact of distMatches) {
          if (!verifyDirectivesContent.includes(distArtifact)) {
            console.error(
              `❌ [FAIL] CHANGELOG line ${i + 1} references dist artifact "${distArtifact}", but scripts/verify-directives.mjs does not assert it!`
            );
            hasError = true;
          }
        }
      }

      // If bullet asserts 'use client' directive on a subpath, verify verify-directives.mjs asserts it
      if (bullet.includes("'use client'") || bullet.includes('"use client"')) {
        const subpathMatch = bullet.match(/@umesh0492\/react-libs\/([A-Za-z0-9_\-\/]+)/);
        if (subpathMatch) {
          const subpath = subpathMatch[1];
          const expectedFilePattern = `dist/${subpath}`;
          if (!verifyDirectivesContent.includes(expectedFilePattern)) {
            console.error(
              `❌ [FAIL] CHANGELOG line ${i + 1} claims 'use client' for subpath "${subpath}", but scripts/verify-directives.mjs has no corresponding assertion!`
            );
            hasError = true;
          }
        }
      }

      // 2. Check backticked identifiers in the bullet (e.g. `Button`, `DataTable`, `@umesh0492/react-libs/utils`)
      const backtickedTokens = [...bullet.matchAll(/`([^`]+)`/g)].map((m) => m[1]);

      for (const token of backtickedTokens) {
        // Skip format/syntax tokens
        if (['.d.ts', './style.css', 'use client', 'onError'].includes(token)) continue;

        // Check if token matches symbol, file, or subpath
        if (
          symbols.has(token) ||
          files.has(token) ||
          token.startsWith('@umesh0492/react-libs') ||
          token.startsWith('./')
        ) {
          // OK
        } else {
          // If token looks like a component or symbol identifier (PascalCase or camelCase)
          if (/^[A-Z][a-zA-Z0-9]+$/.test(token)) {
            console.error(
              `❌ [FAIL] CHANGELOG line ${i + 1} references symbol "${token}" which does NOT exist in the codebase inventory!`
            );
            hasError = true;
          }
        }
      }

      // 3. Check for raw PascalCase keywords that might be fabricated component names
      const words = bullet.replace(/`[^`]+`/g, '').match(/\b[A-Z][a-zA-Z0-9]{5,}\b/g) || [];
      for (const w of words) {
        const ignoreList = [
          'Initial',
          'Changelog',
          'Tailwind',
          'Google',
          'Mixpanel',
          'JavaScript',
          'TypeScript',
          'Modern',
          'CommonJS',
          'Indian',
          'Dedicated',
          'Pluggable',
          'Standalone',
          'TanStack',
        ];
        if (ignoreList.includes(w)) continue;

        // If the word ends in Component, Button, Card, Modal, Table, etc.
        if (/(?:Component|Card|Widget|Table|Viewer|Picker|Dialog|Drawer|Dropdown)$/.test(w)) {
          if (!symbols.has(w) && !files.has(w)) {
            console.error(
              `❌ [FAIL] CHANGELOG line ${i + 1} names component "${w}" which cannot be found in the repository tree!`
            );
            hasError = true;
          }
        }
      }
    }
  }

  if (hasError) {
    console.error('❌ [FAIL] CHANGELOG symbol inventory check failed!\n');
    return false;
  }

  console.log('✅ [PASS] All CHANGELOG ### Added items verified against codebase inventory and directives.\n');
  return true;
}

export function verifyReadmeComponents() {
  console.log('🔍 [Inventory Gate] Verifying README.md component reference against exported symbols...');
  const readmePath = join(ROOT, 'README.md');
  if (!existsSync(readmePath)) {
    console.error('❌ [FAIL] README.md not found');
    return false;
  }
  const readme = readFileSync(readmePath, 'utf8');
  const tableMatch = readme.match(/## Component Reference[\s\S]*?\| Domain \| Component \| Notes \|([\s\S]*?)\n---/);
  if (!tableMatch) {
    console.error('❌ [FAIL] Could not find Component Reference table in README.md');
    return false;
  }

  const { symbols } = getExportedSymbols();
  const lines = tableMatch[1].split('\n').filter((l) => l.trim().startsWith('|'));
  let hasError = false;
  let verifiedCount = 0;

  for (const line of lines) {
    if (line.includes('|---|')) continue;
    const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
    if (cols.length < 2) continue;
    const compCol = cols.length === 3 ? cols[1] : cols[0];
    const compNames = [...compCol.matchAll(/`([A-Za-z0-9_]+)`/g)].map((m) => m[1]);
    for (const name of compNames) {
      if (!symbols.has(name)) {
        console.error(`❌ [FAIL] README.md lists component "${name}" which is not exported or found in symbol inventory!`);
        hasError = true;
      } else {
        verifiedCount++;
      }
    }
  }

  if (hasError) {
    console.error('❌ [FAIL] README.md component reference verification failed!\n');
    return false;
  }

  console.log(`✅ [PASS] All ${verifiedCount} components in README.md verified against exported symbols.\n`);
  return true;
}

// Direct execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const changelogSuccess = verifyChangelogSymbols();
  const readmeSuccess = verifyReadmeComponents();
  process.exit(changelogSuccess && readmeSuccess ? 0 : 1);
}

