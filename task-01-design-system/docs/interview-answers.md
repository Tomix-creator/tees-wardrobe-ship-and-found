# Task One: interview answers

---

### 1. How would you structure design tokens?

In three layers, each only allowed to point at the one below it.

1. **Primitives:** raw values with no meaning. In Tee's Wardrobe that's 94 colours: five families of 18 tones each, three functional colours (error `#BA1A1A`, warning `#7A5900`, success `#17643B`) and the brand source.
2. **Roles:** jobs, not colours. `Primary → primary/40`, `On primary → neutral/10`, `Surface → neutral/98`, plus field outline and focus indicator. This is the only layer the interface may use.
3. **Composites:** bundles of properties. 15 text styles (font, weight, size, line height, letter spacing), three shadows, and a spacing scale.

The rule that makes it work: the screen uses `--color-role-primary`, never `--color-primitive-brand-primary-40` and never `#32B1AA`. Then changing a role changes every place that does that job, and nothing else.

---

### 2. When is a token change breaking?

When something that uses the token stops working or changes in a way nobody intended.

- **Renaming or deleting** a token, e.g. renaming `--color-role-primary` or deleting `.type-title-medium`. Everything referencing it loses its style.
- **Changing the type or unit**, e.g. px to rem without rescaling, or a number to a string, so the CSS stops making sense.
- **Changing one half of a pair.** Change Surface without checking On surface and the text can drop below 4.5:1. Nothing errors; the screen just becomes hard to read. This is the dangerous one.
- **Changing the shape**, e.g. one shadow becoming a list of shadows, which older tools can't parse.

In Task Two, `scripts/check-tokens.js` compares fingerprints of the Task One and Task Two token files so the copies can't silently drift apart. It catches drift between the two copies, not every breaking change.

---

### 3. How would you support multiple brands and themes?

Keep the role names fixed and change what they point at.

- **Components only use roles**, like `var(--color-role-primary)`, never brand names or hex values.
- **A second brand** gets its own palette. Switching brands means pointing the same roles at the new palette; the screens don't change.
- **Dark mode** is the same trick: under a dark theme, Surface points at neutral/10 instead of neutral/98, and On surface flips the other way. That pair is still 16.35:1.

Honestly, my project only has the light mapping. Dark mode is designed in principle but not built or contrast-checked, and I wouldn't claim it works.

---

### 4. Can tokens guarantee accessible contrast?

No. A token is a stored value. It doesn't know where it will be used.

`On surface` on `Surface` is 16.35:1, but nothing stops a developer putting `On surface` text on a photo, a gradient or the brand colour. The token can't prevent that.

What tokens can do is make the safe choice the easy one. I define colours in checked pairs (`Surface` with `On surface`, `Primary` with `On primary` at 6.54:1), name them so the pairing is obvious, and record the numbers.

Real accessibility still needs people following the pairs and checks on the actual screen, with browser tools and real devices. A role being checked on paper doesn't mean the page is.

---

### 5. How do you ensure that colour contrast guidelines are met within a website or application's design?

Four steps, in this order.

1. **Calculate before building.** I checked every pair I'd actually use with the WCAG formula: On primary on Primary 6.54:1, On surface on Surface 16.35:1, status colours on Surface 6.15–6.85:1.
2. **Reject failures openly.** White on Tee's sea green is 2.62:1, a fail even for large text, so I banned white text on Primary and used dark `#191C1C` instead.
3. **Check non-text too.** Borders and focus outlines need 3:1. Field outline is 6.15:1; the focus outline is 10.64:1 on Surface and 4.26:1 next to Primary.
4. **Check the code uses the roles.** My raw-colour search (evidence 07) found no hex, rgb or hsl values in `index.html`. That proves the screen uses roles; it doesn't prove each role is placed on the right background, so the screen still needs looking at.

---

### 6. Can you discuss the differences between WCAG levels A, AA and AAA?

They're three levels of the same guidelines, each including the one below.

- **A, the floor.** Without it, some people can't use the page at all: text alternatives for images, everything usable by keyboard, no keyboard traps, page titles.
- **AA, the normal target**, and what most laws and contracts ask for. Text contrast 4.5:1 (3:1 for large text), borders and focus outlines 3:1, visible focus, and text that can be enlarged to 200% without breaking.
- **AAA, the strictest.** Text contrast 7:1, sign-language versions of video, and more. WCAG itself says it isn't realistic to meet AAA across a whole general site.

Tee's Wardrobe targets AA. My main text pair (16.35:1) actually meets AAA, but the brand button (6.54:1) only meets AA, and that's fine.

---

### 7. Discuss the importance of semantic HTML in the context of accessibility.

Semantic HTML means using tags that say what something *is*, like `<button>`, `<label>` and `<h2>`, instead of a `<div>` styled to look like it.

It matters because screen readers don't see the page; they read the browser's accessibility tree, which is built from those tags.

