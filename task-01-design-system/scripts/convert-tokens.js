#!/usr/bin/env node
/**
 * Repeatable JSON-to-CSS design token converter for Tee’s Wardrobe.
 * 
 * Requirements handled:
 * 1. Safe parsing of alias references with whitespace (e.g. "{primitive brand .primary.40}").
 * 2. Original JSON is treated as read-only; hash is verified before and after.
 * 3. Refuses to run if input and output resolve to the same file.
 * 4. Project-relative default input path so project works on any computer.
 * 5. Unresolved references are reported as fatal errors.
 * 6. Preserves hierarchy: Interface styles -> Colour roles -> Primitive colours.
 * 7. Extracts all 94 primitives, 9 colour roles, 15 composite font styles, and 3 shadow effects.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Project-relative default paths so the project works on any machine
const DEFAULT_INPUT_PATH = path.resolve(__dirname, '../evidence/06-tokens-complete.json');
const DEFAULT_OUTPUT_PATH = path.resolve(__dirname, '../css/tokens.css');

/**
 * Normalizes segment names into CSS custom property token segments.
 */
function toTokenSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Derives a clean, consistent CSS custom property name for a primitive path.
 * e.g. ["primitive brand", "primary", "40"] -> "--color-primitive-brand-primary-40"
 */
function toPrimitiveVarName(segments) {
  const parts = segments.map(toTokenSlug);
  return `--color-${parts.join('-')}`;
}

/**
 * Safely resolves an alias reference string without modifying the source JSON.
 * Throws a descriptive error if the reference cannot be resolved.
 *
 * Example: "{primitive brand .primary.40}"
 * -> segments: ["primitive brand", "primary", "40"]
 */
function resolveReference(refString, rootData, contextName = '') {
  if (typeof refString !== 'string') {
    throw new Error(`[TokenError] Expected string reference in "${contextName}", got ${typeof refString}`);
  }

  const match = refString.match(/^\{(.+)\}$/);
  if (!match) {
    throw new Error(`[TokenError] Malformed reference syntax "${refString}" in "${contextName}". References must be enclosed in braces.`);
  }

  const rawPath = match[1];
  // Split on dot and trim whitespace around every segment to handle export quirks safely
  const segments = rawPath.split('.').map(s => s.trim()).filter(Boolean);

  if (segments.length === 0) {
    throw new Error(`[TokenError] Empty reference path in "${refString}" for "${contextName}".`);
  }

  let current = rootData;
  const traversed = [];

  for (const segment of segments) {
    traversed.push(segment);
    if (!current || typeof current !== 'object' || !(segment in current)) {
      const parentPath = traversed.slice(0, -1).join('.') || '<root>';
      throw new Error(
        `[TokenError] Unresolved reference in "${contextName}": failed to find segment "${segment}" under "${parentPath}". Full reference: "${refString}".`
      );
    }
    current = current[segment];
  }

  if (!current || typeof current !== 'object' || !('value' in current)) {
    throw new Error(
      `[TokenError] Reference "${refString}" in "${contextName}" resolved to a non-token object missing "value" property.`
    );
  }

  const primitiveVarName = toPrimitiveVarName(segments);

  return {
    rawReference: refString,
    cleanPath: segments.join('.'),
    segments,
    primitiveVarName,
    token: current,
    value: current.value
  };
}

/**
 * Recursively collects primitive tokens from an object tree.
 */
function collectPrimitives(tree, parentSegments = []) {
  const result = [];
  for (const [key, item] of Object.entries(tree)) {
    const currentSegments = [...parentSegments, key];
    if (item && typeof item === 'object') {
      if ('value' in item && typeof item.value === 'string' && item.type === 'color') {
        const varName = toPrimitiveVarName(currentSegments);
        result.push({
          segments: currentSegments,
          varName,
          value: item.value,
          description: item.description || ''
        });
      } else {
        result.push(...collectPrimitives(item, currentSegments));
      }
    }
  }
  return result;
}

/**
 * Main conversion function.
 */
