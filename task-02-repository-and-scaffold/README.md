# Tee’s Wardrobe — Task Two Application Scaffold

Initial application scaffold for **Tee’s Wardrobe**, built with **Next.js 15** (v15.3.9), **React 19** (v19.0.0), and **TypeScript** (v5.4.5) using the Next.js App Router architecture on Node.js v22.

---

## 1. Scope & Purpose

This repository scaffold implements the foundational client frame and minimal home screen for Tee’s Wardrobe. Per the scaffolding phase requirements:
- **Included**: Next.js App Router setup, TypeScript configuration, design token integration, harmonic spacing scale, accessible minimal home screen shell, and automated token parity verification.
- **Intentionally Deferred**: Database persistence (Prisma ORM, PostgreSQL), order submission forms, inventory management, customer measurements database, and authentication / role-based access control (RBAC). Note: `package.json` already lists `prisma` and `@prisma/client`, at mismatched versions (8 pre-release vs 7); nothing uses them yet, and they get fixed in Step 6.
- **Home Screen Controls**: All feature entrypoint buttons (Order Tracking, Catalog) are explicitly labeled as planned features and rendered in a disabled state. No active database or form submission logic is present in this scaffold.

---

## 2. Design System Integration & Token Management

Colours, type and spacing come from the Tee’s Wardrobe design system's CSS variables: there are no hex colours in `app/`. A few pixel values remain: 1px borders, the 2px focus outline and its offset, and a 480px maximum width in `app/globals.css:78`.

### Design Tokens & Shadow Names
- Colors and typography are loaded from the Task One design token stylesheet (`tokens.css`).
- Shadows use the exact token values and names from the Task One CSS:
  - `--shadow-soft`: `0px 2px 8px 0px #0d2c2b1f`
  - `--shadow-medium`: `0px 6px 16px 0px #0d2c2b29`
  - `--shadow-hard`: `0px 10px 16px 0px #0d2c2b3d`
- Associated utility classes `.shadow-soft`, `.shadow-medium`, and `.shadow-hard` are provided.

### Spacing Scale
Because Task One had no spacing tokens, an 8-step harmonic spacing scale rooted in a 4px/8px modular grid was introduced at `task-01-design-system/css/spacing.css` and documented in `task-01-design-system/docs/spacing.md`:
- `--space-3xs`: `0.125rem` (2px) — hairline borders, fine indicators
- `--space-2xs`: `0.25rem` (4px) — badge padding, tight element gaps
- `--space-xs`: `0.5rem` (8px) — base grid unit, icon gaps, compact button padding
- `--space-sm`: `0.75rem` (12px) — intermediate element separation
- `--space-md`: `1rem` (16px) — standard card padding, component margins
- `--space-lg`: `1.5rem` (24px) — section headers, major card padding
- `--space-xl`: `2rem` (32px) — page section gaps, header offsets
- `--space-2xl`: `3rem` (48px) — bottom page gutter, container separation

### Token Synchronization & Parity Enforcement
Next.js CSS bundlers require stylesheets imported by `@import` in `globals.css` to reside within the application module tree (`styles/`). To maintain the Task One stylesheets as the single source of truth without relying on brittle relative paths across directories:
1. `styles/tokens.css` and `styles/spacing.css` are tracked copies synchronized directly from `../task-01-design-system/css/`.
2. **`npm run sync:tokens`** (`scripts/sync-tokens.js`): Copies `tokens.css` and `spacing.css` from `task-01-design-system/css/` to `styles/`.
3. **`npm run check:tokens`** (`scripts/check-tokens.js`): Computes cryptographic SHA-256 hashes of both source files and local copies. It asserts identical checksums and fails with exit code 1 if any drift occurs.
4. **Automated Build Check**: `npm run build` runs `prebuild` which automatically executes `node scripts/check-tokens.js`. If token copies ever drift from the canonical Task One stylesheets, the build aborts immediately.


---

## 3. Project Structure

