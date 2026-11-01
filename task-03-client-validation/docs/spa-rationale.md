# Why sign-up, login and reset are one page

## What changed

Before, sign-up, login and password reset were three separate pages: `/signup`, `/login` and `/reset-password`. Now they are one page, `/account`, and the form shown comes from the address: `?form=signup`, `?form=login` or `?form=reset`.

- Pages in the app went from 5 to 3 (`evidence/01-page-count-before.txt`, `02-page-count-after.txt`).
- The address bar changes on each switch, but the route stays `/account` (`03-url-states.png`).
- I switched forms 12 times and the server logged nothing after the first load (`04-form-switch-logs.txt`).
- The old addresses still work. They redirect permanently to the right form (`next.config.mjs`), so an old link or bookmark doesn't break.

## Why instant switching matters for Tee's customers

A customer arrives to check their balance, tries to log in, and realises they never made an account. Or they've forgotten their password. Both are moments where they're already slightly annoyed.

**Before:** every switch was a full page request. My log earlier the same evening shows `GET /login 200 in 986ms` the first time I opened it. On my Mac's own network that's under a second. On a phone on mobile data in Lagos it would be longer, and the screen goes blank while it loads. They also had to know three addresses. I typed `/signin` and `/forgotpassword` myself while testing, and got two "not found" pages.

**After:** the form swaps instantly, with no blank screen and no request. The Back button still works, because each switch is added to the browser history. There's only one address to remember.

**Analogy:** three separate shops versus one shop with three counters. Moving between counters doesn't mean walking outside and coming back in.

## What it cost

Single-page switching isn't free. Here's what I gave up:

- **Search engines and link previews see one generic title.** The page is a client component, so per-form titles are set in the browser after it loads. Google and WhatsApp previews read the raw HTML, and see "Account | Tee's Wardrobe" for all three.
- **Every visitor downloads all three forms**, even someone who only wants to log in.
- **The switches became buttons, not links.** A screen reader says "button", and you can't right-click to open the sign-up form in a new tab.
- **The agent changed the look of "Forgot password?"** when it turned it into a button. It no longer matches the other links. This is to be fixed in Step 2.

## When separate pages would be the better choice

**Tee's order form should stay a separate page from the account forms.** `/orders/new` is for Tee only, and `/account` is for customers. They will have different permissions in Task Four. Keeping them as separate routes means:

- each can be protected on its own,
- one can never be shown by accident through a wrong `?form=` value, and
- a link to one can never land someone in the other.

Swapping forms by a query parameter is fine when everyone who sees the page is allowed to see every form. It's wrong when the forms belong to different people.

**More generally**, separate pages win when each page needs its own search result or share preview, like a shop's product pages. They also win when a page is so heavy that loading it for everyone wastes their data.
