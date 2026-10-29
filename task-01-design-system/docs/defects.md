# Known defects

Real problems in my Task One work, each with where it is and what it would cost if this went to production. Ordered from most to least serious.

---

## 1. Shadows don't follow the brand colour

- **Where:** `css/tokens.css:149–151`, generated from `evidence/06-tokens-complete.json:355, 373, 391`
- **What:** The three shadows store their colour as fixed values (`#0d2c2b1f`, `#0d2c2b29`, `#0d2c2b3d`) instead of pointing at `primary/10`. When I tried to link the shadow colour to the variable in Figma, Figma reset the opacity to 100%, so I kept fixed values.
- **Cost in production:** If Tee changes her brand colour, every button, border and heading updates, but the shadows stay sea-green. Nobody gets an error; the product just looks slightly wrong, and someone has to spot it and fix three values by hand. This is the same failure my step 8 regression demonstrates.

## 2. The exported colour references contain a stray space

- **Where:** `evidence/06-tokens-complete.json:1927–2047` (all nine colour roles); worked around in `scripts/convert-tokens.js:63`
- **What:** Figma exported every role reference with a space before the dot, e.g. `{primitive brand .primary.40}`. The real group name is `primitive brand` with no trailing space, so an exact lookup fails on all nine. My converter splits the reference on dots and trims each part, which makes it work.
- **Cost in production:** Only my converter knows about this. If the team switched to a standard tool such as Style Dictionary, or another developer wrote their own converter, all nine roles would fail to resolve and the interface would lose every colour at once.

## 3. The order screen ignores the spacing tokens

- **Where:** `index.html`, 54 hardcoded pixel values, e.g. `index.html:27` (`padding: 10px`), `:37` (`max-width: 392px`), `:42` (`padding: 14px`)
- **What:** I defined a spacing scale in `css/spacing.css`, but `index.html` never loads it. Colours and type come from tokens; spacing is typed in by hand.
- **Cost in production:** Spacing will drift. One card gets 14px, the next 16px, and changing the spacing scale changes nothing on screen. It also means my "no hardcoded values" claim is only true for colour.

## 4. −4% letter spacing on the smallest text

- **Where:** `css/tokens.css:228–231` (Label Small: 11px, −0.44px)
- **What:** I applied −4% to all 15 styles, including the 11px and 12px ones.
- **Cost in production:** Small labels can become hard to read on low-cost phones or in sunlight. Untested on a real device.

## 5. The rebuilt primary shades are unevenly spaced

- **Where:** `css/tokens.css:23–25` (primary 30 `#268580`, primary 40 `#32b1aa`)
- **What:** I rebuilt the primary family as a straight blend from black to sea green to white, not with Material's perceptual tones. Neighbouring shades can look almost the same: primary 30 vs 40 is only 1.69:1.
- **Cost in production:** Hover, pressed and selected states built from neighbouring shades would be nearly invisible, especially to people with low vision.

## 6. No dark mode

- **Where:** `css/tokens.css:7`, where only a `:root` light theme exists
- **What:** Roles and contrast are only defined and checked for light surfaces.
- **Cost in production:** A dark-mode request means designing and contrast-checking every role pair from scratch. Nothing is ready to switch on.

## 7. The demo stores nothing

- **Where:** `index.html:378` (`const orders = { … }`)
- **What:** The two orders are fictional data in a JavaScript object. There is no database, no form and no saving.
- **Cost in production:** None today, because the screen is labelled as a demonstration. It would only become a defect if anyone presented it as working software. Real storage is Task Two.

---

## Evidence limitations

These are not code defects, but a marker should know them:

- **`09-screen-without-system.png`** is cut off on the right edge. I don't know the exact cause (overflowing table defaults or the browser's scrollbar). I kept the original rather than re-taking it.
- **`03-spacing-default.png`** is a reconstruction: the original −0.25px spacing re-applied to Inter. It is not a screenshot of the original Roboto style.
- **`07-raw-value-search.txt`** was recorded on 27 October. It proves the screen at that point had no raw colours; it does not cover later changes.
- **`11-broken-referencing.png`** used a temporary extra role (`brand-accent`) so the broken and working parts could appear on one screen. That role existed only on the deleted branch.

## Business assumptions not yet confirmed

- The payment-confusion story from the first owner interview is unconfirmed. Tee isn't sure it happened, so I treat it as an example, not a fact.
- Customers' phones, data quality and preference for WhatsApp links are Tee's guesses. No customer has been interviewed.