```
task-02-repository-and-scaffold/
├── app/
│   ├── globals.css         # Global CSS importing tokens.css and spacing.css, reset & buttons
│   ├── layout.tsx          # Root Next.js layout, SEO metadata, viewport, OpenGraph
│   └── page.tsx            # Minimal home screen shell consuming design system tokens
├── docs/
│   ├── performance-note.md # Step 4 analysis of cold vs warm load, JIT compilation, and gaps
│   └── scaffold-prompt.md  # Step 3 prompt engineering record (original draft, revised, rationale)
├── evidence/
│   ├── 01-agent-plan.txt           # Pre-approval initial plan (proposed Node.js/Express or static server)
│   ├── 01-agent-plan-revised.txt   # Pre-approval revised plan (aligned to Next.js with TypeScript)
│   ├── 02-files-created.txt        # Comprehensive audit log of created files & assumptions
│   ├── 03-server-startup.txt       # Initial server build, token parity verification & port 3000 startup
│   ├── 03-server-start.txt         # Dev server startup log on port 3000 (Ready in 10.9s)
│   ├── 04-first-load.txt           # First cold load (33.9s) vs warm load (268ms) latency log
│   ├── 05-nested-folder-error.txt  # Step 5.1 diagnostic: ENOENT error when run from parent folder
│   ├── 06-nested-folder-fixed.txt  # Step 5.1 recovery: cd into app vs root assembly demonstration
│   ├── 07-port-conflict.txt        # Step 5.2 diagnostic: EADDRINUSE on test port 3001 (PID 83510)
│   ├── 08-port-conflict-resolved.txt# Step 5.2 recovery: process termination & clean restart
│   ├── 09-404-error.txt            # Step 5.3 diagnostic: App Router 404 error log & latency on port 3002
│   └── 10-404-resolved.txt         # Step 5.3 recovery: restoration of app/page.tsx & hot-reload verification
├── public/
│   └── favicon.svg         # Brand SVG icon (Sea Green #32B1AA)
├── scripts/
│   ├── check-tokens.js     # Automated SHA-256 parity verification script
│   └── sync-tokens.js      # Repeatable token synchronization script
├── styles/
│   ├── spacing.css         # Synced copy of Task One spacing scale
│   └── tokens.css          # Synced copy of Task One design tokens
├── next.config.mjs         # Next.js configuration
├── package.json            # Node package manifest and scripts
├── README.md               # Scaffold documentation
└── tsconfig.json           # TypeScript configuration with @/* alias
```

---

## 4. Getting Started

### Prerequisites
- Node.js >= 18.18.0 (tested on Node v22.23.1)
- npm >= 9.0.0

### Installation & Verification
```bash
# 1. Install dependencies
npm install

# 2. Verify design token parity against Task One source of truth
npm run check:tokens

# 3. Start local development server (port 3000)
npm run dev

# 4. Create production build
npm run build
```

---

## 5. Planning & Prompt Documentation

- **Initial Scaffolding Plan (`evidence/01-agent-plan.txt`)**:
  The agent originally drafted a plan proposing a lightweight Node.js/Express server or a pure static dev server (`server.js` and `public/index.html`), noting that static live servers could not handle dynamic database writes later.
- **Revised Plan (`evidence/01-agent-plan-revised.txt`)**:
  Upon user direction, the agent aligned the stack with Next.js 15 App Router and TypeScript 5, while locking design system parity and preserving non-negotiable calculation rules.
- **Prompt Refinement (`docs/scaffold-prompt.md`)**:
  Documents the human author's original draft verbatim, the tightened prompt dispatched to the agent, and the prompt engineering rationale (structural segmentation, technical phrasing, gating execution on plan approval).

---

## 6. Performance Instrumentation & Qualifications (Step 4)

Initial page load measurements for `http://localhost:3000/` were captured directly using `curl` and server logs (`evidence/04-first-load.txt` and `docs/performance-note.md`):

