import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

// This is a custom brand-anchored scale, not Material HCT tone generation.
// Slots below 40 mix encoded sRGB black toward the exact brand color.
// Slots above 40 mix the brand toward encoded sRGB white.
// Slot numbers are positions, not measured perceptual lightness.
const directory = new URL('./', import.meta.url);
const original = JSON.parse(await fs.readFile(new URL('tees-wardrobe-primitives-before-override.tokens.json', directory), 'utf8'));
const revised = JSON.parse(JSON.stringify(original));
const brand = '#32B1AA';
const rgb = hex => hex.slice(1).match(/../g).map(component => parseInt(component, 16));
const hex = values => '#' + values.map(value => Math.round(value).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (start, end, weight) => start.map((component, index) => component + (end[index] - component) * weight);
const luminance = color => rgb(color).map(component => {
  const value = component / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}).reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
const contrast = (first, second) => {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
};
const slots = Object.keys(original.primary).filter(key => !key.startsWith('$')).map(Number).sort((a, b) => a - b);
const brandRgb = rgb(brand);
const rows = [];
for (const slot of slots) {
  const color = hex(slot <= 40 ? mix([0, 0, 0], brandRgb, slot / 40) : mix(brandRgb, [255, 255, 255], (slot - 40) / 60));
  revised.primary[slot] = {
    $type: 'color',
    $description: `Custom brand scale slot ${slot}; sRGB mixing through black at 0, exact brand at 40, white at 100. Slot is not a Material HCT tone.`,
    $value: { colorSpace: 'srgb', components: rgb(color).map(value => value / 255), alpha: 1, hex: color },
  };
  rows.push({ slot, before: original.primary[slot].$value.hex, after: color, luminance: luminance(color) });
}
revised.$description = 'PROPOSED brand-anchored primitives. Only primary shades differ from the preserved baseline. Custom sRGB black-brand-white scale with exact #32B1AA at slot 40; numbers are custom positions, not measured Material HCT tones. Other color families and brand source are unchanged. No semantic roles or aliases are changed. Review in Figma before using.';
assert.equal(revised.primary['40'].$value.hex, brand);
assert.equal(revised.primary['0'].$value.hex, '#000000');
assert.equal(revised.primary['100'].$value.hex, '#FFFFFF');
assert.equal(slots.length, 18);
assert.equal(new Set(rows.map(row => row.after)).size, 18);
for (let index = 1; index < rows.length; index++) assert.ok(rows[index].luminance > rows[index - 1].luminance);
for (const key of Object.keys(original).filter(key => key !== 'primary' && !key.startsWith('$'))) assert.deepEqual(revised[key], original[key]);
const countColors = value => value && typeof value === 'object' ? (value.$type === 'color' ? 1 : Object.values(value).reduce((total, child) => total + countColors(child), 0)) : 0;
assert.equal(countColors(revised), 91);
const changed = rows.filter(row => row.before !== row.after).length;
assert.equal(changed, 16);
const output = new URL('tees-wardrobe-primitives-brand-anchored.tokens.json', directory);
await fs.writeFile(output, JSON.stringify(revised, null, 2) + '\n');
assert.deepEqual(JSON.parse(await fs.readFile(output, 'utf8')), revised);
const report = `# Tee's Wardrobe: proposed primary palette adjustment

Status: generated and checked as a file; import confirmed by five user-supplied Figma screenshots dated 2026-10-26 at 19:42. Visible values match the proposal, including brand/source and primary/40 = #32B1AA. Primary/100 is visible at the top of screenshot 02. The collection is named "primitive brand" and shows 91 variables. Semantic roles and an actual button remain unverified.

After evidence, preserved unchanged: palette-after-01-primary.png, palette-after-02-primary-end-secondary.png, palette-after-03-secondary-end-tertiary.png, palette-after-04-neutral.png, palette-after-05-neutral-variant.png.

## Evidence and scope

The owner-approved brand is #32B1AA. The baseline is the checked Material Theme Builder export converted to 91 DTCG color tokens. The complete before screenshot is preserved as primary-palette-before.png. Only 16 primary values change; black and white endpoints, brand/source, and all other families are unchanged. The original export and baseline import file remain unchanged. No semantic color roles, aliases, typography, or shadows are modified.

## Method and limitation

This is a deliberate custom brand scale for the exercise's exact-brand-at-primary40 requirement, not standard Material HCT tones. It mixes the encoded sRGB channels from black to the brand for positions 0–40, and from the brand to white for positions 40–100, rounding to 8-bit values. The number 40 labels a position and does not mean measured lightness 40. Steps are not claimed to be perceptually equal.

The original 18 positions are retained for comparison and migration. This count is provisional: the finished design must justify the positions actually used for dark content, controls, pale containers, backgrounds, and subtle surfaces. A color existing in this file does not by itself establish a use or accessibility pass.

## Checked results

- Exactly 91 color tokens; 18 unique primary shades.
- Exact brand at primary/40; black at 0 and white at 100.
- Relative luminance strictly increases across all 18 primary positions after 8-bit rounding.
- All other color families and brand/source match the baseline structurally.
- Output JSON reopens without a change.
- Brand with white text: ${contrast(brand, '#FFFFFF').toFixed(4)}:1 — fails the 4.5:1 normal-text threshold.
- Brand with neutral/10 (#191C1C) text: ${contrast(brand, '#191C1C').toFixed(4)}:1 — passes that threshold.

These pair checks do not certify the whole interface. Existing role variables still use the old scheme until deliberately remapped and checked. Import as a separate review collection; do not delete the baseline or blindly replace on-primary with white.

WCAG source: https://www.w3.org/TR/WCAG22/#contrast-minimum and https://www.w3.org/TR/WCAG22/#dfn-relative-luminance

## Primary values

| Custom position | Before | Proposed | Relative luminance |
| --- | --- | --- | --- |
${rows.map(row => `| ${row.slot} | ${row.before} | ${row.after} | ${row.luminance.toFixed(6)} |`).join('\n')}

Reproduction: build-brand-palette.mjs in this folder writes the proposed token JSON and this report from the preserved baseline file.
`;
await fs.writeFile(new URL('primary-palette-review.md', directory), report);
console.log(JSON.stringify({ colors: countColors(revised), changedPrimaryValues: changed, monotonicLuminance: true, primary40: revised.primary['40'].$value.hex, whiteTextContrast: contrast(brand, '#FFFFFF'), darkTextContrast: contrast(brand, '#191C1C'), rows }, null, 2));
