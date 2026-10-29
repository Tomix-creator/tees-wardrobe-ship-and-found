# Where I diverged from the default

Material Design 3 gave me the starting structure: five type roles (Display, Headline, Title, Body, Label), three sizes each, and a generated colour palette. I changed four things on purpose. For each one: what the default was, what I chose, why, and where my choice would be the wrong one.

The "before" values are the style set Figma generated before I edited anything.

---

## 1. Font family: Roboto → Inter

| | |
|---|---|
| **Default** | Roboto, the Material 3 baseline font |
| **Chosen** | Inter, Regular (400) and Medium (500) only |
| **Why** | The first sample button I built in Figma already used Inter, and I wanted one family across the whole system. The order screen is mostly prices, payments and balances, and Inter reads as plain and businesslike, which fits "clear and trustworthy" from the brief. Two weights keep the system small. |
| **Where it's wrong** | Inter is a web font, so it has to download. On a slow mobile connection the page first shows a fallback font, then jumps when Inter arrives. If Tee's customers are on weak data, Roboto, already installed on most Android phones, would load instantly and be the better choice. |

## 2. Letter spacing: Material's per-style values → −4% everywhere

| | |
|---|---|
| **Default** | Each style had its own value. Display Large was −0.25px; Body Large was +0.5px. |
| **Chosen** | −4% on all 15 styles. That is −2.28px at 57px and −0.44px at 11px. |
| **Why** | People scan an order screen rather than read it. Tighter spacing makes amounts and headings read as one compact block, which helps scanning on a narrow phone. Evidence `03` vs `04` shows the same Display Large sentence getting shorter and more solid. |
| **Where it's wrong** | Small text. At Label Small (11px), −4% pulls letters close enough that similar shapes (1, l, I) can blur together, especially on a cheap phone screen in sunlight. Below about 14px, 0% would be safer. I have not tested this on a real phone. |

## 3. Line height: Material's fixed values → the 1.4 / 1.5 / 1.6 rule

| | |
|---|---|
| **Default** | Material's own line heights, e.g. Display Large 57/64 and Body Medium 14/20 |
| **Chosen** | Font size × 1.4 for Display, Headline, Title and Label; × 1.5 for Body Large; × 1.6 for Body Medium and Body Small |
| **Why** | Headings and labels are usually one line, so 1.4 keeps them tight. Body text carries order details and policy answers that wrap over several lines, so it gets more room. The smaller the body text, the more room it gets, because tightly packed small text is the hardest to follow. |
| **Where it's wrong** | Big headings. Display Large at 79.8px is much looser than Material's 64px. If a long heading wraps to two lines on a phone, the gap makes it look like two separate headings and pushes the order details further down the screen. |

Full before/after:

| Style | Material default | Mine |
|---|---|---|
| display/large | 57 / 64 | 57 / 79.8 |
| display/medium | 45 / 52 | 45 / 63 |
| display/small | 36 / 44 | 36 / 50.4 |
| headline/large | 32 / 40 | 32 / 44.8 |
| headline/medium | 28 / 36 | 28 / 39.2 |
| headline/small | 24 / 32 | 24 / 33.6 |
| title/large | 22 / 28 | 22 / 30.8 |
| title/medium | 16 / 24 | 16 / 22.4 |
| title/small | 14 / 20 | 14 / 19.6 |
| body/large | 16 / 24 | 16 / 24 |
| body/medium | 14 / 20 | 14 / 22.4 |
| body/small | 12 / 16 | 12 / 19.2 |
| label/large | 14 / 20 | 14 / 19.6 |
| label/medium | 12 / 16 | 12 / 16.8 |
| label/small | 11 / 16 | 11 / 15.4 |

## 4. Brand colour: generated primary 40 → Tee's exact sea green

| | |
|---|---|
| **Default** | Material Theme Builder generated `#006A65` at primary 40, a darker, duller teal than Tee's colour (evidence `01`) |
| **Chosen** | Tee's exact `#32B1AA` pinned at primary 40, with the other primary shades rebuilt around it: black blended towards sea green for 0–35, sea green blended towards white for 50–100 (evidence `02`) |
| **Why** | This is the Daniel scenario from the task. If the generator is allowed to "correct" the brand colour, the brand disappears from the product. |
| **Where it's wrong** | The rebuilt shades are a straight-line blend, not Material's perceptual (HCT) tones, so the steps are not evenly spaced to the eye. Primary 30 (`#268580`) against primary 40 is only 1.69:1. If I later used neighbouring tones for hover or pressed states, people would barely see the change. White text on the brand colour also fails (2.62:1), so the button uses dark text instead. |

---

Shadows are not a divergence from a Material default, because Material has no brand-coloured shadows. All three are my own values; see `shadows.md`.