- **Cold Load**: Total elapsed time of **`33,918.81 ms`** (TTFB `33,871.70 ms`). The Next.js console verified that **29.5 seconds** was spent on on-demand Just-In-Time (JIT) compilation of 671 modules upon the first incoming request (`✓ Compiled / in 29.5s (671 modules)`).
- **Warm Load**: Total elapsed time of **`268.26 ms`** (TTFB `255.82 ms`), serving pre-compiled in-memory modules (~126x faster than cold load).
- **Honest Qualifications**:
  1. *Production Differences*: Production builds compile ahead-of-time before deployment, eliminating development JIT compilation overhead during request handling. However, we cannot claim that production will eliminate *exactly* 29.5 seconds, as production bundling, minification, tree-shaking, and server execution environments have different performance dynamics.
  2. *Hardware Attribution*: No system profiler, disk I/O benchmark, or CPU tracing tool was attached. Any attribution of latency to specific local hardware bottlenecks is an unverified assumption.
  3. *Server Rendering Gap*: An unexplained difference of ~3,006 ms exists between the logged 29.5s compilation and the 32,506 ms server processing time. Attributing this specific duration to server-side HTML rendering is an unmeasured hypothesis, not a proven fact.

---

## 7. Diagnostic Breakages & Recoveries (Step 5)

Step 5 diagnostics were executed in disposable environments to preserve the production project and running servers:

### 5.1 Nested Folder / Wrong Directory
- **Failure**: Running `npm run dev` from an outer directory lacking `package.json` produced an immediate `ENOENT` failure (`evidence/05-nested-folder-error.txt`).
- **Recovery 1**: Navigating into the application directory (`cd disposable-nested-test/nested-app`) and starting the server on port 3001 compiled and served HTTP 200 OK (`evidence/06-nested-folder-fixed.txt`).
- **Recovery 2**: Demonstrating that files residing at root `./` resolve the directory problem, compiling and serving HTTP 200 OK cleanly.
- **Qualification of Proof**: Recovery 2 was demonstrated in a disposable test folder by copying verified project files and symlinking `node_modules` from `task-02-repository-and-scaffold/`. It demonstrated directory resolution at `./`; it did not execute an autonomous agent CLI rescaffold from scratch. Furthermore, `npm test` was not run because `package.json` does not define a test script.

### 5.2 Port Collision (`EADDRINUSE`)
- **Failure**: Starting a Next.js server on occupied port 3001 triggered an `EADDRINUSE` collision (`evidence/07-port-conflict.txt`).
- **Investigation**: Executed `lsof -nP -iTCP:3001 -sTCP:LISTEN` to identify the conflicting process (PID 83510).
- **Recovery**: Selectively stopped PID 83510 with `kill 83510`, verified port release, and cleanly started Next.js on port 3001 (`evidence/08-port-conflict-resolved.txt`). The live application on port 3000 remained untouched.

### 5.3 404 Routing Failure
- **Failure**: Removing leaf route segment `app/page.tsx` produced a clean Next.js 404 Not Found response (`evidence/09-404-error.txt`).
- **Recovery**: Restoring `app/page.tsx` triggered hot-recompilation in 266ms, restoring HTTP 200 OK (`evidence/10-404-resolved.txt`).

---

## 8. What is Still Unfinished (Steps 6–10)

The following Task Two assessment items remain open:
1. **Step 6: Database Integration**: Implementing Prisma ORM, configuring PostgreSQL credentials (kept out of Git via `.env`), schema migrations, and a database write entry form.
2. **Step 7: External Tested README**: Running setup instructions cleanly from scratch on a clean environment.
3. **Step 8: Information Architecture Tree**: Creating a hand-drawn or diagrammed visual navigation tree (`docs/tree.png` or `docs/tree.pdf`).
4. **Step 9: Git Branching & Pull Request**: Creating a Git feature branch, committing changes, pushing, and documenting pull request review.
5. **Step 10: Information Design Evidence & Viva Answers**: Mobile viewport screenshots (`evidence/11-mobile-view.png`, `evidence/12-desktop-view.png`, `evidence/13-focus-visible.png`) and drafting the 15 viva assessment answers (`docs/viva-answers.md`).

