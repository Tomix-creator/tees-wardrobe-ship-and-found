# Task One: Design system, and proving the agent used it

**Business:** Tee's Wardrobe, a one-person clothing business taking made-to-order and ready-made orders over direct messages. The thing that must work: **every order's balance is right.** ([brief](docs/business-brief.md))

## What I built

1. **A design system in Figma** around Tee's sea green, `#32B1AA`:
   - a palette from Material Theme Builder, with her exact colour pinned at primary 40 ([colour roles](docs/colour-roles.md))
   - 9 colour roles, every pair contrast-checked with numbers
   - 15 text styles in Inter ([type scale](docs/type-scale.md))
   - 3 brand-coloured shadows ([shadows](docs/shadows.md))
2. **Two exports**: one missing the colours by mistake, one complete ([what was missing](docs/export-review.md)).
3. **A converter** that turns the Figma JSON into CSS variables (`scripts/convert-tokens.js`). The interface may only use roles, never raw palette colours. `scripts/verify-tokens.js` runs 112 checks on the output.
4. **One screen** (`index.html`): an order-balance demo with fictional data, built by Antigravity first without the system, then with it.
5. **Proof the agent used the system**: a raw-colour search, the agent's own answer about which text style it used, before/after screenshots, and a deliberately broken branch.

## Key decisions

- **Pinned the brand colour.** The generator turned Tee's colour into a dull `#006A65`; pinning kept her sea green as the real primary.
- **Dark text on the brand colour.** White on `#32B1AA` is only 2.62:1, so buttons and badges use `#191C1C` (6.54:1).
- **Inter at −4% letter spacing**, with line height ×1.4 for headings and labels and ×1.5–1.6 for body text. ([why, and where it's wrong](docs/divergences.md))
- **Shadows from dark sea green** (`#0D2C2B`), not black.

## What I got wrong

- My first brand colour was a guess (web "seagreen", `#2E8B57`) until Tee sent her real swatch.
- My first export left out every colour, because I didn't include Figma variables.
- The shadows can't follow a brand change, because their colour is fixed, not linked.
- The order screen still has hand-typed spacing; only colour and type come from tokens.
- An agent audit once described the wrong business and invented files. I now check agent reports against the actual files.

Full list with file and line numbers: [defects](docs/defects.md).

## Run it

From the repository root:

```bash
python3 -m http.server 8085 --directory task-01-design-system
```

Open `http://localhost:8085`, ideally at a 412px-wide phone view. Use the dropdown to switch between the two fictional orders.

To regenerate and check the CSS from the Figma export:

```bash
node task-01-design-system/scripts/convert-tokens.js
```

```bash
node task-01-design-system/scripts/verify-tokens.js
```

## Deliverables

| Required | File |
|---|---|
| Business brief | [docs/business-brief.md](docs/business-brief.md) |
| Type scale (all 15) | [docs/type-scale.md](docs/type-scale.md) |
| Colour roles and contrast | [docs/colour-roles.md](docs/colour-roles.md) |
| Shadows | [docs/shadows.md](docs/shadows.md) |
| Divergences | [docs/divergences.md](docs/divergences.md) |
| Prompts, verbatim | [docs/prompts.md](docs/prompts.md) |
| Defects | [docs/defects.md](docs/defects.md) |
| Interview answers (12) | [docs/interview-answers.md](docs/interview-answers.md) |
| Palette before / after pinning | [01](evidence/01-palette-before-pin.png) / [02](evidence/02-palette-after-pin.png) (others: 02b–02e) |
| Display Large spacing, default / chosen | [03](evidence/03-spacing-default.png) / [04](evidence/04-spacing-chosen.png) |
| Token export, incomplete / complete | [05](evidence/05-tokens-incomplete.json) / [06](evidence/06-tokens-complete.json) |
| Raw-colour search, command and output | [07](evidence/07-raw-value-search.txt) |
| Agent's typography answer | [08](evidence/08-agent-typography-answer.txt) |
| Screen without / with the system | [09](evidence/09-screen-without-system.png) / [10](evidence/10-screen-with-system.png) |
| Broken referencing | [11](evidence/11-broken-referencing.png) (+ [explanation](evidence/11-broken-referencing-explanation.txt)) |
| Git log, branch never merged | [12](evidence/12-git-log-branch-unmerged.txt) |
| Walkthrough (optional) | Not recorded |

Files starting `support-` in `evidence/` are extra Figma screenshots and checks, not required deliverables. The owner interview is in [docs/business-research.md](docs/business-research.md).

## Not done

- No dark mode.
- Small text (11–12px at −4%) not tested on a real phone.
- Walkthrough video not recorded.

## How this was made

I used AI agents throughout: Codex to guide the Figma work, Antigravity to write the converter and the screen, and Claude to rewrite these documents for readability from my existing drafts. The decisions, the business research and the review of every output are mine. The prompts I gave Antigravity are in [docs/prompts.md](docs/prompts.md).
