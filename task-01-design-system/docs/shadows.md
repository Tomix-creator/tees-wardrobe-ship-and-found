# Tee’s Wardrobe — shadows

Status: three shared effect styles created, applied to comparison cards and verified in Figma on 2026-10-27.

```text
All geometry is in pixels. One Normal drop shadow per style.
Colour: #0D2C2B, the existing primary/10 dark brand shade.

Style   X   Y   Blur  Spread  Opacity
Soft    0   2    8      0      12%
Medium  0   6   16      0      16%
Hard    0  10   16      0      24%
```

The dark sea-green shadow carries a small amount of the brand hue, while black would add no hue of its own. At these low opacities the difference is subtle and depends on the background; it is not a promise of stronger contrast.

Soft is for gentle separation around a resting card. Medium is for raised menus and popovers. Hard is the strongest of this set and should be reserved for floating dialogs; the name is relative, and its 16px blur still produces a soft edge.

These are custom values chosen for the bootcamp requirement of three brand-derived shadows. Material 3 is the starting guide, not a claim that these are its official elevation values. Its documentation distinguishes shadow elevation from tonal elevation.

Source: https://developer.android.com/develop/ui/compose/designsystems/material3#elevation

## Verified

- Saved styles: tee's wardrobe/shadow/soft, medium and hard.
- Each was reopened and its actual stored geometry, colour and opacity checked.
- Comparison frame: Shadow styles — review, node 60:17.
- Three shadowed cards are arranged horizontally with 96px gaps and 64px outer padding. Surface role is used for the review background and cards. No shadow clipping observed.

## Concrete risks and alternatives

- Medium severity, future brand changes: direct RGBA shadow colours will stay on the previous colour until the effect styles are updated. The attempt to bind primary/10 reset opacity to 100%, so the intended values were restored and the limitation was documented in each style description. Future conversion should derive shadow RGB from primary/10 with the intended per-style alpha and verify the regenerated result; do not claim an existing live Figma binding.
- Medium severity, boundary visibility: a faint shadow can disappear on an unsuitable background. Use a checked border or focus outline for controls, rather than relying on a shadow to communicate a required boundary or focus.
- Low severity, visual clutter: using Hard on every card would give ordinary content too much emphasis. Prefer Soft or no shadow for resting surfaces.

## Status of Evidence & Genuine Open Issues

- **Typography Spacing Evidence**: Completed. [`evidence/03-spacing-default.png`](../evidence/03-spacing-default.png) and [`evidence/04-spacing-chosen.png`](../evidence/04-spacing-chosen.png) are saved in the repository, and the spacing comparison paragraph is documented in [`docs/type-scale.md`](type-scale.md).
- **Token Exports**: Completed. Both [`evidence/05-tokens-incomplete.json`](../evidence/05-tokens-incomplete.json) and [`evidence/06-tokens-complete.json`](../evidence/06-tokens-complete.json) are saved and verified.
- **Shadow Frame PNG Export**: Genuinely open. The visual comparison was reviewed in the live Figma file (node 60:17) and its properties documented in [`evidence/support-shadows-ui-audit.json`](../evidence/support-shadows-ui-audit.json); however, a separate standalone PNG export of the comparison frame was not saved into `evidence/`. Do not claim a native comparison PNG exists.
- **Shadow Color Coupling**: Genuinely open limitation. Because Figma effect opacity bindings reset to 100% when referencing color variables directly, shadow RGBA values (`rgba(13, 44, 43, 0.12)`, etc.) are hardcoded in the token definitions. Changing the brand color will not automatically regenerate the shadow tones; they must be re-derived manually from `primary/10`.
- **Boundary Contrast**: Genuinely open limitation. Faint shadows (12%–16% opacity) are subtle and cannot substitute for accessible borders or high-contrast focus indicators on resting or active controls.
