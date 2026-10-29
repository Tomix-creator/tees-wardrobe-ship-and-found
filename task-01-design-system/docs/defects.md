# Tee’s Wardrobe — Task One Known Defects & Technical Limitations

This document records substantiated defects, layout edge cases, data inconsistencies, and technical limitations identified during the development and audit of the Task One design system and demonstration prototype. 

Only defects directly substantiated by file inspections or empirical tests are recorded below. Items involving unconfirmed external claims are explicitly marked as **unverified**.

---

## 1. Substantiated Visual & Layout Defects

### Defect 1.1: Clipped Right Edge on Unstyled Baseline Screen Capture
- **Location**: [`task-01-design-system/evidence/09-screen-without-system.png`](../evidence/09-screen-without-system.png)
- **Substantiating Evidence**:
  - Image viewport width: **412 px** (height: 1450 px).
  - File SHA-256: `d4a45efc4296a40e120e482c8a7fb87eb7f26539526b7375a9f84d7b69fd871c`.
- **Observed Behavior**:
  - Along the right-hand margin of the capture, container boundaries and text content (notably the order summary card and financial table borders) terminate directly against the viewport edge without visible padding or margin.
- **Qualified Causes & Hypotheses**:
  - While unstyled HTML defaults (such as default table rendering, default 8px body margin accumulation, or lack of `box-sizing: border-box`) can cause content to overflow a 412px boundary, the exact technical cause during capture remains an unverified hypothesis. Other factors, such as desktop browser emulation deducting 15–17px for a vertical scrollbar margin from the 412px viewport, could equally account for the observed edge truncation. No live DOM trace or layout metric was recorded during that historical capture session to isolate the single root cause.
- **Impact & Resolution in Styled Screen**:
  - **Impact**: Highlights that baseline unstyled markup lacks responsive mobile constraints, leaving content vulnerable to horizontal clipping on standard mobile devices (412px).
  - **Resolution in Styled Screen**: In [`evidence/10-screen-with-system.png`](../evidence/10-screen-with-system.png), the styled prototype fits cleanly within the 412px viewport with all cards, text, and tables properly padded. This reflects the combined effect of layout reset rules, explicit container paddings (`--space-*`), and responsive widths (`max-width: 100%`), rather than isolating any single property fix.
  - **Evidence Integrity**: In accordance with assessment instructions, the original imperfect screenshot is preserved unchanged as authentic baseline evidence.

---

## 2. Substantiated Token Pipeline Defects

### Defect 2.1: Malformed Token References (Trailing Whitespace in Figma Aliases)
- **Location**: [`task-01-design-system/evidence/06-tokens-complete.json`](../evidence/06-tokens-complete.json)
- **Substantiating Evidence**:
  - In 9 semantic color role variable declarations (Lines 111, 142, 173, 204, 235, 266, 297, 328, 359), alias reference strings contain trailing whitespace before the closing brace:
    ```json
    "value": "{color.brand.primary.40 }"
    ```
    instead of:
    ```json
    "value": "{color.brand.primary.40}"
    ```
- **Observed Behavior**:
  - Exact string matching in automated conversion tools fails to match `{color.brand.primary.40 }` against the key `color.brand.primary.40`.
- **Impact & Resolution**:
  - **Impact**: Without explicit normalization, the CSS generator silently fails to resolve references or outputs invalid variable values.
  - **Resolution**: In [`scripts/convert-tokens.js`](../scripts/convert-tokens.js), regex-based trimming (`.replace(/\s+/g, '')` and `.trim()`) was implemented and is continuously verified by test suite [`scripts/verify-tokens.js`](../scripts/verify-tokens.js).

### Defect 2.2: Omission of Variable Collections in Default Figma Export
- **Location**: [`task-01-design-system/evidence/05-tokens-incomplete.json`](../evidence/05-tokens-incomplete.json)
- **Substantiating Evidence**:
  - File size: 29,557 bytes (omits all primitive colors and semantic roles) vs. complete export of 80,472 bytes.
- **Impact**:
  - Exporting tokens from Figma without explicitly checking "Include Variables" drops all color primitives and semantic roles, rendering downstream CSS generation completely non-functional.

---

## 3. Substantiated Architectural & System Limitations

### Defect 3.1: Demonstration Prototype Does Not Provide Working Order Storage
- **Location**: [`task-01-design-system/index.html`](../index.html)
- **Substantiating Evidence**:
  - Order state is defined exclusively in in-memory JavaScript objects (`const orders = { ... }`).
  - There are no HTTP POST/PUT API calls, database connectors, IndexedDB stores, or localStorage handlers.
- **Impact**:
  - The interface demonstrates layout, styling, and business calculation logic, but does **not** provide a working order-recording system. Orders, payments, and price updates cannot be permanently saved or submitted.

### Defect 3.2: Dark Mode Semantic Role Mappings Are Unimplemented
- **Location**: [`task-01-design-system/docs/colour-roles.md`](colour-roles.md)
- **Substantiating Evidence**:
  - Documentation states: *"Dark-mode mapping remains open."*
  - [`css/tokens.css`](../css/tokens.css) contains only `:root` definitions without `@media (prefers-color-scheme: dark)` overrides.
- **Impact**:
  - The design system does not yet support automatic dark theme switching; contrast pairs and tone mappings have only been verified for light surface backgrounds.

---

## 4. Unverified Stakeholder Claims & Uncertainties

### Item 4.1: Historical Customer Payment Confusion Scenario
- **Location**: [`task-01-design-system/docs/business-research.md`](business-research.md)
- **Status**: **Unverified**
- **Description**:
  - The source discovery transcript (`QA.docx`) recorded a specific walkthrough of a customer installment payment dispute.
  - In subsequent owner clarifications, the business owner stated that she was not certain whether this dispute had ever actually occurred, viewing it instead as a representative example of what could go wrong when tracking partial payments informally.
  - **Resolution**: Treated in all technical and business documentation as an unconfirmed risk example rather than a verified historical transaction, without asserting that no dispute ever took place.

### Item 4.2: Customer Communication & Mobile Data Constraints
- **Location**: [`task-01-design-system/docs/business-research.md`](business-research.md)
- **Status**: **Unverified**
- **Description**:
  - Stakeholder assumptions that customers strongly prefer WhatsApp direct links over web logins, or that customers frequently suffer network dropouts, represent the owner's personal impressions.
  - Because customers have not been directly interviewed, these claims remain unverified design assumptions.
