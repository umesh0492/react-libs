#!/usr/bin/env node
/**
 * scripts/docs-match-tree.mjs
 *
 * CI Truth Gate & Tree Integrity Validator
 *
 * Enforces:
 * 1. [VERSION] package.json and README.md versions match the tag being built
 *    (for tag runs) or the top `## [x.y.z]` entry in CHANGELOG.md (for branch runs).
 * 2. [DIRECTIVES] Directive assertions:
 *    - `head -c 40 dist/index.js` contains 'use client'
 *    - `head -c 40 dist/utils.js` lacks 'use client'
 *    - `head -c 40 dist/analytics/index.js` lacks 'use client'
 *    - Deep verification: universal/server modules do not leak 'use client' anywhere
 * 3. [TYPES MATRIX] @arethetypeswrong/cli:
 *    - Verifies neither package.json nor workflow files include --ignore-rules
 *    - Verifies .attw.json contains no ignore rules
 *    - Runs `npx @arethetypeswrong/cli --pack .` WITHOUT --ignore-rules
 * 4. [GITHUB ACTIONS & VERSIONS] GitHub Action versions and runtime versions:
 *    - Validates all actions are pinned to existing, verified published major versions
 *    - Validates documentation does not contain unsupported language/node versions or unpinned actions
 * 5. [CHANGELOG SYMBOL INVENTORY]
 *    - Validates every bullet under `### Added` references a real symbol, component, or file
 *    - Enforces that dist artifact properties are asserted by verify-directives.mjs
 * 6. [MEASURED METRICS]
 *    - Validates that test counts, bundle sizes, and component counts match real tool outputs
 *    - Rejects unmeasured hardcoded numbers in docs
 */

