# Tee’s Wardrobe — deliberate changes

Reference: the actual generated tee’s wardrobe styles recorded before editing, preserved in figma-before-body-update.json and the style backup. Material Design 3 supplies the five-group type structure, while the bootcamp requires project-specific choices.

## Font family

Before: the generated 15-style set used Roboto. Chosen: Inter, with Regular and Medium weights. Reason: one consistent family matching the existing Inter button direction; this is a design choice, not proof of a business outcome. Where it would be wrong: using the choice without loading the real font in the app, or continuing if the owner/customer phone reading tests show another face is clearer.

## Letter spacing

Before: the generated Display Large was -0.25px; other styles had their own values. Chosen: -4% on all 15 styles, explicitly requested and clarified by the user. At size 57 this is -2.28px, while at size 12 it is -0.48px. Reason: the user selected a more compact appearance. Where it would be wrong: small text, dense content or letter shapes that become difficult to distinguish. Body examples were checked for overlap/clipping at 100% zoom, but the Display Large comparison is saved in evidence/03-spacing-default.png and 04-spacing-chosen.png. Phone legibility remains unverified.

## Line height

Before and after values are recorded below. Chosen: use the exercise multipliers 1.4, 1.5 and 1.6 deliberately across the roles. More vertical space can help separate lines, but can also make short labels or large headings waste space and cause unnecessary wrapping. Check real content in narrow layouts.

```text
Style              Generated size/line  Chosen size/line
display/large      57/64                57/79.8
display/medium     45/52                45/63
display/small      36/44                36/50.4
headline/large     32/40                32/44.8
headline/medium    28/36                28/39.2
headline/small     24/32                24/33.6
title/large        22/28                22/30.8
title/medium       16/24                16/22.4
title/small        14/20                14/19.6
body/large         16/24                16/24
body/medium        14/20                14/22.4
body/small         12/16                12/19.2
label/large        14/20                14/19.6
label/medium       12/16                12/16.8
label/small        11/16                11/15.4
```

## Brand colour position

The exact owner-approved sea green #32B1AA is pinned at primary/40 to meet the assignment. The primary shades are a custom sRGB black → brand at position 40 → white scale, not standard Material HCT lightness positions. Where it would be wrong: assuming that position 40 has Material tone 40 brightness or pairing it with white text without measuring. White on the brand colour was measured at about 2.62:1; dark #191C1C text gives about 6.54:1.

## Shadows

The three dark sea-green shadows meet the exercise inventory. They are custom Soft/Medium/Hard styles, not official Material 3 elevation tokens. Their RGBA colours are recorded directly and need explicit updates when the palette changes. See shadows.md.
