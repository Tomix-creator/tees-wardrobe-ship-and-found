# Tee's Wardrobe

## What this is

An order-tracking app being built for Tee's Wardrobe, a one-person clothing business in Nigeria, so the owner will always know the correct balance on every order: agreed price minus confirmed payments, with delivery shown as "awaiting quote" until it's agreed.

This is my submission for the Ship & Found five-task assessment. I chose **one repository with five top-level folders**, one per task.

## Status

| Task | Folder | State |
|---|---|---|
| 1. Design system | [`task-01-design-system/`](task-01-design-system/) | **Finished.** Figma design system, token export, JSON-to-CSS converter, one demo screen, all required evidence. Interview answers written; viva not yet done. |
| 2. Scaffold and repository | [`task-02-repository-and-scaffold/`](task-02-repository-and-scaffold/) | **Finished.** Next.js app scaffolded from the Task One tokens. Three breakages recovered. A "New order" form that saves to PostgreSQL and only says "saved" on a real 201, with the false success disproved. Three pull requests merged. Information design and a responsive heading. The README test on a real person found three problems in my setup steps, now fixed; the tester was then blocked by their internet connection. Interview answers written; viva not yet done. |
| 3. Client validation | [`task-03-client-validation/`](task-03-client-validation/) | **Finished, with known gaps.** Sign-up, login and reset collapsed into one page. Validation rules from Tee's business, each with who it wrongly blocks. A VoiceOver audit with before and after transcripts. A direct `curl` request the server accepted (201). Rollback by commit ID. Gaps: the server still accepts anything (Task Four), the terms page is a placeholder. Interview answers written; viva not yet done. |
| 4. Server security | not created | Not started |
| 5. Sessions and compliance | not created | Not started |

The Task One screen is a demonstration with fictional data. It doesn't save anything. The Task Two order form does save, to a local PostgreSQL database. It isn't deployed.

## The stack, with reasons

| Choice | Why this, rather than the alternative |
|---|---|
| **Figma variables + Material Theme Builder** | The design system lives in one place designers already use, and exports as JSON. The alternative, writing colours straight into CSS, would leave no single source both design and code agree on. |
| **A small Node script to convert tokens** (`task-01-design-system/scripts/convert-tokens.js`) | It keeps colour roles pointing at palette colours instead of copying hex values. A ready-made tool like Style Dictionary was the alternative, but my Figma export has stray spaces inside its colour references that a tool doing exact lookups wouldn't resolve, and my own script lets me handle and test that (see Task One defects). |
| **Next.js 15 with TypeScript** | One framework for both pages and server routes, so the form and the code that saves it live together. The alternative, a separate React app plus an Express server, doubles the setup for a one-person business. TypeScript catches wrong field names before they reach the database. |
| **Prisma 7 + PostgreSQL 17** | Prisma gives typed queries and migrations I run by hand. PostgreSQL refuses bad data itself, like a missing name or a number too big for its column. SQLite would be simpler, but it's a single file and far more forgiving about types. Prices are stored as whole naira (integers), so there's no rounding. |
| **Plain HTML for the Task One screen** | Task One only had to prove the design system was used, so I kept it free of framework code. |

## Getting started

**The app (Task Two)** needs Node.js, Git and PostgreSQL, and a `.env` file created *before* `npm install`. The exact steps, from a fresh clone to a saved order, are in the [Task Two README](task-02-repository-and-scaffold/README.md#getting-started). I keep them in one place so they can't drift apart.

To see the Task One demo screen instead, from the repository root:

```bash
python3 -m http.server 8085 --directory task-01-design-system
```

Then open http://localhost:8085.

## Environment variables

Task Two uses these, in a `.env` file inside `task-02-repository-and-scaffold/`:

| Name | Required | What it's for |
|---|---|---|
| `DATABASE_URL` | Yes | Address and login for the PostgreSQL database. Also read by `npm install` |
| `NEXT_PUBLIC_SITE_URL` | No | The public address used in link previews. Defaults to `http://localhost:3000` |

`.env` files are ignored by Git and must never be committed. [`task-02-repository-and-scaffold/.env.example`](task-02-repository-and-scaffold/.env.example) shows the shape with a placeholder.

## What this deliberately does not do

- **Take payments or connect to a bank.** Tee confirms transfers in her bank app herself; an integration would cost money and add risk a one-person business doesn't need yet.
- **Automatic cancellations or refunds.** Tee decides these case by case and has no fixed rule, so there is nothing to automate.
- **Customer accounts, yet.** Sign-in and sessions come in Tasks Four and Five. No customer has been interviewed about wanting them.
- **Dark mode.** The palette supports it, but the role mapping hasn't been designed or contrast-checked.

## Known defects

- **Shadows don't follow a brand colour change**: their colour is stored as fixed values. `task-01-design-system/css/tokens.css:149–151`
- **The Task One screen ignores the spacing tokens**: 54 hand-typed pixel values. `task-01-design-system/index.html:27`
- **The Figma export's colour references contain a stray space**, which only my converter handles. `task-01-design-system/evidence/06-tokens-complete.json:1927–2047`
- **A huge order price gives a 500 instead of a clear 400**: the server checks that it's a whole number above 0, but not that it fits the database column. `task-02-repository-and-scaffold/app/api/orders/route.ts:47–53`
- **No login on the order form**: anyone who can reach the app can add orders. Fine on my Mac, not on the internet. `task-02-repository-and-scaffold/app/api/orders/route.ts`
- **Three dependency advisories** (1 critical, 2 high), not yet fixed because `npm audit fix` can break the app. `task-02-repository-and-scaffold/package.json`

Full lists: [Task One defects](task-01-design-system/docs/defects.md) · [Task Two defects](task-02-repository-and-scaffold/docs/defects.md).