- A `<button>` is announced as a button and works with Enter and Space automatically. A `<div class="btn">` is just text unless I rebuild all of that by hand.
- Native controls get keyboard focus for free, so keyboard users don't get stuck.
- Screen-reader users jump between headings and landmarks like `<main>`. Without them, they have to listen to the whole page in order.

My order screen uses `<header>`, `<main>`, `<section>`, `<footer>`, `<h1>`/`<h2>`, a real `<label>` tied to the order `<select>`, and a `<table>` with `<th>` headers for the money breakdown. I haven't tested it with a screen reader yet; that's Task Three.

---

### 8. How do you handle design handoff to developers using Figma?

I treat Figma as the source and make the handoff a file, not a set of screenshots.

1. **Everything lives in Figma variables and styles**: colours, roles, text styles, shadows. Nothing is a loose hex value on the canvas.
2. **Export to JSON, with variables included.** I learned this the hard way: my first export (evidence 05) left out all 94 colours because variables weren't included.
3. **Convert with a script.** `scripts/convert-tokens.js` turns the JSON into CSS variables and text-style classes; `scripts/verify-tokens.js` runs 112 checks that the output matches.
4. **Document the decisions**, not just the values: contrast ratios, why −4%, where each choice fails.

The weak point is that it's one-way. If someone edits the CSS by hand, Figma doesn't know.

---

### 9. Why do AI-generated interfaces tend to look generic, and what specifically do you hand an agent to stop it?

Because with nothing specific to go on, the agent produces the most likely interface: average colours, default fonts, the same cards everyone gets. For an unspecified request that's the correct answer, and it's why projects built that way all look alike.

What I gave Antigravity:

1. **The tokens**: `tokens.css` with Tee's sea green as `--color-role-primary`, the 15 Inter text classes and the shadows.
2. **The business brief**: who uses it, on what, and rules like "unquoted delivery is never shown as zero".
3. **Explicit limits** in the prompt: use only `--color-role-*` and `.type-*` classes, no hardcoded colours.

Then I checked it rather than trusting it. The raw-colour search found none in the screen, and when I asked which style the "Financial Breakdown & Balance" heading used, it said Title Medium, which matches the code and the browser. Spacing is where it still slipped: it typed pixel values by hand.

---

### 10. Your line height for display large is a specific number. Why that number and not one step either side of it? What would you lose with each?

Display Large is 57px × 1.4 = **79.8px**.

Display Large is for short, prominent headings, usually one or two lines. 1.4 gives enough space that a two-line heading doesn't feel cramped, without pushing the rest of the screen down.

- **One step tighter, ×1.3 (74.1px):** saves about 6px per line on a small phone screen. But if the heading wraps, the descenders of line one get close to the tops of line two and the block looks dense.
- **One step looser, ×1.5 (85.5px):** more air, but a two-line heading starts to look like two separate headings, and on a 412px-wide phone it pushes the order details further down, below the first screen.

So 1.4 is the tightest step that still reads comfortably. 1.4 to 1.6 is also the range the task sets, and 1.4 is the bottom of it.

---

### 11. Point at one place in your own token structure that you would build differently if you started again. Say what you would do instead and what it would cost.

**The shadows.**

Right now each shadow stores a fixed colour: `#0d2c2b1f`, `#0d2c2b29`, `#0d2c2b3d` (`06-tokens-complete.json`, lines 355, 373 and 391). When I tried to link the shadow to the `primary/10` variable in Figma, the opacity reset to 100%, so I kept fixed values.

**Instead:** I'd store each shadow as a reference to `primary/10` plus a separate opacity number (0.12, 0.16, 0.24), and have the converter combine them into the CSS.

**Cost to fix:** changing the converter to read and combine the two parts, adding tests, and checking the output still matches the current shadows exactly.

**Cost of not fixing:** if Tee's brand colour changes, everything updates except the shadows, which quietly stay sea green until someone notices. It's the same failure I demonstrated on purpose in step 8.

---

### 12. Wrong-answer analysis. A candidate says: "I set up design tokens by exporting the hex values from Figma into a CSS file, so every colour in the codebase comes from one place. That makes it a single source of truth." This sounds correct and is not. Say precisely what is missing and what will go wrong in month four.

**What's missing:** the role layer. They have one place where colours are *stored*, but components still pick colours by name, e.g. `var(--blue-500)` or `var(--white)`. Nothing records what each colour is *for*, and nothing pairs a background with its text colour.

**Month four:**

- **Rebrand from blue to teal.** Either they rename `--blue-500` in every file, a big breaking change, or they set `--blue-500: teal`, and now the code lies about its own colours.
- **Dark mode.** There's no "surface" to flip. Every component that used `--white` as a background has to be found and changed by hand, and each one risks a contrast failure.
- **Someone changes a hex in Figma** and re-exports. Every use of that colour changes at once, including places it was never meant to, because one value was doing several jobs.

One file of hex values is a list of colours, not a design system.
