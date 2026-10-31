# Information design

Step 10, done on the `feature/information-design` branch on 31 October 2026. OpenCode wrote the code in two phases, A for the head and the body, and B for responsive type. I checked each change in the files and in the browser before accepting it.

The head holds configuration: what the browser tab, search engines and link previews read. The body holds content: what Tee actually sees.

## The head

| # | What | Where | How I verified it |
|---|---|---|---|
| 1 | Title that changes with the page | `app/layout.tsx`: template `%s \| Tee’s Wardrobe`. `app/orders/new/layout.tsx`: title `New order` | `16a` and `16b`, plus screenshots `16` and `17` |
| 2 | Tagline under ten words | `app/page.tsx`: "Bespoke clothing, one order at a time." | 7 words. The agent said 6, so I counted myself |
| 3 | SEO tags on the marketing page only | `app/page.tsx` (home only). `/orders/new` has `noindex, nofollow` | Rendered head on both routes, below |
| 4 | A favicon I made | `public/favicon.svg`, exported from my own Figma file | Visible in the browser tab |
| 5 | Open Graph tags | `app/page.tsx` `openGraph`, image from `app/og/route.tsx` | Tags in the rendered head, and `/og` returns a 200 PNG |

### 1. The title, before and after

Before, both pages had the same static title:

```text
/            Tee’s Wardrobe — Bespoke & Ready-to-Wear Fashion
/orders/new  Tee’s Wardrobe — Bespoke & Ready-to-Wear Fashion
```

After, the home page keeps its full title and every other page fills in the template:

```text
/            Tee’s Wardrobe — Bespoke & Ready-to-Wear Fashion
/orders/new  New order | Tee’s Wardrobe
```

The order form is a client component (`"use client"`), and those can't export `metadata`. So the title lives in a small `layout.tsx` beside it, which wraps the page without changing what it shows.

With several tabs open, Tee can now see which one is the order form.

### 2. The tagline

"Bespoke clothing, one order at a time." is 7 words. It describes the business (bespoke clothing) and what this app is for (taking orders one by one). It's used as the meta description and in the Open Graph preview, and it's written once, as a `TAGLINE` constant, so the three copies can't drift apart.

The agent reported it as 6 words. A small error, but the rule is "under ten", so I counted it myself rather than trusting the report.

### 3. SEO tags, and what I decided after reading them

Before, the description, keywords and Open Graph tags were in the root layout, so **every** page had them, including the order form. I moved them to the home page only and read each one:

| Tag | Kept? | Why |
|---|---|---|
| `description` | Yes, home only | This is the snippet search engines show under the title |
| `keywords` | Yes, but low value | Google has ignored this tag for years. I kept it because it costs nothing, but I don't count it as doing any work |
| `canonical: '/'` | Yes | Tells search engines the one true address of the home page, so `/?ref=whatsapp` isn't treated as a separate page |
| `robots: noindex, nofollow` on `/orders/new` | Added | The order form is Tee's internal tool, not something a customer should find on Google |
| `metadataBase` | Added | Open Graph needs full addresses (`https://…/og`), not `/og`. It reads `NEXT_PUBLIC_SITE_URL` and falls back to `http://localhost:3000` in development |

What the rendered head shows (from `curl` against the running server):

```text
/            description, keywords, canonical, og:title, og:description, og:url,
             og:site_name, og:locale en_NG, og:image (1200×630), og:type, twitter:card
/orders/new  <title>New order | Tee’s Wardrobe</title>
             <meta name="robots" content="noindex, nofollow"/>
             (no description, no Open Graph)
```

### 4. The favicon

I designed it in Figma: a 32×32 square in the brand sea green `#32B1AA` with 6px rounded corners, and "TW" in `#191C1C`.

The letters are dark rather than white for the same reason as in Task One. White on `#32B1AA` is only 2.62:1, while `#191C1C` (my on-primary token) is 6.54:1. The letters are exported as shapes, so they look the same whatever fonts the viewer has.

