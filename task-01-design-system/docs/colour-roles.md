# Tee’s Wardrobe — colour roles and checked pairs

The current light-surface role aliases were verified in Figma. These are the seven original roles; two additional roles are recorded below. Dark-mode mapping remains open.

```text
Role         Points to         Value
Primary      primary/40        #32B1AA
On primary   neutral/10        #191C1C
Surface      neutral/98        #F8FAF8
On surface   neutral/10        #191C1C
Error        status/error      #BA1A1A
Warning      status/warning    #7A5900
Success      status/success    #17643B
```

A role names a job. A primitive names a stored colour. The roles point to primitives so interface colours can be changed from a shared source.

## Checked text pairs

| Pair | Contrast ratio | Ordinary-text minimum of 4.5:1 |
|---|---:|---|
| Primary / On primary | 6.5389:1 | Pass |
| Surface / On surface | 16.3543:1 | Pass |
| Surface / Error | 6.1594:1 | Pass |
| Surface / Warning | 6.1481:1 | Pass |
| Surface / Success | 6.8507:1 | Pass |

The ratios use the WCAG sRGB relative-luminance calculation. They establish only these foreground/background pairs, not accessibility of a whole screen. Use text labels and other cues with functional colours; colour alone should not carry the message.

White on the exact brand colour is 2.6234:1 and is not approved for ordinary text or large text. The current brand button uses dark On primary text. Control boundaries and keyboard focus need separate checks in the implemented interface.

Source: https://www.w3.org/TR/WCAG22/#contrast-minimum

## Palette origin and counts

The owner supplied sea green; the Figma source swatch was confirmed as #32B1AA at 100% opacity. The retained palette has five colour families, each with 18 positions, plus brand/source and three functional primitives: 94 primitives in total. Nine aliases now make 103 variable records across two collections.

The primary palette was rebuilt around the exact brand at position 40; the other four families were retained from the checked export. The numbered primary positions are custom positions and are not standard Material tone lightness values. See the original palette review and builder retained alongside this submission pack.

### Comparison of Palette Before and After Pinning (Evidence 01 vs 02)

In [`evidence/01-palette-before-pin.png`](../evidence/01-palette-before-pin.png), the initial Figma "primitive brand" collection displays the unpinned Material Theme Builder baseline, where `primary/40` was generated as `#006A65`, darkening and absorbing the owner's supplied sea-green swatch (`#32B1AA`). In [`evidence/02-palette-after-pin.png`](../evidence/02-palette-after-pin.png) (supported across the other families by captures `02b` through `02e`), the palette reflects the custom rebuilding method: the exact brand `#32B1AA` is pinned at `primary/40`, and 16 intermediate primary shades were custom-blended in sRGB (mixing black to brand for steps 0–40, and brand to white for steps 40–100). The visible difference is that the primary column is noticeably brighter and centered around the authentic sea-green brand hue rather than a muted dark teal; however, as documented, these step numbers are custom position labels rather than standard Material HCT perceptual lightness values.

*Verification limitation on other families*: While the rebuild specification intended to keep the other four tonal families (Secondary, Tertiary, Neutral, Neutral Variant) unchanged from the initial generation, `evidence/01-palette-before-pin.png` captures only the primary column, and no baseline pre-pin token JSON is saved in the repository. Consequently, the claim that all 72 non-primary positions remained strictly identical cannot be verified solely from the saved evidence and is recorded as **unverified**.

## Deliverables Status & Genuine Open Work

- **Complete Token Export**: Completed. The 103-variable export (94 primitives and 9 aliases across 2 collections) is saved as [`evidence/06-tokens-complete.json`](../evidence/06-tokens-complete.json), while [`evidence/05-tokens-incomplete.json`](../evidence/05-tokens-incomplete.json) documents the baseline omission of variable collections.
- **Implemented Roles on Prototype**: Completed. The added roles (`field-outline` and `focus-indicator`) are compiled to `css/tokens.css` and actively applied in `index.html`. In [`evidence/07-raw-value-search.txt`](../evidence/07-raw-value-search.txt), automated searches over `index.html` confirmed zero raw colour values (hex, RGB/RGBA, HSL/HSLA, named CSS colours) and zero direct primitive token references; note that the search tested colours and token referencing, not pixel dimensions or font-family declarations.
- **Justification of 18 Steps**: Genuinely open. The 18 positions were retained from the source palette for symmetry and migration safety, but a formal justification proving why all 18 positions are strictly necessary (versus a leaner 10-step or 12-step scale) remains an open design justification.
- **Dark Mode Mapping**: Genuinely open. Semantic role pairings and contrast checks have only been verified for light surfaces; no dark mode tokens (`@media (prefers-color-scheme: dark)`) or dark role overrides have been implemented in the codebase.
- **Physical Phone Contrast Verification**: Genuinely open. Mathematical WCAG 2.2 calculations pass on paper, but readability under varying Nigerian ambient sunlight and low-cost smartphone panels remains unverified.

## Order screen: added roles and prototype implementation

The demonstration screen (`index.html`) requires visible structural boundaries and keyboard focus indication. Note that the prototype does **not** contain an editable price input field (all order totals, balances, and payments are displayed as read-only demonstration text); the only interactive form control is the order selection `<select id="orderSelector">` element.

| Role | Primitive | Colour | Prototype use in `index.html` | Checked pair | Ratio |
|---|---|---|---|---|---:|
| Field outline | neutral/40 | #5C5F5E | 1px border on `#orderSelector`, card borders, table dividers, and subtext labels | Surface #F8FAF8 | 6.15:1 |
| Focus indicator | primary/15 | #134240 | 2px `:focus-visible` outline around the `#orderSelector` dropdown control | Surface #F8FAF8 | 10.64:1 |
| Focus indicator | primary/15 | #134240 | Outline contrast if placed adjacent to Primary fill | Primary #32B1AA | 4.26:1 |

In the implemented screen, `--color-role-field-outline` establishes clear card containers, divider lines, and dropdown borders at 6.15:1 contrast against Surface. When navigating via the <kbd>Tab</kbd> key, `:focus-visible` on `#orderSelector` triggers a 2px outline with 2px offset in `--color-role-focus-indicator`, providing a sharp 10.64:1 indicator against Surface. These roles are fully wired in CSS and tested, resolving earlier draft notes that marked their screen usage unchecked.

## What the 18 positions provide

Each of the five retained families has 18 numbered positions from 0 to 100. This gives several dark and light candidates from one palette: for example, the current light surface uses neutral/98 and its text uses neutral/10; primary/40 is the brand colour. Candidate dark surface neutral/10 with neutral/98 text also gives 16.35:1, and brand primary/40 with neutral/10 text gives 6.54:1. These two calculations show useful endpoints, not that all dark roles or states have been designed.

Eighteen positions were retained from the source palette to give room to select backgrounds, text and interactive states; the count is not proof that every necessary pair works or that every position is needed. Our custom primary numbers are palette labels, not Material HCT lightness measurements. The task asks us to justify the number for light and dark; a complete dark mapping, including functional colours and control states, still needs selection and testing before claiming dark-mode support. The PDF does not explicitly require building a complete dark screen.

Correction: an earlier proposal incorrectly identified old-palette #00504C as the current primary/30. The current brand-anchored primary/30 is #268580; its contrast against #32B1AA is about 1.69:1. Focus indicator now aliases current primary/15 #134240, verified in Figma.
