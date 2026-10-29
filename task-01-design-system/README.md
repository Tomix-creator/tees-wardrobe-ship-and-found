# Tee’s Wardrobe — Task One: Design System & Prototype

This directory contains the Task One deliverables for **Tee’s Wardrobe**, implementing a token-driven design system, an automated token compilation pipeline, and a mobile-first order-tracking demonstration prototype.

> **Demonstration Disclaimer**:  
> The screen in this directory (`index.html`) is an order-tracking **demonstration prototype** designed to test token styling, responsive mobile layout (412px), and business-logic presentation. It **does not save real orders, record payments, or connect to a live backend database**. All customer records and transactions displayed are fictional demonstration data.

---

## 1. What Was Built

1. **Design Token Source & Converter**:
   - Source Token File: [`evidence/06-tokens-complete.json`](evidence/06-tokens-complete.json), exporting 94 primitive colors, 9 semantic color roles, 15 typography styles, and 3 elevation shadow effects.
   - Token Compilation Script: [`scripts/convert-tokens.js`](scripts/convert-tokens.js), converting Figma Design Tokens JSON into standardized CSS custom properties in [`css/tokens.css`](css/tokens.css).
   - Automated Token Verification Suite: [`scripts/verify-tokens.js`](scripts/verify-tokens.js), running 112 automated integrity tests against generated CSS to ensure complete coverage, alias resolution, and safe execution.
2. **Order Demonstration Prototype (`index.html`)**:
   - Mobile-first interface built for 412px viewport width.
   - Strictly applies semantic color roles (`--color-role-*`) and typography utility classes (`.type-*`).
   - Implements dynamic order switching between two fictional customer orders (`orderA` and `orderB`).
   - Features visible focus indicators, accessible contrast boundaries, and an unstyled-vs-styled evidence record.

---

## 2. How to View the Demonstration

1. **Start the Local HTTP Server**:
   From the repository root, run:
   ```bash
   python3 -m http.server 8085 --directory "task-01-design-system"
   ```
2. **Open in Browser**:
   Navigate to:
   ```text
   http://localhost:8085
   ```
   *(Or open `task-01-design-system/index.html` directly in any modern web browser).*
3. **Viewport Inspection**:
   - Set browser device emulation to **412 px** width (e.g., Pixel 7 / Samsung Galaxy mobile viewport).
   - Verify that horizontal scrolling is absent and that content containers adapt cleanly.
4. **Interactive Verification**:
   - **Order Toggle**: Use the select dropdown at the top to toggle between Order `#TW-2026-084` (Amina Bello) and `#TW-2026-085` (Fatima Garba). Observe that all pricing figures, balance calculations, delivery quoting notes, and customer policy answers update dynamically.
   - **Keyboard Navigation**: Press <kbd>Tab</kbd> to verify visible focus outlines (`--color-role-focus-indicator`, 10.64:1 contrast ratio against Surface) on the order selector and interactive elements.

---

## 3. Key Design Decisions

- **Brand Anchor & Primary Palette**:
  - The business owner supplied sea green as the brand color; the reference swatch was sampled as sRGB `#32B1AA`.
  - Pinned as `primary/40` so that tonal palettes generated symmetrically without shifting the brand hue.
- **Strict Separation of Clothing Price and Delivery Fees**:
  - Clothing price and delivery fee are calculated separately. An unquoted delivery fee is visibly marked **“not yet quoted” / “awaiting quote”** and is **never** treated or displayed as free or zero (₦0.00).
- **Core Remaining Balance Formula**:
  $$\text{Remaining Balance} = \text{Agreed Clothing Price} - \text{Confirmed Payments}$$
  *(Delivery fee is added to the balance only after a formal destination quote is agreed).*
- **Typography Scale**:
  - Uses the **Inter** family across all 15 Material-structured styles with compact -4% letter spacing.
  - Line heights use deliberate role-based multipliers: a $1.4\times$ multiplier for Display, Headline, Title, and Label styles; $1.5\times$ for Body Large ($24\text{px}$ on $16\text{px}$ font); and $1.6\times$ for Body Medium ($22.4\text{px}$ on $14\text{px}$) and Body Small ($19.2\text{px}$ on $12\text{px}$) to provide necessary reading room for multi-line customer details.
- **Brand-Tinted Elevation Shadows**:
  - Drop shadows are tinted with dark brand hue `#0D2C2B` (`primary/10`, 12%–24% opacity) rather than neutral black, with custom geometry: Soft ($Y=2\text{px}$, Blur = $8\text{px}$), Medium ($Y=6\text{px}$, Blur = $16\text{px}$), and Hard ($Y=10\text{px}$, Blur = $16\text{px}$).
- **Role-Based Token Architecture**:
  - UI code references semantic roles only (e.g. `--color-role-surface`, `--color-role-primary`); primitive palette values are never hardcoded in page styles.

---

## 4. What Is Unfinished / Open Work

The following items represent open tasks or items requiring final review:
1. **Deliberate Regression Branch Experiment (Step 8)**:
   - The isolated branch `experiment/deliberate-token-regression` was created to demonstrate broken token referencing, committed, visual evidence captured, and deleted without merge.
   - Visual captures ([`evidence/11-broken-referencing.png`](evidence/11-broken-referencing.png), [`evidence/11-broken-referencing-fullwidth.png`](evidence/11-broken-referencing-fullwidth.png)) and the explanatory note ([`evidence/11-broken-referencing-explanation.txt`](evidence/11-broken-referencing-explanation.txt)) are present in the repository, alongside the Git audit log ([`evidence/12-git-log-branch-unmerged.txt`](evidence/12-git-log-branch-unmerged.txt)). These files are present in the repository, but their contents remain subject to final user evaluation.