### 5. Open Graph

When the home page link is shared on WhatsApp or X, these tags give a preview card (title, tagline and image) instead of a bare URL.

The image is drawn by `app/og/route.tsx` using Next.js's `ImageResponse`. That code runs outside the page, so it can't read my CSS variables. I allowed hex values there, copied from `tokens.css` (`#32b1aa`, `#f8faf8`, `#191c1c`, `#5c5f5e`). It's the one place outside the token files with hardcoded colours, and this is why.

**Not verified:** a real share preview. WhatsApp and X fetch the page from their own servers, and they can't reach `localhost`. That has to be checked after deployment, for example with a link preview debugger.

## The body: the home page

### 1. What I removed, and why

- **The "Scaffold v0.1" badge, the "Task Two Initial Scaffold" status card and the footer line "Scaffolding Phase • All styling governed by design tokens".** These were notes from the build to the builder, not information for Tee. They made the first screen about the project instead of about her orders.
- **The "← Back to home" link on the order form.** The new shared header puts the "Tee’s Wardrobe" logo on every page, and it links home. Two controls doing the same job, side by side, make the user wonder whether they do different things. This is the same reasoning as Spotter removing a label the logo already said.

### 2. The choice I collapsed

Before, the home page offered three buttons: **New order**, **Order Tracking (Planned)** and **Catalog (Planned)**. Two of them led to features that don't exist.

After, there is **one** button: **New order**.

**The growth reasoning:** the first thing Tee needs is to get an order written down. That's the whole promise in the heading. Every extra button is a decision before she gets there, and here two of the three choices were dead ends. A tool that sends you to "Planned" twice teaches you not to trust its buttons. One clear action gets her to her first saved order fastest, and an order she's saved is what makes her come back. Tracking and catalog can return as buttons once they work.

### 3. A heading that wraps where I want it to

The heading "Every order, written down once." has `max-width: 11ch` (`app/page.tsx`), so it breaks into three lines:

```text
Every order,
written down
once.
```

The shape puts "once." alone on the last line, which is the word that carries the promise (no writing the same order twice).

`ch` is the width of a "0" in the current font, so the limit grows and shrinks with the text.

- **Wrapping badly:** `18-heading-wrap-bad.png`, where the heading runs as one long line.
- **Wrapping correctly:** `19-heading-wrap-good.png`.

**What I learned capturing it:** the first time I unticked `max-width: 11ch` in DevTools, nothing changed. The page container is only 480px wide, which is already narrower than the heading would be on one line, so the container was doing the wrapping. To show the bad version I had to untick the container's max-width as well. In the shipped page both limits apply.

### 4. Buttons sized with padding

`app/globals.css`, `.btn`:

| Property | Value | Token |
|---|---|---|
| Padding | 0.5rem top and bottom × 1.5rem left and right (8px × 24px) | `--space-xs`, `--space-lg` |
| Corner radius | 8px | `--space-xs` |
| Width and height | not set | |

**Why padding, not a fixed size:** the button sizes itself around its label. If the text gets longer ("Save order", or a translation) or Tee raises her browser's font size, the button grows instead of cutting the text off. Because it's in rem, the padding grows with the font size too.

**Why 8px corners:** it comes from my spacing scale rather than being a one-off number. It's soft enough to look friendly, and still a rectangle, so it reads as a button rather than a pill-shaped tag. The input fields on the order form have the same 8px corner (`app/orders/new/page.tsx` line 91), so buttons and fields look like one family.

### 5. My label style on every button, checked by asking

The Task One **label-large** style (Inter, 14px, weight 500, line height 19.6px, letter spacing −0.56px) is set on `button, .btn` in `app/globals.css` (lines 39–45). That covers every link styled as a button and every real `<button>`, including the form's Save button.

I asked OpenCode directly, without letting it change anything:

> Which typography style does the "New order" button on the home page use? Point me to the exact file and line where that is set. Do not change anything.

