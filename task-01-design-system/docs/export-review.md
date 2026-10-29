# Token export: the omission, and how I caught it

## The one-line diff

> The first export was missing all colours: the `primitive brand` group (94 colours) and the `colour roles` group (9 roles). I noticed because comparing the two files' top-level groups showed `font`, `effect` and `typography` in both, but the colour groups only in the second.

## The two files

| | [`05-tokens-incomplete.json`](../evidence/05-tokens-incomplete.json) | [`06-tokens-complete.json`](../evidence/06-tokens-complete.json) |
|---|---|---|
| Typography (15 styles) | ✅ | ✅ |
| Shadows (3 effects) | ✅ | ✅ |
| Palette (94 colours) | ❌ | ✅ |
| Colour roles (9) | ❌ | ✅ |
| Size | 29,557 bytes | 80,472 bytes |

The first export left out Figma variables, which is where the whole colour system lives. Exporting again with variables included fixed it. Everything else in the two files is identical.

Without colours, the converter would have produced a CSS file with type and shadows but no palette and no roles, and every colour on screen would have fallen back to browser defaults.

## What's inside the complete export

- 94 palette colours: 5 families × 18 tones, 3 functional colours (error, warning, success) and the brand source
- 9 colour roles, each pointing at a palette colour
- 15 text styles (the `font` group). The `typography` group lists the same 15 styles broken into separate properties, which is 165 entries, not 165 styles.
- 3 shadows

All 15 styles and 3 shadows match what I set in Figma.

## A problem inside the complete export

All nine role references have a stray space, e.g. `{primitive brand .primary.40}`, while the group is really called `primitive brand`. An exact lookup fails on every one. My converter trims each part of the reference so they resolve; see defect 2 in `defects.md`. I kept the exported file unchanged as evidence rather than fixing it by hand.

Its fingerprint (SHA-256) is `efbab56ac79fb061992bb301d3b5747156bf51b8f7ca2faa6cc4ede86c9cbda4`. `scripts/verify-tokens.js` checks the converter never changes it.
