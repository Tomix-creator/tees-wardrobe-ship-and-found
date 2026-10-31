# Tee’s Wardrobe: Task Two, scaffold and first database write

## What this is

An order book for Tee’s Wardrobe, a small bespoke clothing business, that lets Tee record a customer's order once, and must never say an order was saved when it wasn't.

## The task in four minutes

**What the task was:** scaffold a real app from my Task One design system using an AI agent, break it three ways and recover, make it write to a database, prove it can't fake a save, use Git branches and pull requests properly, and apply information design to the home page.

**What I built:** a Next.js app with one working feature, a "New order" form that saves to PostgreSQL. It shows "Order saved" only when the server replies 201 with the new row's id.

**What I decided:**
- A blank delivery fee is stored as empty, not 0, so "awaiting a quote" can't become "free delivery".
- The server checks every field, because the browser can't be trusted.
- The home page offers one button instead of three, because two of them led to features that don't exist.

**What I got wrong** is written up in [`docs/false-success.md`](docs/false-success.md), [`docs/information-design.md`](docs/information-design.md) and [`docs/defects.md`](docs/defects.md). For example:
- I typed the "stop the database" command into the busy server tab, so my first false-success test didn't test anything.
- I trusted an agent's word count.
- I let an agent run a build while my dev server was running, which crashed it.

## Status

| | |
|---|---|
| **Finished** | Scaffold from the Task One tokens (Steps 1–3). Server start and first load measured (Step 4). Three breakages recovered (Step 5). Order form saving to PostgreSQL, with the false success disproved (Step 6). Hand-drawn working tree (Step 8). Three branches merged through pull requests, plus one deleted unmerged (Step 9). Information design and responsive heading (Step 10) |
| **Half done** | This README has been rewritten to match my evidence, and I rehearsed the setup steps from a fresh clone, but it **hasn't yet been tested on another person** (Step 7). The result will go in `docs/readme-test.md` |
| **Not started** | Viewing, editing or deleting orders. Logins. Deployment. Those belong to later tasks |