2. **Viva Interview Defence Answers**:
   - [`docs/interview-answers.md`](docs/interview-answers.md) contains substantive answers ($\le 200$ words each) to all 12 viva questions from pages 8–9 of the assessment PDF. The file is present, but answers are marked unverified pending final review.
3. **Dark Mode Role Mappings**:
   - Dark theme semantic role mappings remain open in [`docs/colour-roles.md`](docs/colour-roles.md).
4. **Optional Walkthrough Video**:
   - `evidence/13-walkthrough.mp4` (4-minute voice-recorded type scale justification) remains optional and not recorded.

---

## 5. Location of Evidence and Known Defects

- **Evidence Files**: Located in [`task-01-design-system/evidence/`](evidence/), numbered sequentially from `01` to `12`, accompanied by supporting audit files (`support-*`).
- **Known Defects**: Fully documented with substantiation and impact analysis in [`task-01-design-system/docs/defects.md`](docs/defects.md).

---

## 6. Task One Deliverables Status Checklist

*Evaluated against the Task One Deliverables specification in `Ship-and-Found-Five-Tasks.pdf` (Page 8).*

| Deliverable | Status | Cited File Path |
|---|---|---|
| `README.md` | **Present, unverified** | [`task-01-design-system/README.md`](README.md) (Project overview documentation) |
| `docs/business-brief.md` | **Present, unverified** | [`task-01-design-system/docs/business-brief.md`](docs/business-brief.md) (384 words; meets $\le 400$ word limit; user context explicitly identifies assumptions) |
| `docs/type-scale.md` | **Present, unverified** | [`task-01-design-system/docs/type-scale.md`](docs/type-scale.md) (All 15 styles documented; needs verification against runtime styles) |
| `docs/colour-roles.md` | **Present, unverified** | [`task-01-design-system/docs/colour-roles.md`](docs/colour-roles.md) (Light roles & contrast documented; dark mode mapping marked open) |
| `docs/shadows.md` | **Present, unverified** | [`task-01-design-system/docs/shadows.md`](docs/shadows.md) (Soft, medium, hard shadows documented) |
| `docs/divergences.md` | **Present, unverified** | [`task-01-design-system/docs/divergences.md`](docs/divergences.md) (Documented divergences and failure scenarios) |
| `docs/prompts.md` | **Present, unverified** | [`task-01-design-system/docs/prompts.md`](docs/prompts.md) (Prompt log recording Prompts 1 through 21) |
| `docs/defects.md` | **Present, unverified** | [`task-01-design-system/docs/defects.md`](docs/defects.md) (Documented defects and technical limitations) |
| `docs/interview-answers.md` | **Present, unverified** | [`task-01-design-system/docs/interview-answers.md`](docs/interview-answers.md) (12 viva defence answers drafted; needs final user verification) |
| `evidence/01-palette-before-pin.png` | **Present, unverified** | [`task-01-design-system/evidence/01-palette-before-pin.png`](evidence/01-palette-before-pin.png) |
| `evidence/02-palette-after-pin.png` | **Present, unverified** | [`task-01-design-system/evidence/02-palette-after-pin.png`](evidence/02-palette-after-pin.png) |
| `evidence/03-spacing-default.png` | **Present, unverified** | [`task-01-design-system/evidence/03-spacing-default.png`](evidence/03-spacing-default.png) |
| `evidence/04-spacing-chosen.png` | **Present, unverified** | [`task-01-design-system/evidence/04-spacing-chosen.png`](evidence/04-spacing-chosen.png) |
| `evidence/05-tokens-incomplete.json` | **Present, unverified** | [`task-01-design-system/evidence/05-tokens-incomplete.json`](evidence/05-tokens-incomplete.json) (Export missing variables) |
| `evidence/06-tokens-complete.json` | **Verified (test suite)** | [`task-01-design-system/evidence/06-tokens-complete.json`](evidence/06-tokens-complete.json) (SHA-256: `efbab56ac79fb061992bb301d3b5747156bf51b8f7ca2faa6cc4ede86c9cbda4`; verified by scripts/verify-tokens.js) |
| `evidence/07-raw-value-search.txt` | **Present, unverified** | [`task-01-design-system/evidence/07-raw-value-search.txt`](evidence/07-raw-value-search.txt) (Historical search output recorded at Step 7; not a live clean search) |
| `evidence/08-agent-typography-answer.txt` | **Present, unverified** | [`task-01-design-system/evidence/08-agent-typography-answer.txt`](evidence/08-agent-typography-answer.txt) (Agent typography Q&A response and cited style references) |
| `evidence/09-screen-without-system.png` | **Present, unverified** | [`task-01-design-system/evidence/09-screen-without-system.png`](evidence/09-screen-without-system.png) (Unstyled capture; clipped right edge noted in defects) |
| `evidence/10-screen-with-system.png` | **Present, unverified** | [`task-01-design-system/evidence/10-screen-with-system.png`](evidence/10-screen-with-system.png) (Styled prototype capture at 412 × 915 px viewport) |
| `evidence/11-broken-referencing.png` | **Present, unverified** | [`task-01-design-system/evidence/11-broken-referencing.png`](evidence/11-broken-referencing.png) (Regression screenshot captured on isolated branch; needs final review) |
| `evidence/12-git-log-branch-unmerged.txt` | **Present, unverified** | [`task-01-design-system/evidence/12-git-log-branch-unmerged.txt`](evidence/12-git-log-branch-unmerged.txt) (Transcribed git log and ancestry check from deleted experiment branch) |
| `evidence/13-walkthrough.mp4` | **Missing (Optional)** | Optional walkthrough video (bonus marks) |
