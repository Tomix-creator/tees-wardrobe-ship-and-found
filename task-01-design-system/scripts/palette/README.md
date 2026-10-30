# How the primary palette was rebuilt around #32B1AA

Material Theme Builder generated `#006A65` at primary 40, not Tee's sea green. This script rebuilt the primary family so `#32B1AA` sits exactly at 40. Codex wrote it while guiding me; I added it here on 30 October 2026 so the method can be checked and re-run.

## Files

| File | What it is |
|---|---|
| `tees-wardrobe-primitives-before-override.tokens.json` | The plugin's palette, before any change: 5 families × 18 tones + brand source = 91 colours |
| `build-brand-palette.mjs` | The script |
| `tees-wardrobe-primitives-brand-anchored.tokens.json` | Its output, which I imported into Figma as the `primitive brand` collection |
| `primary-palette-review.md` | A report the script writes: every primary tone before and after |

## Run it

From this folder:

```bash
node build-brand-palette.mjs
```

It rewrites the output JSON and the report. Re-running it gives byte-for-byte the same output, and all 18 primary tones match `css/tokens.css`.

## What it does, in plain words

1. **Reads** the plugin's palette.
2. **For each primary tone** (0, 5, 10 … 100):
   - **0 to 40:** blends from black towards `#32B1AA`. Tone 20 is halfway (20 ÷ 40).
   - **40 to 100:** blends from `#32B1AA` towards white. Tone 70 is halfway (30 ÷ 60).
   - Blending means mixing each of the red, green and blue numbers in proportion, then rounding to a whole number.
3. **Checks its own work** (the `assert` lines), stopping with an error if any fails:
   - tone 40 is exactly `#32B1AA`, 0 is black and 100 is white;
   - all 18 tones are different, and each is brighter than the one before;
   - the other four families are untouched;
   - there are still 91 colours, and exactly 16 primary values changed.
4. **Writes** the new palette and the report, then re-reads the file to confirm it saved correctly.
5. **Calculates contrast** for white text on the brand (2.62:1, fail) and dark text on it (6.54:1, pass), using the WCAG formula.

## Its limitation

The blend is a straight line in sRGB numbers, not Material's perceptual (HCT) tones, so the steps aren't evenly spaced to the eye. "Primary 20" here isn't the colour Material would call 20. See `docs/divergences.md`.