function convertTokens(inputPath = DEFAULT_INPUT_PATH, outputPath = DEFAULT_OUTPUT_PATH) {
  const resolvedInput = path.resolve(inputPath);
  const resolvedOutput = path.resolve(outputPath);

  // Safety check 1: Refuse to run before writing anything if input and output resolve to the same path
  if (resolvedInput === resolvedOutput) {
    throw new Error(
      `[SafetyError] Input and output paths resolve to the same file: "${resolvedInput}". Refusing to run to protect source JSON.`
    );
  }

  // Safety check 2: Check realpath for symlinks if both exist
  if (fs.existsSync(resolvedInput) && fs.existsSync(resolvedOutput)) {
    try {
      if (fs.realpathSync(resolvedInput) === fs.realpathSync(resolvedOutput)) {
        throw new Error(
          `[SafetyError] Input and output resolve to the same physical file via realpath: "${fs.realpathSync(resolvedInput)}". Refusing to run to protect source JSON.`
        );
      }
    } catch (e) {
      if (e.message && e.message.includes('[SafetyError]')) {
        throw e;
      }
    }
  }

  if (!fs.existsSync(resolvedInput)) {
    throw new Error(`Input token file does not exist: ${resolvedInput}`);
  }

  // 1. Read input JSON in read-only manner and verify hash
  const rawInput = fs.readFileSync(resolvedInput, 'utf8');
  const inputSha256 = crypto.createHash('sha256').update(rawInput).digest('hex');
  const data = JSON.parse(rawInput);

  // 2. Extract Primitives
  if (!data['primitive brand']) {
    throw new Error('[TokenError] Missing "primitive brand" group in tokens JSON.');
  }
  const primitives = collectPrimitives(data['primitive brand'], ['primitive brand']);

  // Build a lookup map of primitive variable names for cross-validation
  const primitiveVarMap = new Map();
  for (const p of primitives) {
    primitiveVarMap.set(p.varName, p);
  }

  // 3. Resolve Colour Roles
  if (!data['colour roles']) {
    throw new Error('[TokenError] Missing "colour roles" group in tokens JSON.');
  }

  const roleEntries = Object.entries(data['colour roles']);
  const resolvedRoles = [];

  for (const [roleName, roleToken] of roleEntries) {
    const resolved = resolveReference(roleToken.value, data, `colour roles.${roleName}`);
    
    // Verify that the resolved primitive variable exists in our primitives list
    if (!primitiveVarMap.has(resolved.primitiveVarName)) {
      throw new Error(
        `[TokenError] Colour role "${roleName}" points to "${resolved.primitiveVarName}" which was not collected in primitives.`
      );
    }

    const roleVarName = `--color-role-${toTokenSlug(roleName)}`;
    resolvedRoles.push({
      roleName,
      roleVarName,
      pointsToPrimitiveVar: resolved.primitiveVarName,
      rawRef: roleToken.value,
      cleanPath: resolved.cleanPath,
      resolvedValue: resolved.value,
      description: roleToken.description || ''
    });
  }

  // 4. Extract 15 Typography Styles
  const fontRoot = data.font && data.font["tee's wardrobe"];
  if (!fontRoot) {
    throw new Error('[TokenError] Missing "font.tee\'s wardrobe" group in tokens JSON.');
  }

  const typographyStyles = [];
  const expectedCategories = ['display', 'headline', 'title', 'body', 'label'];
  const expectedSizes = ['large', 'medium', 'small'];

  for (const cat of expectedCategories) {
    if (!fontRoot[cat]) {
      throw new Error(`[TokenError] Missing font category: "${cat}"`);
    }
    for (const size of expectedSizes) {
      const styleObj = fontRoot[cat][size];
      if (!styleObj || !styleObj.value) {
        throw new Error(`[TokenError] Missing font style: "${cat}.${size}"`);
      }
      const v = styleObj.value;
      const slug = `type-${cat}-${size}`;
      typographyStyles.push({
        category: cat,
        size,
        slug,
        fontFamily: v.fontFamily || 'Inter',
        fontSize: `${v.fontSize}px`,
        fontWeight: v.fontWeight || 400,
        lineHeight: `${v.lineHeight}px`,
        letterSpacing: `${v.letterSpacing}px`
      });
    }
  }

  // 5. Extract 3 Shadow Effects
  const effectRoot = data.effect && data.effect["tee's wardrobe"] && data.effect["tee's wardrobe"].shadow;
  if (!effectRoot) {
    throw new Error('[TokenError] Missing "effect.tee\'s wardrobe.shadow" group in tokens JSON.');
  }

  const shadowStyles = [];
  const expectedShadows = ['soft', 'medium', 'hard'];

  for (const sName of expectedShadows) {
    const sObj = effectRoot[sName];
    if (!sObj || !sObj.value) {
      throw new Error(`[TokenError] Missing shadow style: "${sName}"`);
    }
    const val = sObj.value;
    const shadowVarName = `--shadow-${sName}`;
    const cssValue = `${val.offsetX}px ${val.offsetY}px ${val.radius}px ${val.spread}px ${val.color}`;
    shadowStyles.push({
      name: sName,
      varName: shadowVarName,
      cssValue,
      description: sObj.description || '',
      color: val.color
    });
  }

  // 6. Generate CSS
  const lines = [];
  lines.push('/* ==========================================================================');
  lines.push('   Tee’s Wardrobe Design System — Generated CSS Tokens');
  lines.push(`   Source SHA-256: ${inputSha256}`);
  lines.push('   DO NOT EDIT DIRECTLY. Generated by task-01-design-system/scripts/convert-tokens.js');
  lines.push('   ========================================================================== */');
  lines.push('');
  lines.push(':root {');
  lines.push('  /* ------------------------------------------------------------------------');
  lines.push('     1. Primitive Colours (Stored Colour Values)');
  lines.push(`     Total: ${primitives.length} primitive colours`);
  lines.push('     ------------------------------------------------------------------------ */');

  let currentFamily = '';
  for (const p of primitives) {
    const family = p.segments[1] || 'base';
    if (family !== currentFamily) {
      currentFamily = family;
      lines.push('');
      lines.push(`  /* ${family.toUpperCase()} */`);
    }
    lines.push(`  ${p.varName}: ${p.value};`);
  }

  lines.push('');
  lines.push('  /* ------------------------------------------------------------------------');
  lines.push('     2. Colour Roles (Semantic Aliases pointing directly to Primitives)');
  lines.push(`     Total: ${resolvedRoles.length} colour roles`);
  lines.push('     Preserves connection: Roles MUST point to primitives.');
  lines.push('     ------------------------------------------------------------------------ */');
  for (const r of resolvedRoles) {
    lines.push(`  /* Role: ${r.roleName} -> ${r.cleanPath} (${r.resolvedValue}) */`);
    lines.push(`  ${r.roleVarName}: var(${r.pointsToPrimitiveVar});`);
  }

  lines.push('');
  lines.push('  /* ------------------------------------------------------------------------');
  lines.push('     3. Shadow Effect Variables');
  lines.push(`     Total: ${shadowStyles.length} shadows derived from brand primary/10`);
  lines.push('     ------------------------------------------------------------------------ */');
  for (const sh of shadowStyles) {
    lines.push(`  ${sh.varName}: ${sh.cssValue};`);
  }

  lines.push('');
  lines.push('  /* ------------------------------------------------------------------------');
  lines.push('     4. Typography Variables');
  lines.push(`     Total: ${typographyStyles.length} composite text styles`);
  lines.push('     ------------------------------------------------------------------------ */');
  for (const t of typographyStyles) {
    lines.push(`  --${t.slug}-font-family: '${t.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`);
    lines.push(`  --${t.slug}-font-size: ${t.fontSize};`);
    lines.push(`  --${t.slug}-font-weight: ${t.fontWeight};`);
    lines.push(`  --${t.slug}-line-height: ${t.lineHeight};`);
    lines.push(`  --${t.slug}-letter-spacing: ${t.letterSpacing};`);
  }

  lines.push('}');
  lines.push('');

  lines.push('/* ==========================================================================');
  lines.push('   5. Typography Utility Classes (15 Styles)');
  lines.push('   ========================================================================== */');
  for (const t of typographyStyles) {
    lines.push(`.${t.slug} {`);
    lines.push(`  font-family: var(--${t.slug}-font-family);`);
    lines.push(`  font-size: var(--${t.slug}-font-size);`);
    lines.push(`  font-weight: var(--${t.slug}-font-weight);`);
    lines.push(`  line-height: var(--${t.slug}-line-height);`);
    lines.push(`  letter-spacing: var(--${t.slug}-letter-spacing);`);
    lines.push('}');
    lines.push('');
  }

  lines.push('/* ==========================================================================');
  lines.push('   6. Shadow Utility Classes (3 Styles)');
  lines.push('   ========================================================================== */');
  for (const sh of shadowStyles) {
    lines.push(`.${sh.varName.replace('--', '')} {`);
    lines.push(`  box-shadow: var(${sh.varName});`);
    lines.push('}');
    lines.push('');
  }

  lines.push('/* ==========================================================================');
  lines.push('   7. Interface Utility Styles (MUST use Colour Roles)');
  lines.push('   Preserves connection: Interface styles use roles; roles point to primitives.');
  lines.push('   ========================================================================== */');
  lines.push('.bg-primary {');
  lines.push('  background-color: var(--color-role-primary);');
  lines.push('}');
  lines.push('.text-on-primary {');
  lines.push('  color: var(--color-role-on-primary);');
  lines.push('}');
  lines.push('.bg-surface {');
  lines.push('  background-color: var(--color-role-surface);');
  lines.push('}');
  lines.push('.text-on-surface {');
  lines.push('  color: var(--color-role-on-surface);');
  lines.push('}');
  lines.push('.border-field-outline {');
  lines.push('  border: 1px solid var(--color-role-field-outline);');
  lines.push('}');
  lines.push('.focus-indicator:focus-visible {');
  lines.push('  outline: 2px solid var(--color-role-focus-indicator);');
  lines.push('  outline-offset: 2px;');
  lines.push('}');
  lines.push('.text-error {');
  lines.push('  color: var(--color-role-error);');
  lines.push('}');
  lines.push('.text-warning {');
  lines.push('  color: var(--color-role-warning);');
  lines.push('}');
  lines.push('.text-success {');
  lines.push('  color: var(--color-role-success);');
  lines.push('}');
  lines.push('');

  const outputContent = lines.join('\n');

  // Ensure output directory exists
  const outDir = path.dirname(resolvedOutput);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(resolvedOutput, outputContent, 'utf8');

  // 7. Verify input file was NOT modified
  const postSha256 = crypto.createHash('sha256').update(fs.readFileSync(resolvedInput, 'utf8')).digest('hex');
  if (inputSha256 !== postSha256) {
    throw new Error('[Security/Integrity Error] The original input JSON file was modified during execution!');
  }

  return {
    inputPath: resolvedInput,
    outputPath: resolvedOutput,
    inputSha256,
    primitivesCount: primitives.length,
    rolesCount: resolvedRoles.length,
    typographyCount: typographyStyles.length,
    shadowsCount: shadowStyles.length,
    roles: resolvedRoles,
    typography: typographyStyles,
    shadows: shadowStyles
  };
}

