#!/usr/bin/env node
/**
 * scripts/extract-release-notes.mjs
 *
 * Extracts release notes for a specified version (or the current package.json version)
 * from CHANGELOG.md to use for GitHub Releases or distribution announcements.
 *
 * Usage:
 *   node scripts/extract-release-notes.mjs
 *   node scripts/extract-release-notes.mjs --version 0.5.1
 *   node scripts/extract-release-notes.mjs --output dist/release-notes.md
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const PACKAGE_JSON_PATH = join(ROOT, 'package.json');
const CHANGELOG_PATH = join(ROOT, 'CHANGELOG.md');

function parseArgs() {
  const args = process.argv.slice(2);
  let version = null;
  let outputFile = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--version' || arg === '-v') {
      version = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      outputFile = args[++i];
    } else if (arg && !arg.startsWith('-') && !version) {
      version = arg;
    }
  }

  return { version, outputFile };
}

function extractReleaseNotes() {
  const { version: targetVersionArg, outputFile } = parseArgs();

  if (!existsSync(CHANGELOG_PATH)) {
    console.error('❌ CHANGELOG.md not found at:', CHANGELOG_PATH);
    process.exit(1);
  }

  let targetVersion = targetVersionArg;
  if (!targetVersion) {
    if (existsSync(PACKAGE_JSON_PATH)) {
      const pkg = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8'));
      targetVersion = pkg.version;
    }
  }

  const changelog = readFileSync(CHANGELOG_PATH, 'utf8');

  // If still no version specified, find the first version header in CHANGELOG.md
  if (!targetVersion) {
    const firstMatch = changelog.match(/^##\s+\[v?([^\]]+)\]/m);
    if (firstMatch && firstMatch[1]) {
      targetVersion = firstMatch[1];
    } else {
      console.error('❌ Could not determine target release version.');
      process.exit(1);
    }
  }

  // Strip leading 'v' if provided
  const cleanVersion = targetVersion.replace(/^v/, '');
  const escapedVersion = cleanVersion.replace(/\./g, '\\.');

  // Regex to match header and all content until next '## [' or EOF
  const sectionRegex = new RegExp(
    `^##\\s+\\[v?${escapedVersion}\\][^\n]*\n([\\s\\S]*?)(?=^##\\s+\\[|\\Z)`,
    'm'
  );

  const match = changelog.match(sectionRegex);

  if (!match || match[1] === undefined) {
    console.error(`❌ Could not find release notes for version "${cleanVersion}" in CHANGELOG.md.`);
    process.exit(1);
  }

  let notes = match[1].trim();

  // Remove trailing markdown horizontal rule if present
  notes = notes.replace(/\n---\s*$/, '').trim();

  if (outputFile) {
    const outPath = resolve(ROOT, outputFile);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, notes + '\n', 'utf8');
    console.error(`📝 Release notes for v${cleanVersion} written to: ${outputFile}`);
  }

  // Output notes to stdout
  console.log(notes);
  process.exit(0);
}

extractReleaseNotes();
