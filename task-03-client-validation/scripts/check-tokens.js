#!/usr/bin/env node
/**
 * Automated Token Parity Check for Tee’s Wardrobe Task Two
 * Detects when local copy in task-02 differs from canonical task-01 source.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function sha256(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

const pairs = [
  {
    name: 'tokens.css',
    src: path.resolve(__dirname, '../../task-01-design-system/css/tokens.css'),
    copy: path.resolve(__dirname, '../styles/tokens.css')
  },
  {
    name: 'spacing.css',
    src: path.resolve(__dirname, '../../task-01-design-system/css/spacing.css'),
    copy: path.resolve(__dirname, '../styles/spacing.css')
  }
];

let failed = false;

console.log('Checking design token parity between Task One and Task Two...');

for (const pair of pairs) {
  const srcHash = sha256(pair.src);
  const copyHash = sha256(pair.copy);

  if (!srcHash) {
    console.error(`[FAIL] Source file missing: ${pair.src}`);
    failed = true;
    continue;
  }

  if (!copyHash) {
    console.error(`[FAIL] Copied file missing: ${pair.copy}`);
    failed = true;
    continue;
  }

  if (srcHash !== copyHash) {
    console.error(`[FAIL] ${pair.name} parity mismatch!`);
    console.error(`  Task One SHA-256: ${srcHash}`);
    console.error(`  Task Two SHA-256: ${copyHash}`);
    console.error('  Run "npm run sync:tokens" to refresh the copy from Task One source.');
    failed = true;
  } else {
    console.log(`[PASS] ${pair.name} is identical to Task One source (SHA-256: ${srcHash})`);
  }
}

if (failed) {
  console.error('\n[Error] Token verification failed. Copies do not match canonical source.');
  process.exit(1);
} else {
  console.log('\n[Success] All design tokens in Task Two match Task One source exactly.');
}
