# Tee's Wardrobe — Spacing Tokens Specification

This document records the addition of the spacing token scale to the Tee's Wardrobe design system.

The Task One Figma token export (`evidence/06-tokens-complete.json`) contained primitive and role colors, composite typography styles, and elevation shadows, but omitted spacing tokens. To provide a shared reference for layout spacing, margins, paddings, and gaps, this scale was defined in [`../css/spacing.css`](../css/spacing.css).

---

## 1. Token Scale and Values

| Token Name | Rem Value | Pixel Equivalent (at 16px root) | Intended Semantic Usage |
|---|---|---|---|
| `--space-3xs` | `0.125rem` | 2px | Hairline dividers, border offsets, micro gaps |
| `--space-2xs` | `0.25rem` | 4px | Tag/badge padding, tight icon margins |
| `--space-xs` | `0.5rem` | 8px | Control element gaps, compact list spacing |
| `--space-sm` | `0.75rem` | 12px | Form field inner padding, compact card separation |
| `--space-md` | `1rem` | 16px | Base grid unit, standard card padding, paragraph margins |
| `--space-lg` | `1.5rem` | 24px | Mobile screen horizontal gutter, major card padding |
| `--space-xl` | `2rem` | 32px | Section headers, hero container vertical padding |
| `--space-2xl` | `3rem` | 48px | Primary layout block separation, footer top spacing |

**Note on `--space-3xs`:** At 0.125rem, this token sits outside the 4px harmonic grid — it resolves to 2px at a 16px root. It was included as a hairline exception for dividers and border offsets where a full 4px step is too coarse, not as part of the regular grid rhythm.

---

## 2. Why These Values Were Chosen

1. **4px/8px Harmonic Grid**:
   - Seven of the eight tokens are multiples of 4px, which aligns with common layout grid conventions used in mobile design (target viewports: 412px Android, 390px iOS). This makes it straightforward to keep elements visually aligned, though consistent spacing in production depends on components actually using the tokens rather than hardcoded values.

2. **`rem` Units and Font Scaling**:
   - Expressing spacing in `rem` units means padding and gap values are relative to the root font size. If the root font size changes — for example, because the user increases their browser's default font size — these spacing values will scale with it. This can support text resizing scenarios, but `rem` spacing alone does not prove WCAG 2.2 SC 1.4.4 (Resize Text) compliance; that criterion requires testing actual text and layout behaviour across zoom and font-size settings.

3. **Named Token Vocabulary**:
   - Defining eight named tokens from `3xs` to `2xl` gives components a shared vocabulary and reduces arbitrary one-off values (e.g. 7px, 13px) in component code. Whether spacing is truly consistent depends on whether components adopt the tokens.
