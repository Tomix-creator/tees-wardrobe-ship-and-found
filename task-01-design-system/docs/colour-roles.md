# Colour system and roles

## Where the brand colour came from

Tee told me her brand colour is sea green. My first guess was the standard web "seagreen", `#2E8B57`, but that was my guess, not hers. She then sent a sea-green swatch, and I sampled it in Figma as **`#32B1AA`**. That is the brand colour everywhere in this system.

## How the palette was built

1. **Generated in Figma.** I entered `#32B1AA` into the **Material Theme Builder** plugin. It produced five tonal families (primary, secondary, tertiary, neutral, neutral variant) with 18 tones each.
2. **Before pinning** ([`01`](../evidence/01-palette-before-pin.png)): the plugin put `#006A65` at primary 40, a darker, duller teal. Tee's colour was absorbed and didn't appear anywhere in the primary column.
3. **After pinning** ([`02`](../evidence/02-palette-after-pin.png), plus `02b`–`02e` for the other families): I put `#32B1AA` exactly at primary 40 and rebuilt the other primary tones around it with a script ([`scripts/palette/`](../scripts/palette/)). Tones 0–35 blend from black towards sea green; tones 50–100 blend from sea green towards white. The primary column is now visibly brighter and recognisably Tee's colour instead of a muted dark teal.

The other four families were kept as the plugin generated them. Evidence `01` only shows the primary column, so I can't prove from saved images alone that the other families stayed identical.

The rebuilt primary tones are a straight-line blend, not Material's perceptual tones. So "primary 20" in my file is not the colour Material would call 20. See `divergences.md` and `defects.md`.

## Why 18 tones

The plugin produced 18 tones per family: the 13 standard Material tones (0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100) plus four in-between tones (5, 15, 25, 35). Evidence `01`, taken in Figma on 26 October, shows all 18 before anything else was changed.

That's enough for light and dark from one source because each family runs from near-black to near-white:

- **Light mode** uses the light end for backgrounds and the dark end for text: surface neutral/98 with text neutral/10 (16.35:1).
- **Dark mode** would flip it: surface neutral/10 with text neutral/98, also 16.35:1.
- The in-between tones give finer steps at the dark end, which is where dark-mode surfaces and strong outlines get chosen.

The screen currently uses one in-between tone, primary/15, for the keyboard focus outline. Unused tones cost nothing on screen, because the interface only ever references roles, never tones directly.

## Functional colours

| Name | Value | Contrast on surface `#F8FAF8` |
|---|---|---:|
| Error | `#BA1A1A` | 6.16:1 |
| Warning | `#7A5900` | 6.15:1 |
| Success | `#17643B` | 6.85:1 |

## Roles

A role is a job, not a colour. The interface only uses roles; roles point at palette tones.

| Role | Points to | Value | Job |
|---|---|---|---|
| Primary | primary/40 | `#32B1AA` | Brand accents, the title badge |
| On primary | neutral/10 | `#191C1C` | Text on top of Primary |
| Surface | neutral/98 | `#F8FAF8` | Page and card background |
| On surface | neutral/10 | `#191C1C` | Normal text |
| Error | status/error | `#BA1A1A` | Error messages |
| Warning | status/warning | `#7A5900` | Warnings, e.g. "not yet quoted" |
| Success | status/success | `#17643B` | Confirmed payments |
| Field outline | neutral/40 | `#5C5F5E` | Borders on cards, tables and the order selector |
| Focus indicator | primary/15 | `#134240` | Outline when a control has keyboard focus |

## Contrast checks

Every pair the screen actually uses, calculated with the WCAG formula. Text needs 4.5:1; borders and focus outlines need 3:1.

| Foreground on background | Ratio | Needs | Result |
|---|---:|---:|---|
| On primary on Primary | 6.54:1 | 4.5 | Pass |
| On surface on Surface | 16.35:1 | 4.5 | Pass |
| Error on Surface | 6.16:1 | 4.5 | Pass |
| Warning on Surface | 6.15:1 | 4.5 | Pass |
| Success on Surface | 6.85:1 | 4.5 | Pass |
| Field outline on Surface | 6.15:1 | 3 | Pass |
| Focus indicator on Surface | 10.64:1 | 3 | Pass |
| Focus indicator next to Primary | 4.26:1 | 3 | Pass |
| **White on Primary** | **2.62:1** | 4.5 | **Fail: not used** |

White text on the sea green fails even the large-text minimum (3:1), so every piece of text on Primary uses dark On primary instead. That's why the title badge has dark text.

These numbers only prove these specific pairs. They don't make the whole screen accessible, and colour is never the only signal: errors, warnings and payments always have words as well.

Source: [WCAG 2.2, contrast minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum)

## Not done yet

- **Dark mode roles** aren't defined or checked. The tones support it; the mapping doesn't exist.
- **Real-phone check.** The ratios are calculated, not tested on a cheap phone in sunlight.