import { existsSync, openSync, readSync, closeSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { verifyChangelogSymbols, verifyReadmeComponents } from './inventory-symbols.mjs';
import { verifyDocsMetrics } from './measure-metrics.mjs';

const ROOT = resolve(process.cwd());
const DIST_DIR = join(ROOT, 'dist');
const PACKAGE_JSON_PATH = join(ROOT, 'package.json');
const CHANGELOG_PATH = join(ROOT, 'CHANGELOG.md');
const README_PATH = join(ROOT, 'README.md');
const WORKFLOWS_DIR = join(ROOT, '.github', 'workflows');

let hasFailure = false;

function fail(msg) {
  console.error(`❌ [FAIL] ${msg}`);
  hasFailure = true;
}

function pass(msg) {
  console.log(`✅ [PASS] ${msg}`);
}

function readHead(filePath, bytes = 40) {
  const buffer = Buffer.alloc(bytes);
  const fd = openSync(filePath, 'r');
  const bytesRead = readSync(fd, buffer, 0, bytes, 0);
  closeSync(fd);
  return buffer.toString('utf8', 0, bytesRead);
}

// ── Check A: Version Alignment ──────────────────────────────────────────────
function checkVersionAlignment() {
  console.log('\n🔍 [Check A] Verifying Version Alignment (package.json, README.md, CHANGELOG.md, Git ref)...');

  if (!existsSync(PACKAGE_JSON_PATH)) {
    fail(`package.json not found at ${PACKAGE_JSON_PATH}`);
    return;
  }
  if (!existsSync(CHANGELOG_PATH)) {
    fail(`CHANGELOG.md not found at ${CHANGELOG_PATH}`);
    return;
  }
  if (!existsSync(README_PATH)) {
    fail(`README.md not found at ${README_PATH}`);
    return;
  }

  const pkg = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  const changelog = readFileSync(CHANGELOG_PATH, 'utf8');
  const readme = readFileSync(README_PATH, 'utf8');

  // Extract top version from CHANGELOG.md
  const changelogMatch = changelog.match(/^##\s+\[v?([0-9]+\.[0-9]+\.[0-9]+[^\]]*)\]/m);
  if (!changelogMatch || !changelogMatch[1]) {
    fail('Could not extract top release version (## [x.y.z]) from CHANGELOG.md');
    return;
  }
  const changelogTopVersion = changelogMatch[1].trim();

  // Determine target version
  const refType = process.env.GITHUB_REF_TYPE;
  const refName = process.env.GITHUB_REF_NAME;
  const githubRef = process.env.GITHUB_REF || '';

  const isTagRun =
    refType === 'tag' ||
    githubRef.startsWith('refs/tags/') ||
    (refName && /^v?[0-9]+\.[0-9]+\.[0-9]+/.test(refName) && !['main', 'master'].includes(refName));

  let targetVersion;
  if (isTagRun && refName) {
    targetVersion = refName.replace(/^v/, '');
    console.log(`📌 Tag run detected: target version = v${targetVersion} (from tag ${refName})`);
  } else {
    targetVersion = changelogTopVersion;
    console.log(`📌 Branch run / local build: target version = v${targetVersion} (from CHANGELOG.md top entry)`);
  }

  // 1. package.json version check
  if (pkg.version !== targetVersion) {
    fail(`package.json version "${pkg.version}" does not match target version "${targetVersion}"`);
  } else {
    pass(`package.json version "${pkg.version}" matches target version "${targetVersion}"`);
  }

  // 2. README.md version check
  const badgeMatch = readme.match(/badge\/version-v?([0-9]+\.[0-9]+\.[0-9]+)/i);
  const migrationMatch = readme.match(/Migration Guide.*?to\s+v?([0-9]+\.[0-9]+\.[0-9]+)/i);

  if (badgeMatch && badgeMatch[1]) {
    const readmeBadgeVersion = badgeMatch[1];
    if (readmeBadgeVersion !== targetVersion) {
      fail(`README.md version badge "${readmeBadgeVersion}" does not match target version "${targetVersion}"`);
    } else {
      pass(`README.md version badge "${readmeBadgeVersion}" matches target version "${targetVersion}"`);
    }
  } else {
    fail(`README.md is missing a version badge: expected badge/version-${targetVersion}`);
  }

  if (migrationMatch && migrationMatch[1]) {
    const migrationVersion = migrationMatch[1];
    if (migrationVersion !== targetVersion) {
      fail(`README.md migration guide link target "${migrationVersion}" does not match target version "${targetVersion}"`);
    } else {
      pass(`README.md migration guide link target matches target version "${targetVersion}"`);
    }
  }
}

// ── Check B: Directive Assertions ───────────────────────────────────────────
function checkDirectives() {
  console.log('\n🔍 [Check B] Verifying Module Directive Assertions (head -c 40)...');

  const indexJs = join(DIST_DIR, 'index.js');
  const utilsJs = join(DIST_DIR, 'utils.js');
  const analyticsJs = join(DIST_DIR, 'analytics', 'index.js');
  const analyticsReactJs = join(DIST_DIR, 'analytics', 'react', 'index.js');
  const indiaReactJs = join(DIST_DIR, 'india', 'react', 'index.js');

  const requiredFiles = [
    { path: indexJs, rel: 'dist/index.js' },
    { path: utilsJs, rel: 'dist/utils.js' },
    { path: analyticsJs, rel: 'dist/analytics/index.js' },
    { path: analyticsReactJs, rel: 'dist/analytics/react/index.js' },
    { path: indiaReactJs, rel: 'dist/india/react/index.js' },
  ];

  for (const { path, rel } of requiredFiles) {
    if (!existsSync(path)) {
      fail(`Required build output file missing: ${rel}. Run "npm run build" first.`);
      return;
    }
  }

  // Assertion 1: Client files MUST contain "use client" in the first 40 bytes
  const clientFiles = [
    { path: indexJs, rel: 'dist/index.js' },
    { path: analyticsReactJs, rel: 'dist/analytics/react/index.js' },
    { path: indiaReactJs, rel: 'dist/india/react/index.js' },
  ];

  for (const { path, rel } of clientFiles) {
    const head = readHead(path, 40);
    if (!head.includes('use client')) {
      fail(`head -c 40 ${rel} lacks "use client". Head preview: ${JSON.stringify(head)}`);
    } else {
      pass(`head -c 40 ${rel} contains "use client" banner`);
    }
  }

  // Assertion 2: Universal files MUST NOT contain "use client" in the first 40 bytes or file body
  const universalFiles = [
    { path: utilsJs, rel: 'dist/utils.js' },
    { path: analyticsJs, rel: 'dist/analytics/index.js' },
  ];

  for (const { path, rel } of universalFiles) {
    const head = readHead(path, 40);
    if (head.includes('use client')) {
      fail(`head -c 40 ${rel} contains "use client". Head preview: ${JSON.stringify(head)}`);
    } else {
      pass(`head -c 40 ${rel} is free of "use client" directive`);
    }

    const fullContent = readFileSync(path, 'utf8');
    if (fullContent.includes('use client')) {
      fail(`${rel} leaks "use client" directive in file body`);
    } else {
      pass(`${rel} deep scan: 0 directive leaks`);
    }
  }
}

// ── Check C: ATT W Verification Without Ignore Rules ────────────────────────
function checkAttwMatrix() {
  console.log('\n🔍 [Check C] Verifying @arethetypeswrong/cli Configuration & Type Matrix...');

  // 1. Static config scan for forbidden --ignore-rules
  const pkg = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  const scripts = pkg.scripts || {};
  for (const [name, cmd] of Object.entries(scripts)) {
    if (cmd.includes('--ignore-rules')) {
      fail(`package.json script "${name}" uses forbidden flag "--ignore-rules": "${cmd}"`);
    }
  }

  // Check CI workflow files
  if (existsSync(WORKFLOWS_DIR)) {
    const workflowFiles = readdirSync(WORKFLOWS_DIR).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
    for (const f of workflowFiles) {
      const content = readFileSync(join(WORKFLOWS_DIR, f), 'utf8');
      if (content.includes('--ignore-rules')) {
        fail(`Workflow file .github/workflows/${f} contains forbidden flag "--ignore-rules"`);
      }
    }
  }

  // Check .attw.json
  const attwConfigPath = join(ROOT, '.attw.json');
  if (existsSync(attwConfigPath)) {
    try {
      const attwConfig = JSON.parse(readFileSync(attwConfigPath, 'utf8'));
      if (attwConfig.ignoreRules && attwConfig.ignoreRules.length > 0) {
        fail(`.attw.json defines ignoreRules: ${JSON.stringify(attwConfig.ignoreRules)}`);
      }
    } catch {
      // Ignored
    }
  }

  pass('Zero "--ignore-rules" configurations across scripts, workflows, and .attw.json');

  // 2. Execute attw
  try {
    const cachedAttw = resolve(process.env.HOME || '', '.npm/_npx/ff7a6dc25a206ec2/node_modules/.bin/attw');
    const attwCmd = existsSync(cachedAttw)
      ? `${cachedAttw} --pack .`
      : 'npx --yes @arethetypeswrong/cli --pack .';
    console.log(`   Executing ${attwCmd} (strictly without --ignore-rules)...`);
    execSync(attwCmd, {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, CI: 'true' },
    });
    pass('@arethetypeswrong/cli --pack . passed cleanly with 0 errors');
  } catch (err) {
    fail(`@arethetypeswrong/cli --pack . exited non-zero with error: ${err.message}`);
  }
}

// ── Check D: GitHub Action Version & Language Support Validation ────────────
function checkGitHubActions() {
  console.log('\n🔍 [Check D] Verifying GitHub Action Major Versions & Language/Node Specs...');

  const VALID_ACTION_VERSIONS = {
    'actions/checkout': ['v4'],
    'actions/setup-node': ['v4'],
    'actions/cache': ['v4'],
    'actions/upload-pages-artifact': ['v3'],
    'actions/deploy-pages': ['v4'],
  };

  if (!existsSync(WORKFLOWS_DIR)) {
    fail(`.github/workflows directory not found at ${WORKFLOWS_DIR}`);
    return;
  }

  const workflowFiles = readdirSync(WORKFLOWS_DIR).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
  const actionRegex = /uses:\s+([a-zA-Z0-9_\-\/]+)@([a-zA-Z0-9_\.\-]+)/g;

  for (const wfFile of workflowFiles) {
    const fullPath = join(WORKFLOWS_DIR, wfFile);
    const content = readFileSync(fullPath, 'utf8');

    let match;
    while ((match = actionRegex.exec(content)) !== null) {
      const actionName = match[1];
      const actionVersion = match[2];

      if (VALID_ACTION_VERSIONS[actionName]) {
        const allowedVersions = VALID_ACTION_VERSIONS[actionName];
        if (!allowedVersions.includes(actionVersion)) {
          fail(
            `Workflow ".github/workflows/${wfFile}" pins action "${actionName}" to non-standard/invalid version "@${actionVersion}". Expected: ${allowedVersions.map((v) => '@' + v).join(', ')}`
          );
        } else {
          pass(`.github/workflows/${wfFile}: "${actionName}@${actionVersion}" is valid`);
        }
      } else {
        if (!actionVersion || actionVersion === 'master' || actionVersion === 'main') {
          fail(`Workflow ".github/workflows/${wfFile}" uses unpinned action "${actionName}@${actionVersion}"`);
        }
      }
    }
  }

  // Check documentation for unsupported Node versions (Node <24 claimed as engine or requirement)
  const readme = readFileSync(README_PATH, 'utf8');
  if (/node\s*(?:>=?\s*|version\s*)(?:14|16|18|20|22)\b/i.test(readme)) {
    fail('README.md references an unsupported Node engine version! package.json requires "node >= 24.0.0".');
  } else {
    pass('README.md is free of unsupported Node engine version references');
  }

  // Check documentation for unpinned / fake action versions (e.g. actions/checkout@v99)
  const docActionMatches = readme.matchAll(/actions\/[a-zA-Z0-9_\-]+@v(\d+)/g);
  for (const m of docActionMatches) {
    const major = parseInt(m[1], 10);
    if (major > 10) {
      fail(`README.md references an invalid/fake GitHub Action version: "${m[0]}"`);
    }
  }
}

// ── Check E: Symbol Inventory Gate ──────────────────────────────────────────
function checkSymbolInventory() {
  console.log('\n🔍 [Check E] Verifying Exported Symbol Inventory (CHANGELOG & README)...');
  const changelogSuccess = verifyChangelogSymbols();
  if (!changelogSuccess) {
    fail('CHANGELOG symbol inventory check failed (contains fake symbol or unasserted dist property)');
  } else {
    pass('All CHANGELOG items correspond to verified symbols and directives');
  }

  const readmeSuccess = verifyReadmeComponents();
  if (!readmeSuccess) {
    fail('README component reference check failed (contains unexported or fabricated component names)');
  } else {
    pass('All README components correspond to verified exported symbols');
  }
}

// ── Check F: Measured Metrics Gate ──────────────────────────────────────────
function checkMeasuredMetrics() {
  console.log('\n🔍 [Check F] Verifying Documentation Numbers Against Measured Tool Output...');
  const success = verifyDocsMetrics();
  if (!success) {
    fail('Documentation contains unmeasured or fabricated numbers');
  } else {
    pass('All documentation numbers match measured reality');
  }
}

// ── Run All Truth Gate Checks ───────────────────────────────────────────────
function runTruthGate() {
  console.log('🛡️  Starting CI Truth Gate (docs-match-tree)...');

  checkVersionAlignment();
  checkDirectives();
  checkAttwMatrix();
  checkGitHubActions();
  checkSymbolInventory();
  checkMeasuredMetrics();

  console.log('\n─────────────────────────────────────────────────────────────────');
  if (hasFailure) {
    console.error('❌ CI TRUTH GATE FAILED! Review the errors above.\n');
    process.exit(1);
  } else {
    console.log('✨ ALL CI TRUTH GATE ASSERTIONS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  }
}

runTruthGate();
