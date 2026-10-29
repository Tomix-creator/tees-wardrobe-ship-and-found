# Export candidate review

Source: user-provided design-tokens.tokens.json, received 2026-10-27. Saved unchanged as evidence/support-export-candidate.tokens.json. SHA-256: efbab56ac79fb061992bb301d3b5747156bf51b8f7ca2faa6cc4ede86c9cbda4.

The JSON parses and contains 94 primitive colour tokens, nine colour-role entries, 15 composite font styles, 165 individual typography-property tokens, and three effects. The font section is the source for the 15 composite styles; the separate typography section expands their properties and must not be mistaken for 165 separate styles.

All nine role values use references like {primitive brand .primary.40}. The root key is primitive brand without the space before the dot. Exact key lookup fails on all nine; trimming each path segment resolves each to the expected primitive. Whether a particular consumer trims spaces is unverified, so this remains a compatibility defect until the source or converter is fixed and verified. Do not silently alter the original evidence.

The file includes variables and is a candidate for the complete export, not the required deliberately incomplete export. The separate user-provided incomplete export is saved unchanged as evidence/05-tokens-incomplete.json; the variables-included export is saved unchanged as evidence/06-tokens-complete.json. All 15 styles match the previously recorded Figma family, weight, size, line height, and spacing (converted from -4% to pixels). The three effect values match the previously recorded offsets, blur, spread and rounded RGBA values. The unresolved exact-reference issue must be handled before treating the file as implementation-ready.

## Actual comparison

The incomplete export lacks `primitive brand` (94 colours) and `colour roles` (9 links); the `font`, `effect`, and `typography` groups are identical to the variables-included export. We detected the omission by parsing both files and comparing their top-level groups. The variables-included file has the reference-whitespace compatibility issue described above.
