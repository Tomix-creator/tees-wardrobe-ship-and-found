# Known defects (Task Two)

Each one is real, checked on 30 October 2026, with where it lives and what it would cost Tee in production.

## 1. A fresh clone fails at `npm install` without a `.env` file

- **Where:** `prisma.config.ts` line 7, `datasource: { url: env("DATABASE_URL") }`, run by the `postinstall` script in `package.json`.
- **What happens:** `npm install` runs `prisma generate`, which loads the config. With no `.env`, it stops: `PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL`. I reproduced this in a temporary copy without `.env`.
- **Cost:** anyone following the README in the wrong order gets an error before the app ever starts. This is exactly what the Step 7 README test should catch.
- **Fix:** the README must say "copy `.env.example` to `.env`" *before* `npm install`. Better still, make the config not require the URL just to generate the client.

## 2. A huge price gives the wrong error

- **Where:** `app/api/orders/route.ts` lines 47–53 check that the price is a whole number above 0, but not that it fits the database column.
- **What happens:** `priceNaira` is a PostgreSQL `int4`, which stops at 2,147,483,647. A price like 99999999999 passes the check, then the database refuses it, so the user sees 500 "Could not save the order" instead of a 400 explaining the problem.
- **Cost:** a typo (an extra zero) looks like a server failure, not a mistake Tee can fix.
- **Fix:** add a maximum to the server check, and return 400.

## 3. The Task Two README still describes the agent's run, not mine

- **Where:** `README.md` lines 61–72 and 123–153: port 3001, PID 83510, a 33,918 ms cold load, and old evidence names.
- **What happens:** my evidence (recorded by hand) shows port 3000, PID 41552 and a 2,459 ms first load. The README contradicts the evidence.
- **Cost:** a README claiming things the evidence doesn't show is an automatic fail. **Must be rewritten before submission** (planned for Step 7).

## 4. Three dependency security advisories

- **Where:** `package.json` / `package-lock.json`. `npm audit` reports 1 critical (`next`) and 2 high (`postcss`, `sharp`, which come with Next.js).
- **Cost:** a deployed site could be exposed to known attacks, for example through image optimisation.
- **Why not fixed yet:** `npm audit fix` can upgrade packages in ways that break the app. I'd do it on its own branch and re-run the evidence checks.

## 5. Anyone who can reach the app can create orders

- **Where:** `app/api/orders/route.ts`. There's no login and no check of who is sending the request.
- **Cost:** on a public URL, anyone could fill Tee's order list with fake orders.
- **Fix:** authentication before deployment (later tasks).

## 6. The form trusts the server for every check

- **Where:** `app/orders/new/page.tsx`: no `required` attributes and no checks in the browser.
- **Cost:** every mistake costs a round trip to the server before Tee sees a message. It's deliberate for now (it proves the server checks work) and is Task Three's job.

## 7. Repeated code and a stray value

- **Where:** `app/api/orders/route.ts` lines 83, 99, 109 and 119 repeat the same delivery-fee error message four times. `app/orders/new/page.tsx` line 208 hardcodes `opacity: 0.7` for the disabled button instead of a token.
- **Cost:** changing the wording means editing four places, and missing one gives inconsistent messages.

## 8. Investigated: a hydration error that isn't my code

- **What I saw (31 Oct):** Next.js showed "1 Issue": *Hydration failed because the server rendered HTML didn't match the client.*
- **What I suspected:** my `<html>` tag had attributes my code never writes (`webcrx-bridged`, `data-qb-installed`, `suppresshydrationwarning`), which browser extensions such as QuillBot inject before React loads.
- **How I tested it:** I opened the same page in an Incognito window, where extensions are off. The error disappeared.
- **Evidence:** `extra-hydration-error-with-extensions.png` and `extra-hydration-clean-incognito.png`.
- **Conclusion:** caused by my browser extensions, not the app. No code change. Real users with similar extensions would see the same warning in development only; React rebuilds that part of the page, so nothing breaks.

## 9. Fixed during review (kept here for honesty)

- **Back link contrast:** the agent coloured "← Back to home" with the brand colour, 2.5:1 on the page background, which fails WCAG's 4.5:1. I changed it to the normal text colour (16.35:1) before committing.
- **Prisma version mismatch:** the scaffold had `prisma` 8 (pre-release) with `@prisma/client` 7. Both are now pinned to 7.10.1.
