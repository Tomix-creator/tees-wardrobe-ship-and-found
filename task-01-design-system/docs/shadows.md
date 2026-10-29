# Shadows

Three shadows built from the brand palette instead of black. All three use `#0D2C2B`, the dark end of the sea-green family (primary/10). Each is a single drop shadow.

| Style | X | Y | Blur | Spread | Opacity | Use for |
|---|---:|---:|---:|---:|---:|---|
| Soft | 0 | 2 | 8 | 0 | 12% | Resting cards |
| Medium | 0 | 6 | 16 | 0 | 16% | Menus and pop-overs |
| Hard | 0 | 10 | 16 | 0 | 24% | Floating dialogs only |

All values in pixels. The order screen uses Soft on its main container.

## Why brand colour instead of black

A black shadow is just grey dirt under the card: it adds darkness but no colour, so on a pale sea-green-tinted page it looks slightly cold and out of place. A shadow made from the brand's own dark green blends into the page and makes the whole screen feel like one family of colours, even though the difference is subtle at these low opacities.

## Why primary/10 and not the brand colour itself

A shadow has to be darker than the surface it sits on. `#32B1AA` at 12% opacity would look like a light green glow rather than a shadow. Primary/10 is the same hue, just much darker, so it reads as a shadow while still carrying the brand.

## Choosing the three

- **Soft** separates a card from the page without drawing attention.
- **Medium** lifts things that sit above the page temporarily.
- **Hard** is the strongest. Using it on every card would make everything shout, so it's reserved for dialogs. The name is relative: its 16px blur still gives a soft edge.

These are my own values. Material 3 has elevation levels, but no brand-coloured shadows to copy.

## Known problems

- **The colour is fixed, not linked.** Figma reset opacity to 100% when I linked the shadow to the `primary/10` variable, so each shadow stores its colour directly. If the brand colour changes, the shadows won't follow. (Defect 1 in `defects.md`.)
- **Shadows aren't borders.** A 12% shadow can disappear on some backgrounds, so anything that needs a visible edge (inputs, the order selector) gets a Field outline border as well.

## Checked

The three effect styles (tee's wardrobe/shadow/soft, medium, hard) were re-opened in Figma on 27 October and every value matched the table above. The Figma record is in [`support-shadows-ui-audit.json`](../evidence/support-shadows-ui-audit.json).
