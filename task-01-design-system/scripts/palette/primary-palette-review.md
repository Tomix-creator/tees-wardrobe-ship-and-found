# Tee's Wardrobe: proposed primary palette adjustment

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
- Brand with white text: 2.6234:1 — fails the 4.5:1 normal-text threshold.
- Brand with neutral/10 (#191C1C) text: 6.5389:1 — passes that threshold.

These pair checks do not certify the whole interface. Existing role variables still use the old scheme until deliberately remapped and checked. Import as a separate review collection; do not delete the baseline or blindly replace on-primary with white.

WCAG source: https://www.w3.org/TR/WCAG22/#contrast-minimum and https://www.w3.org/TR/WCAG22/#dfn-relative-luminance

## Primary values

| Custom position | Before | Proposed | Relative luminance |
| --- | --- | --- | --- |
| 0 | #000000 | #000000 | 0.000000 |
| 5 | #001413 | #061615 | 0.006667 |
| 10 | #00201E | #0D2C2B | 0.020613 |
| 15 | #002B29 | #134240 | 0.044050 |
| 20 | #003734 | #195955 | 0.080073 |
| 25 | #004340 | #1F6F6A | 0.127008 |
| 30 | #00504C | #268580 | 0.187456 |
| 35 | #005D59 | #2C9B95 | 0.261481 |
| 40 | #006A65 | #32B1AA | 0.350247 |
| 50 | #008580 | #54BEB8 | 0.421724 |
| 60 | #14A19B | #76CBC6 | 0.506406 |
| 70 | #42BDB5 | #99D8D5 | 0.606881 |
| 80 | #63D9D1 | #BBE5E3 | 0.721495 |
| 90 | #81F5ED | #DDF2F1 | 0.852273 |
| 95 | #B1FFF8 | #EEF9F8 | 0.927058 |
| 98 | #E3FFFC | #F8FCFC | 0.966055 |
| 99 | #F2FFFD | #FCFEFE | 0.987348 |
| 100 | #FFFFFF | #FFFFFF | 1.000000 |

Reproduction: build-brand-palette.mjs in this folder writes the proposed token JSON and this report from the preserved baseline file.