Its answer:

> The "New order" button uses the Task One label-large typography style.
> - Markup: `app/page.tsx` lines 69–75 — the Link has `className="btn btn-primary"` on line 71.
> - Style rule: `app/globals.css` lines 39–45 — the combined `button, .btn` selector applies the five `--type-label-large-*` values.
> - Token values: `styles/tokens.css` lines 217–221 — 14px, weight 500, line-height 19.6px, letter-spacing -0.56px, Inter.
> `.btn-primary` only adds colour, border, and shadow; the typography comes from the `.btn` rule above.

I opened all three files and every line number matched.

### 6. Pointer cursor, hover feedback, and a logo that links home

`app/globals.css`:

- Every link (`a`) gets `cursor: pointer` and a short colour transition.
- Text links (`a:not(.btn)`) turn the focus-indicator colour and get an underline on hover.
- `.btn` has `cursor: pointer`. `.btn-primary:hover` adds a focus-indicator border and a stronger shadow, so the button visibly lifts.

The logo, "Tee’s Wardrobe" in the header (`app/layout.tsx`), is a `<Link href="/">` on every page.

### 7. Responsive type with `clamp()`

**Broken first:** at 320px wide, the 57px heading broke into five one-word lines ("Every / order, / written / down / once."), shown in `20a-heading-broken-320.png`.

**The fix**, in `app/page.tsx`:

```ts
fontSize: 'clamp(var(--type-headline-large-font-size), 10vw, var(--type-display-large-font-size))',
lineHeight: 1.4,
letterSpacing: '-0.04em',
```

| Part | Value | Meaning |
|---|---|---|
| Minimum | headline-large, 32px | never smaller than this, even on a small phone |
| Preferred | `10vw` | 10% of the screen width, so it grows smoothly |
| Maximum | display-large, 57px | reached at about 570px wide, so desktop keeps the Task One size |

**The second problem it exposed:** after the clamp, the 32px heading on a phone had huge gaps between lines and squashed letters. `.type-display-large` sets line height (79.8px) and letter spacing (−2.28px) in fixed pixels, made for 57px text, and they didn't shrink with the font. Both Task One tokens use the same ratios: 79.8 ÷ 57 = 44.8 ÷ 32 = **1.4**, and 2.28 ÷ 57 = 1.28 ÷ 32 = **0.04**. Writing them as `1.4` and `-0.04em` gives exactly the token values at both ends of the clamp, and smooth values in between.

**Working at three widths:** `20-responsive-three-widths.png`, made from `20-responsive-320.png`, `-768.png` and `-1280.png`. At 320 the heading is 32px on three lines. At 768 and 1280 it's the full 57px, still wrapping at 11ch.

## What the agent got wrong, and I caught

- It counted the 7-word tagline as 6.
- Its first plan used display-small (36px) for the heading, which wouldn't break at 320px, so there would have been nothing to fix with clamp. I changed it to display-large (57px).
- The clamp only changed the font size, leaving the line spacing in fixed pixels. I only saw it by looking at 320px; the build passed either way.
- It ran `npm run build` while my dev server was running. They share the `.next` folder, so the dev server crashed with `Cannot find module './719.js'`. I fixed it by stopping the server, deleting `.next` and restarting. It was not a code problem.

## Evidence

| File | Shows |
|---|---|
| `16a-head-before.txt`, `16b-head-after.txt` | Title on both routes, before and after |
| `16-head-route-one.png`, `17-head-route-two.png` | Rendered head on `/` and `/orders/new` |
| `18-heading-wrap-bad.png`, `19-heading-wrap-good.png` | Heading wrapping badly and correctly |
| `20a-heading-broken-320.png` | Largest text broken at 320px |
| `20-responsive-three-widths.png` | Fixed with clamp, at 320, 768 and 1280 |
| `extra-hydration-*.png` | A warning that came from browser extensions, not this code (see `defects.md` §8) |
