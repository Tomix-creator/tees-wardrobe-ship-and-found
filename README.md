# Tee's Wardrobe

## What this is

An order-tracking app for Tee's Wardrobe, a one-person clothing business in Nigeria, so the owner always knows the correct balance on every order: agreed price minus confirmed payments, with delivery shown as "awaiting quote" until it's agreed.

This is my submission for the Ship & Found five-task assessment. I chose **one repository with five top-level folders**, one per task.

## Status

| Task | Folder | State |
|---|---|---|
| 1. Design system | [`task-01-design-system/`](task-01-design-system/) | **Finished.** Figma design system, token export, JSON-to-CSS converter, one demo screen, all required evidence. Interview answers written; viva not yet done. |
| 2. Scaffold and repository | [`task-02-repository-and-scaffold/`](task-02-repository-and-scaffold/) | **Half done.** Next.js app scaffolded with a home screen; server-start, nested-folder, port-conflict and 404 evidence captured. **No database yet**: the order form that saves to a database is not built. |
| 3. Client validation | not created | Not started |
| 4. Server security | not created | Not started |
| 5. Sessions and compliance | not created | Not started |

The Task One screen is a demonstration with fictional data. It doesn't save anything.

## The stack, with reasons

| Choice | Why this, rather than the alternative |
|---|---|
| **Figma variables + Material Theme Builder** | The design system lives in one place designers already use, and exports as JSON. The alternative, writing colours straight into CSS, would leave no single source both design and code agree on. |
| **A small Node script to convert tokens** (`task-01-design-system/scripts/convert-tokens.js`) | It keeps colour roles pointing at palette colours instead of copying hex values. A ready-made tool like Style Dictionary was the alternative, but my Figma export has stray spaces inside its colour references that a tool doing exact lookups wouldn't resolve, and my own script lets me handle and test that (see Task One defects). |
| **Next.js 15 with TypeScript** | One framework for both pages and server routes, so the form and the code that saves it live together. The alternative, a separate React app plus an Express server, doubles the setup for a one-person business. TypeScript catches wrong field names before they reach the database. |
| **Prisma + PostgreSQL** (planned, not connected) | The stack taught in class. Prisma gives typed queries and migrations I run by hand; PostgreSQL handles money with exact decimals. |
| **Plain HTML for the Task One screen** | Task One only had to prove the design system was used, so I kept it free of framework code. |

## Getting started

You need [Node.js](https://nodejs.org/) 22 or newer, and Git.

```bash
git clone https://github.com/Tomix-creator/tees-wardrobe-ship-and-found.git
```

```bash
cd tees-wardrobe-ship-and-found/task-02-repository-and-scaffold
```

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. Stop the server with **Ctrl + C**.

To see the Task One demo screen instead, from the repository root:

```bash
python3 -m http.server 8085 --directory task-01-design-system
```

Then open http://localhost:8085.

## Environment variables

None are needed yet.

When the Task Two database form is built, it will need:

| Name | What it's for |
|---|---|
| `DATABASE_URL` | Address and login for the PostgreSQL database |

Put it in a `.env` file inside `task-02-repository-and-scaffold/`. `.env` files are ignored by Git and must never be committed.

## What this deliberately does not do

- **Take payments or connect to a bank.** Tee confirms transfers in her bank app herself; an integration would cost money and add risk a one-person business doesn't need yet.
- **Automatic cancellations or refunds.** Tee decides these case by case and has no fixed rule, so there is nothing to automate.
- **Customer accounts, yet.** Sign-in and sessions come in Tasks Four and Five. No customer has been interviewed about wanting them.
- **Dark mode.** The palette supports it, but the role mapping hasn't been designed or contrast-checked.

## Known defects

- **Shadows don't follow a brand colour change**: their colour is stored as fixed values. `task-01-design-system/css/tokens.css:149–151`
- **The Task One screen ignores the spacing tokens**: 54 hand-typed pixel values. `task-01-design-system/index.html:27`
- **The Figma export's colour references contain a stray space**, which only my converter handles. `task-01-design-system/evidence/06-tokens-complete.json:1927–2047`
- **Mismatched Prisma versions**: `prisma` is a version 8 pre-release and `@prisma/client` is version 7, and the two are meant to match. `task-02-repository-and-scaffold/package.json`

Full lists: [Task One defects](task-01-design-system/docs/defects.md).
