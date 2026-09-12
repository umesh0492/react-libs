#!/usr/bin/env node
/**
 * scripts/verify-release-version.mjs
 *
 * Verifies that:
 * 1. The version declared in package.json exists as a section in CHANGELOG.md (## [version]).
 * 2. If running during a Git tag build in CI (e.g. GITHUB_REF_NAME / refs/tags/),
 *    the tag matches the package.json version (supporting optional 'v' prefix).
 */

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const PACKAGE_JSON_PATH = join(ROOT, 'package.json');
const CHANGELOG_PATH = join(ROOT, 'CHANGELOG.md');

function verifyReleaseVersion() {
  console.log('\n🔍 Verifying Release Version & Changelog Alignment...\n');

  if (!existsSync(PACKAGE_JSON_PATH)) {
    console.error('❌ package.json not found at:', PACKAGE_JSON_PATH);
    process.exit(1);
  }

  if (!existsSync(CHANGELOG_PATH)) {
    console.error('❌ CHANGELOG.md not found at:', CHANGELOG_PATH);
    process.exit(1);
  }

  const pkg = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  const version = pkg.version;

  if (!version) {
    console.error('❌ package.json is missing a "version" field.');
    process.exit(1);
  }

  console.log(`📌 Target package.json version: v${version}`);

  const changelog = readFileSync(CHANGELOG_PATH, 'utf8');

  // Extract the topmost release section from CHANGELOG.md
  const topMatch = changelog.match(/^##\s+\[v?([0-9]+\.[0-9]+\.[0-9]+[^\]]*)\]/m);
  if (!topMatch || !topMatch[1]) {
    console.error('❌ Could not extract top release version (## [x.y.z]) from CHANGELOG.md');
    process.exit(1);
  }
  const topVersion = topMatch[1].trim();

  if (version !== topVersion) {
    console.error(`❌ package.json version "${version}" does not match top CHANGELOG.md release "${topVersion}".`);
    console.error(`   The package version must correspond to the latest/top release entry.`);
    process.exit(1);
  }

  console.log(`✅ CHANGELOG.md topmost release section matches: "## [${version}]"`);

  // Verify Git Tag in CI environments if triggered by tag push
  const refType = process.env.GITHUB_REF_TYPE;
  const refName = process.env.GITHUB_REF_NAME;
  const githubRef = process.env.GITHUB_REF || '';

  const isTagBuild = refType === 'tag' || githubRef.startsWith('refs/tags/') || (refName && /^v?\d+\.\d+\.\d+/.test(refName));

  if (isTagBuild && refName) {
    const cleanTag = refName.replace(/^v/, '');
    if (cleanTag !== version) {
      console.error(`❌ Tag mismatch detected in CI:`);
      console.error(`   Git Tag (GITHUB_REF_NAME) : "${refName}" (parsed as "${cleanTag}")`);
      console.error(`   package.json version      : "${version}"`);
      console.error(`   Both must be identical for release builds!`);
      process.exit(1);
    }
    console.log(`✅ Git Tag "${refName}" matches package.json version "${version}"`);
  } else {
    console.log(`ℹ️  Non-tag build (or local run) — Git tag verification skipped.`);
  }

  console.log('\n✅ All release version verification checks passed!\n');
  process.exit(0);
}

verifyReleaseVersion();
