# Type scale

Fifteen styles: five roles, three sizes each. All use Inter. I re-opened and checked every saved style in Figma on 27 October 2026.

| Style | Weight | Size (px) | Letter spacing | Line height (px) | Multiplier |
|---|---|---:|---|---:|---:|
| display/large | 400 | 57 | −4% | 79.8 | 1.4 |
| display/medium | 400 | 45 | −4% | 63 | 1.4 |
| display/small | 400 | 36 | −4% | 50.4 | 1.4 |
| headline/large | 400 | 32 | −4% | 44.8 | 1.4 |
| headline/medium | 400 | 28 | −4% | 39.2 | 1.4 |
| headline/small | 400 | 24 | −4% | 33.6 | 1.4 |
| title/large | 500 | 22 | −4% | 30.8 | 1.4 |
| title/medium | 500 | 16 | −4% | 22.4 | 1.4 |
| title/small | 500 | 14 | −4% | 19.6 | 1.4 |
| body/large | 400 | 16 | −4% | 24 | 1.5 |
| body/medium | 400 | 14 | −4% | 22.4 | 1.6 |
| body/small | 400 | 12 | −4% | 19.2 | 1.6 |
| label/large | 500 | 14 | −4% | 19.6 | 1.4 |
| label/medium | 500 | 12 | −4% | 16.8 | 1.4 |
| label/small | 500 | 11 | −4% | 15.4 | 1.4 |

400 = Regular, 500 = Medium. Letter spacing is a percentage of font size, so −4% at 57px is −2.28px.

## Which multiplier, and why

Line height is always font size × 1.4, 1.5 or 1.6:

- **1.4: Display, Headline, Title, Label.** These are short and usually sit on one line. Extra space between lines would just push content down.
- **1.5: Body Large.** This is the main reading text: order amounts, payment messages.
- **1.6: Body Medium and Small.** Smaller text that often wraps, like policy answers and notes. Tight small text is the hardest to follow across lines, so it gets the most room.

## How the roles are used

- **Body Large** is the default for anything essential: amounts owed, payment confirmations.
- **Title** marks sections, e.g. "Financial Breakdown & Balance" uses Title Medium.
- **11–12px styles** are kept for non-essential details only, because they haven't been checked on a real phone.

Having 15 styles doesn't mean every screen uses all 15.

## Display Large: default spacing vs chosen spacing

[`03-spacing-default.png`](../evidence/03-spacing-default.png) and [`04-spacing-chosen.png`](../evidence/04-spacing-chosen.png) show the same sentence in Inter Regular 57px, 79.8px line height, same colours and frame. The only difference is letter spacing: −0.25px (Material's default) vs −4% (−2.28px).

With −4%, the sentence is noticeably shorter and the letters sit closer, so the heading reads as one solid shape rather than a row of separate letters. At this size it's still easy to read. This one sample doesn't prove −4% works for small text; see `divergences.md`.

Note: `03` is a reconstruction. I re-applied Material's −0.25px to Inter; it isn't a screenshot of the original Roboto style.
