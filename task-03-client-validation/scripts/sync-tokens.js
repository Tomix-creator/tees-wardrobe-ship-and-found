#!/usr/bin/env node
/**
 * Repeatable Token Sync Script for Tee’s Wardrobe Task Two
 * Copies canonical design tokens and spacing from task-01-design-system to task-02.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SRC_TOKENS = path.resolve(__dirname, '../../task-01-design-system/css/tokens.css');
const SRC_SPACING = path.resolve(__dirname, '../../task-01-design-system/css/spacing.css');
const DST_DIR = path.resolve(__dirname, '../styles');
const DST_TOKENS = path.join(DST_DIR, 'tokens.css');
const DST_SPACING = path.join(DST_DIR, 'spacing.css');

if (!fs.existsSync(DST_DIR)) {
  fs.mkdirSync(DST_DIR, { recursive: true });
}

function syncFile(src, dst, name) {
  if (!fs.existsSync(src)) {
    console.error(`[SyncError] Source ${name} not found at: ${src}`);
    process.exit(1);
  }
  fs.copyFileSync(src, dst);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(dst)).digest('hex');
  console.log(`[Sync] Copied ${name} -> ${path.relative(process.cwd(), dst)} (SHA-256: ${hash})`);
}

syncFile(SRC_TOKENS, DST_TOKENS, 'tokens.css');
syncFile(SRC_SPACING, DST_SPACING, 'spacing.css');
console.log('[Sync] Token sync completed successfully.');
