#!/usr/bin/env node
/**
 * Verification test suite for Tee’s Wardrobe Design Tokens.
 * 
 * Verifies:
 * 1. Project works using its own project-relative source file (task-01-design-system/evidence/06-tokens-complete.json).
 * 2. Uses a temporary file for CSS generation so existing project CSS is never overwritten by tests.
 * 3. Rejects execution if input and output resolve to the same file without modifying the source.
 * 4. Missing/unresolved references cause clear, fatal errors.
 * 5. All 9 colour roles resolve to their intended primitive colours.
 * 6. The output includes all 15 text styles and 3 shadows.
 * 7. Preserves connection: interface styles use roles, roles point to primitives.
 * 8. Source JSON SHA-256 remains completely unchanged before and after.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const {
  convertTokens,
  resolveReference,
  DEFAULT_INPUT_PATH
} = require('./convert-tokens');

const EXPECTED_SOURCE_SHA256 = 'efbab56ac79fb061992bb301d3b5747156bf51b8f7ca2faa6cc4ede86c9cbda4';

// Target truth table for the 9 colour roles
const EXPECTED_ROLES = [
  {
    roleName: 'primary',
    rawRef: '{primitive brand .primary.40}',
    expectedPrimitive: 'primitive brand.primary.40',
    expectedPrimitiveVar: '--color-primitive-brand-primary-40',
    expectedHex: '#32b1aaff'
  },
  {
    roleName: 'on primary',
    rawRef: '{primitive brand .neutral.10}',
    expectedPrimitive: 'primitive brand.neutral.10',
    expectedPrimitiveVar: '--color-primitive-brand-neutral-10',
    expectedHex: '#191c1cff'
  },
  {
    roleName: 'error',
    rawRef: '{primitive brand .status.error}',
    expectedPrimitive: 'primitive brand.status.error',
    expectedPrimitiveVar: '--color-primitive-brand-status-error',
    expectedHex: '#ba1a1aff'
  },
  {
    roleName: 'warning',
    rawRef: '{primitive brand .status.warning}',
    expectedPrimitive: 'primitive brand.status.warning',
    expectedPrimitiveVar: '--color-primitive-brand-status-warning',
    expectedHex: '#7a5900ff'
  },
  {
    roleName: 'success',
    rawRef: '{primitive brand .status.success}',
    expectedPrimitive: 'primitive brand.status.success',
    expectedPrimitiveVar: '--color-primitive-brand-status-success',
    expectedHex: '#17643bff'
  },
  {
    roleName: 'surface',
    rawRef: '{primitive brand .neutral.98}',
    expectedPrimitive: 'primitive brand.neutral.98',
    expectedPrimitiveVar: '--color-primitive-brand-neutral-98',
    expectedHex: '#f8faf8ff'
  },
  {
    roleName: 'on surface',
    rawRef: '{primitive brand .neutral.10}',
    expectedPrimitive: 'primitive brand.neutral.10',
    expectedPrimitiveVar: '--color-primitive-brand-neutral-10',
    expectedHex: '#191c1cff'
  },
  {
    roleName: 'field outline',
    rawRef: '{primitive brand .neutral.40}',
    expectedPrimitive: 'primitive brand.neutral.40',
    expectedPrimitiveVar: '--color-primitive-brand-neutral-40',
    expectedHex: '#5c5f5eff'
  },
  {
    roleName: 'focus indicator',
    rawRef: '{primitive brand .primary.15}',
    expectedPrimitive: 'primitive brand.primary.15',
    expectedPrimitiveVar: '--color-primitive-brand-primary-15',
    expectedHex: '#134240ff'
  }
];

const EXPECTED_TEXT_STYLES = [
  'type-display-large', 'type-display-medium', 'type-display-small',
  'type-headline-large', 'type-headline-medium', 'type-headline-small',
  'type-title-large', 'type-title-medium', 'type-title-small',
  'type-body-large', 'type-body-medium', 'type-body-small',
  'type-label-large', 'type-label-medium', 'type-label-small'
];

const EXPECTED_SHADOWS = [
  { name: 'soft', varName: '--shadow-soft', className: '.shadow-soft' },
  { name: 'medium', varName: '--shadow-medium', className: '.shadow-medium' },
  { name: 'hard', varName: '--shadow-hard', className: '.shadow-hard' }
];

function runVerification() {
  console.log('================================================================');
  console.log('TEE’S WARDROBE — DESIGN TOKEN VERIFICATION');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`  ✗ [FAIL] ${message}`);
    }
  }

  // Define temporary output location in OS temp directory
  const tempOutputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tee-tokens-verify-'));
  const tempOutputFile = path.join(tempOutputDir, 'verified-tokens.css');

  try {
    // 1. Verify project-relative source file exists and check its SHA-256
    console.log('1. Checking project-relative source JSON (evidence/06-tokens-complete.json):');
    assert(fs.existsSync(DEFAULT_INPUT_PATH), `Project-relative source file exists at ${DEFAULT_INPUT_PATH}`);

    const sourceRaw = fs.readFileSync(DEFAULT_INPUT_PATH, 'utf8');
    const preHash = crypto.createHash('sha256').update(sourceRaw).digest('hex');
    assert(preHash === EXPECTED_SOURCE_SHA256, `Source SHA-256 matches verified hash: ${preHash}`);

    // 2. Test safety: Reject running when input and output resolve to the same file
    console.log('\n2. Testing rejection when input and output resolve to the same file:');
    let caughtSameFileError = false;
    const hashBeforeCollisionTest = crypto.createHash('sha256').update(fs.readFileSync(DEFAULT_INPUT_PATH, 'utf8')).digest('hex');

    try {
      // Attempt to run with same input and output path
      convertTokens(DEFAULT_INPUT_PATH, DEFAULT_INPUT_PATH);
    } catch (err) {
      caughtSameFileError = true;
      assert(err.message.includes('[SafetyError]'), `Caught collision safety error: "${err.message}"`);
    }

    assert(caughtSameFileError, 'Refused to run when input and output resolve to the same file');

    const hashAfterCollisionTest = crypto.createHash('sha256').update(fs.readFileSync(DEFAULT_INPUT_PATH, 'utf8')).digest('hex');
    assert(
      hashBeforeCollisionTest === hashAfterCollisionTest,
      `Original JSON was preserved completely unchanged (SHA-256: ${hashAfterCollisionTest})`
    );

    // 3. Test error reporting for missing/unresolved references
    console.log('\n3. Testing error reporting for missing/unresolved references:');
    const sampleData = JSON.parse(sourceRaw);

    let caughtMissingSegment = false;
    try {
      resolveReference('{primitive brand .primary.999}', sampleData, 'test-missing-tone');
    } catch (err) {
      caughtMissingSegment = true;
      assert(err.message.includes('[TokenError] Unresolved reference'), `Caught missing segment error: "${err.message}"`);
    }
    assert(caughtMissingSegment, 'Missing tone segment causes clear, fatal failure');

    let caughtMissingCollection = false;
    try {
      resolveReference('{nonexistent collection.primary.40}', sampleData, 'test-missing-collection');
    } catch (err) {
      caughtMissingCollection = true;
      assert(err.message.includes('[TokenError] Unresolved reference'), `Caught missing collection error: "${err.message}"`);
    }
    assert(caughtMissingCollection, 'Missing collection segment causes clear, fatal failure');

    let caughtMalformed = false;
    try {
      resolveReference('primitive brand.primary.40', sampleData, 'test-no-braces');
    } catch (err) {
      caughtMalformed = true;
      assert(err.message.includes('[TokenError] Malformed reference syntax'), `Caught malformed syntax error: "${err.message}"`);
    }
    assert(caughtMalformed, 'Malformed reference syntax causes clear, fatal failure');

    // 4. Generate CSS into temporary location (does NOT overwrite project CSS)
    console.log('\n4. Generating CSS in temporary location:');
    console.log(`  Temporary output target: ${tempOutputFile}`);
    const result = convertTokens(DEFAULT_INPUT_PATH, tempOutputFile);
    assert(fs.existsSync(tempOutputFile), `Generated temporary CSS file exists at ${tempOutputFile}`);

    // 5. Verify all 9 colour roles
    console.log('\n5. Verifying all 9 colour roles resolve to intended primitives:');
    assert(result.roles.length === 9, `Extracted exactly 9 colour roles (got ${result.roles.length})`);

    for (const expected of EXPECTED_ROLES) {
      const role = result.roles.find(r => r.roleName === expected.roleName);
      assert(Boolean(role), `Role "${expected.roleName}" exists`);
      if (role) {
        assert(role.rawRef === expected.rawRef, `  Role "${expected.roleName}" raw ref matches "${expected.rawRef}"`);
        assert(role.cleanPath === expected.expectedPrimitive, `  Role "${expected.roleName}" cleaned path resolves to "${expected.expectedPrimitive}"`);
        assert(role.pointsToPrimitiveVar === expected.expectedPrimitiveVar, `  Role "${expected.roleName}" points to primitive variable "${expected.expectedPrimitiveVar}"`);
        assert(role.resolvedValue === expected.expectedHex, `  Role "${expected.roleName}" resolved hex is "${expected.expectedHex}"`);
      }
    }

    // 6. Verify all 15 text styles
    console.log('\n6. Verifying all 15 text styles:');
    assert(result.typography.length === 15, `Extracted exactly 15 text styles (got ${result.typography.length})`);

    for (const expectedSlug of EXPECTED_TEXT_STYLES) {
      const found = result.typography.find(t => t.slug === expectedSlug);
      assert(Boolean(found), `Text style ".${expectedSlug}" exists with size ${found ? found.fontSize : 'N/A'}`);
    }

    // 7. Verify all 3 shadows
    console.log('\n7. Verifying all 3 shadow styles:');
    assert(result.shadows.length === 3, `Extracted exactly 3 shadow styles (got ${result.shadows.length})`);

    for (const expectedShadow of EXPECTED_SHADOWS) {
      const found = result.shadows.find(s => s.name === expectedShadow.name);
      assert(Boolean(found), `Shadow style "${expectedShadow.name}" exists (CSS: ${found ? found.cssValue : 'N/A'})`);
    }

    // 8. Inspect generated CSS content and architecture
    console.log('\n8. Inspecting generated CSS architecture in temporary file:');
    const css = fs.readFileSync(tempOutputFile, 'utf8');

    // Check roles point to primitives in CSS
    for (const expected of EXPECTED_ROLES) {
      const roleSlug = expected.roleName.replace(/[^a-z0-9]+/g, '-');
      const regex = new RegExp(`--color-role-${roleSlug}:\\s*var\\(${expected.expectedPrimitiveVar}\\);`);
      assert(regex.test(css), `CSS contains role mapping: --color-role-${roleSlug} -> var(${expected.expectedPrimitiveVar})`);
    }

    // Check all 15 text style classes exist in CSS
    for (const expectedSlug of EXPECTED_TEXT_STYLES) {
      assert(css.includes(`.${expectedSlug} {`), `CSS contains class .${expectedSlug}`);
    }

    // Check all 3 shadow classes exist in CSS
    for (const expectedShadow of EXPECTED_SHADOWS) {
      assert(css.includes(`${expectedShadow.className} {`), `CSS contains class ${expectedShadow.className}`);
    }

    // Check interface utility classes use roles (NOT raw primitives or hex)
    assert(css.includes('.bg-primary {\n  background-color: var(--color-role-primary);\n}'), 'Interface style .bg-primary uses var(--color-role-primary)');
    assert(css.includes('.text-on-primary {\n  color: var(--color-role-on-primary);\n}'), 'Interface style .text-on-primary uses var(--color-role-on-primary)');
    assert(css.includes('.bg-surface {\n  background-color: var(--color-role-surface);\n}'), 'Interface style .bg-surface uses var(--color-role-surface)');
    assert(css.includes('.text-on-surface {\n  color: var(--color-role-on-surface);\n}'), 'Interface style .text-on-surface uses var(--color-role-on-surface)');
    assert(css.includes('.border-field-outline {\n  border: 1px solid var(--color-role-field-outline);\n}'), 'Interface style .border-field-outline uses var(--color-role-field-outline)');
    assert(css.includes('.focus-indicator:focus-visible {\n  outline: 2px solid var(--color-role-focus-indicator);'), 'Interface style .focus-indicator uses var(--color-role-focus-indicator)');

    // 9. Source file integrity check after all operations
    console.log('\n9. Checking source JSON integrity (after all tests):');
    const postHash = crypto.createHash('sha256').update(fs.readFileSync(DEFAULT_INPUT_PATH, 'utf8')).digest('hex');
    assert(postHash === EXPECTED_SOURCE_SHA256, `Source JSON remains completely unmodified (SHA-256: ${postHash})`);

    console.log('\n================================================================');
    console.log(`VERIFICATION SUMMARY: ${passedTests}/${totalTests} tests passed.`);
    console.log('================================================================\n');

    if (passedTests !== totalTests) {
      process.exit(1);
    }
  } finally {
    // Clean up temporary directory and files
    try {
      if (fs.existsSync(tempOutputDir)) {
        fs.rmSync(tempOutputDir, { recursive: true, force: true });
      }
    } catch (e) {
      // Ignore cleanup error
    }
  }
}

if (require.main === module) {
  runVerification();
}

module.exports = { runVerification };