// CLI entrypoint
if (require.main === module) {
  const args = process.argv.slice(2);
  let input = DEFAULT_INPUT_PATH;
  let output = DEFAULT_OUTPUT_PATH;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) {
      input = path.resolve(args[++i]);
    } else if (args[i] === '--output' && args[i + 1]) {
      output = path.resolve(args[++i]);
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log('Usage: node convert-tokens.js [--input <path>] [--output <path>]');
      process.exit(0);
    }
  }

  try {
    const result = convertTokens(input, output);
    console.log('✓ Token conversion completed successfully.');
    console.log(`  Source: ${result.inputPath}`);
    console.log(`  Output: ${result.outputPath}`);
    console.log(`  Source SHA-256 (verified untouched): ${result.inputSha256}`);
    console.log(`  Primitive colours: ${result.primitivesCount}`);
    console.log(`  Colour roles: ${result.rolesCount} (all resolved to primitives)`);
    console.log(`  Typography styles: ${result.typographyCount}`);
    console.log(`  Shadow styles: ${result.shadowsCount}`);
  } catch (err) {
    console.error('✗ Conversion error:', err.message);
    process.exit(1);
  }
}

module.exports = {
  convertTokens,
  resolveReference,
  toTokenSlug,
  toPrimitiveVarName,
  DEFAULT_INPUT_PATH,
  DEFAULT_OUTPUT_PATH
};
