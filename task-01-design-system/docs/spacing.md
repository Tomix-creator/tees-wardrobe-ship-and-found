# Spacing

My Figma export had colours, type and shadows, but no spacing. So I defined a spacing scale by hand in [`css/spacing.css`](../css/spacing.css). It isn't one of the required Task One deliverables; I added it because Task Two needs shared spacing for buttons and layout.

| Token | rem | px (at 16px root) | Use for |
|---|---|---:|---|
| `--space-3xs` | 0.125 | 2 | Hairline dividers, border offsets |
| `--space-2xs` | 0.25 | 4 | Badge padding, tight icon gaps |
| `--space-xs` | 0.5 | 8 | Gaps between controls |
| `--space-sm` | 0.75 | 12 | Padding inside form fields |
| `--space-md` | 1 | 16 | Standard card padding, paragraph gaps |
| `--space-lg` | 1.5 | 24 | Phone screen side margins |
| `--space-xl` | 2 | 32 | Section headings |
| `--space-2xl` | 3 | 48 | Separating major blocks |

## Why these values

- **Steps of 4px.** Every token except `3xs` is a multiple of 4, so things line up easily on a 412px phone screen. `3xs` (2px) is a deliberate exception for hairlines, where 4px is too thick.
- **rem, not px.** If someone increases their phone's font size, spacing grows with the text instead of crowding it. That helps, but on its own it doesn't prove the layout survives zoom; that needs testing.
- **Names instead of numbers.** Components pick `sm` or `md` rather than inventing 13px or 7px.

## Not used yet

The Task One order screen doesn't load `spacing.css`; its spacing is still typed in by hand. See defect 3 in `defects.md`.