Pull requests: [#1 order form](https://github.com/Tomix-creator/tees-wardrobe-ship-and-found/pull/1) · [#2 working tree](https://github.com/Tomix-creator/tees-wardrobe-ship-and-found/pull/2) · [#3 information design](https://github.com/Tomix-creator/tees-wardrobe-ship-and-found/pull/3)

## The stack, with reasons

| Choice | Why this, rather than the alternative |
|---|---|
| **Next.js 15 (App Router) + React 19** | The form page and the API that saves it live in one project. The agent's first plan offered an Express server or a plain static server ([`evidence/01-agent-plan.txt`](evidence/01-agent-plan.txt)). A static server can't save anything to a database, and Express would have meant building and connecting two projects myself |
| **TypeScript** | With Prisma's generated types, a wrong field name (`price` instead of `priceNaira`) fails before the code runs, instead of in front of Tee |
| **PostgreSQL 17** | A database server that refuses bad data by itself (a missing name, a price too big for its column). SQLite would be simpler to set up, but it's a single file and is far more forgiving about types. PostgreSQL is what a deployed version would run on |
| **Prisma 7.10.1** | Builds the table from a short schema file and keeps a history of changes as migrations. Both Prisma packages are pinned to the same version, because the scaffold shipped them mismatched (8 pre-release vs 7) |
| **CSS variables from Task One** | Colour, type and spacing come from `styles/tokens.css` and `styles/spacing.css`. These are copies of the Task One files, and `npm run build` refuses to run if they drift ([`scripts/check-tokens.js`](scripts/check-tokens.js)). A UI library would have brought its own design instead of mine |

## Getting started

Tested from a fresh clone on 31 October 2026 (macOS, Node 22.23.1, npm 10.9.8, PostgreSQL 17.11 from Homebrew).

**You need:** [Node.js](https://nodejs.org) 18.18 or newer, Git, and PostgreSQL. On a Mac with [Homebrew](https://brew.sh):

```bash
brew install postgresql@17
```

**1. Get the code and go into the Task Two folder**

```bash
git clone https://github.com/Tomix-creator/tees-wardrobe-ship-and-found.git
```
```bash
cd tees-wardrobe-ship-and-found/task-02-repository-and-scaffold
```

Every command below runs from this folder. If you're in the wrong folder, `npm` says it can't find `package.json` (see [`docs/nested-folder.md`](docs/nested-folder.md)).

**2. Start PostgreSQL and create the database**

```bash
brew services start postgresql@17
```
```bash
createdb tees_wardrobe
```

**3. Create your `.env` file. Do this before `npm install`**

```bash
cp .env.example .env
```

Open `.env` and replace `USER` with your Mac username (type `whoami` in the terminal to see it). Or do both in one go:

```bash
sed -i '' "s/USER/$(whoami)/" .env
```

`npm install` reads this file. Without it, the install stops with `Cannot resolve environment variable: DATABASE_URL`.

**4. Install, and create the table**

```bash
npm install
```
```bash
npx prisma migrate deploy
```

`npm install` may report security advisories. They're known and listed under Known defects. Don't run `npm audit fix`, because it can upgrade packages in ways that break the app.

The migrate step should finish with `All migrations have been successfully applied.`

**5. Run it**

```bash
npm run dev
```

Open http://localhost:3000, click **New order**, and save one. The page should say **Order saved (#1)**.

**6. Check it really saved.** Don't trust the screen. In a second terminal tab, from the same folder:

```bash
psql tees_wardrobe -c 'SELECT id, "customerName", "createdAt" FROM "Order";'
```

Your order should be there, with the time you clicked Save.

**If port 3000 is busy** (`EADDRINUSE`): find what's using it with `lsof -nP -iTCP:3000 -sTCP:LISTEN`, then stop it if it's yours (see [`evidence/07-port-conflict.txt`](evidence/07-port-conflict.txt) and [`evidence/08-port-conflict-resolved.txt`](evidence/08-port-conflict-resolved.txt)).

## Environment variables

| Name | Required | What it's for |
|---|---|---|
| `DATABASE_URL` | Yes | How the app and Prisma reach PostgreSQL: user, host, port and database name. Also read by `npm install`, because it generates the database client |
| `NEXT_PUBLIC_SITE_URL` | No | The site's public address, used to build full links for social-media previews. Defaults to `http://localhost:3000` |

The real values live only in `.env`, which Git ignores. [`.env.example`](.env.example) shows the shape with a placeholder.

## What this deliberately does not do

- **No logins.** Anyone who can reach the app can add orders. That's acceptable on my own Mac, not on the internet. Authentication comes in a later task.
- **No list, edit or delete of orders.** Step 6 asked for one proven write. Reading the orders back is in `psql`, on purpose, so the evidence is the database rather than the screen.
- **No checks in the browser.** Every rule is checked by the server, which proves the server checks work. Browser-side checks are Task Three.
- **No order tracking or catalog.** They were on the scaffold's home page as "Planned" buttons. I removed them, because buttons that lead nowhere teach Tee not to trust the app.
- **Not deployed.** It runs on `localhost` only, so link previews couldn't be tested.

## Known defects

All of these are real and were checked on my machine. Full details are in [`docs/defects.md`](docs/defects.md).

1. **A huge price gives the wrong error.** `app/api/orders/route.ts` lines 47–53 check that the price is a whole number above 0, but not that it fits the database column (maximum 2,147,483,647). `99999999999` gets a 500 "Could not save the order" instead of a 400 explaining the problem.
2. **Three dependency advisories.** `npm audit` reports 1 critical (`next`) and 2 high (`postcss`, `sharp`). They're not fixed because `npm audit fix` can break the app; I'd do it on its own branch and re-run the evidence.
3. **No authentication.** See `app/api/orders/route.ts`, and "What this deliberately does not do" above.
4. **The form has no browser-side checks.** In `app/orders/new/page.tsx`, every mistake costs a round trip to the server.
5. **Repeated code.** The delivery-fee error message is repeated four times in `app/api/orders/route.ts` (lines 83, 99, 109, 119), and `app/orders/new/page.tsx` hardcodes `opacity: 0.7` for the disabled button.
6. **`npm install` needs `.env` first.** `prisma.config.ts` line 7 requires `DATABASE_URL` just to generate the client. The steps above work around it by creating `.env` first. A better fix is to make the config not require it.

## Where the evidence is

| Step | Write-up | Evidence |
|---|---|---|
| 1–3 Scaffold and models | [`scaffold-prompt.md`](docs/scaffold-prompt.md), [`model-choices.md`](docs/model-choices.md) | `01`, `01b`, `02` |
| 4 First load | [`performance-note.md`](docs/performance-note.md) | `03`, `04`: port 3000, first load 2,459 ms, reload 60 ms |
| 5 Three breakages | [`nested-folder.md`](docs/nested-folder.md), [`404-diagnosis.md`](docs/404-diagnosis.md) | `05`–`10`: wrong folder (ENOENT), port 3000 in use by PID 41552, 404 after renaming `page.tsx` |
| 6 Database and false success | [`false-success.md`](docs/false-success.md) | `11`–`13c` |
| 7 README test | `readme-test.md` (to do) | |
| 8 Working tree | [`working-tree.md`](docs/working-tree.md) | `14` |
| 9 Branches | (PR links above) | `15b`, and `15` after the final merge |
| 10 Information design | [`information-design.md`](docs/information-design.md) | `16`–`20` |
| Interview | [`interview-answers.md`](docs/interview-answers.md) | |

`evidence/agent-run/` holds the agent's own first attempt at Steps 3–5, on the same Mac. I kept it to show what it claimed, but the numbers I stand behind are the ones I recorded myself, in the main `evidence/` folder.
