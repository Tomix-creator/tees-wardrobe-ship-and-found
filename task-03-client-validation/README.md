# Tee's Wardrobe: Task Three, the account form attacked from both sides

## What this is

A customer sign-up, login and password-reset page for Tee's Wardrobe, a one-person bespoke clothing business in Nigeria. Its validation helps honest customers, and I've proved it does nothing to stop anyone who skips the form.

## The task in four minutes

- **One page instead of three.** Sign-up, login and reset are now one page, `/account?form=…`. Switching forms makes no server request: 12 switches, and nothing in the server log.
- **Every field justified.** Phone is required, because Tee reaches customers on WhatsApp. Measurements, address and date of birth are deliberately *not* asked for. There's an 18+ checkbox, because Tee said her customers are "17 and over".
- **Rules from Tee's business.** A full name must be at least two words, because "Blessing" alone could be three church customers. Each rule names who it wrongly blocks.
- **I caught the agent rejecting Yoruba names with tone marks** (`Ọlá Adébáyọ̀`), and fixed it.
- **A VoiceOver audit:** errors were completely silent to a screen reader. Five problems found and fixed, with transcripts before and after.
- **I skipped the form with `curl`**, and the server saved a customer called `a`. Client-side validation is not security.

## Status

| | |
|---|---|
| **Done** | Steps 1, 2, 3, 6, 8 and 9. Step 4 (number vs text input) and Step 7 (hidden vs disabled button) are captured |
| **Partly done** | Terms: the page is a placeholder, and the source is chosen but not yet applied. The password hint on typing isn't built (defect 8) |
| **Not done** | Server-side validation, hashing and real login. Those are Task Four |

## Getting started

Same as Task Two (see [`../task-02-repository-and-scaffold/README.md`](../task-02-repository-and-scaffold/README.md#getting-started)), but in this folder and with its own database:

```bash
cd task-03-client-validation
```
```bash
createdb tees_wardrobe_t3
```
```bash
cp .env.example .env
```
```bash
sed -i '' "s/USER/$(whoami)/" .env
```
```bash
npm install
```
```bash
npx prisma migrate deploy
```
```bash
npx prisma generate
```
```bash
npm run dev
```

Open http://localhost:3000/account?form=signup.

`npx prisma generate` matters. Without it, every sign-up returns 500 (defect 9).

## Environment variables

| Name | Required | What it's for |
|---|---|---|
| `DATABASE_URL` | Yes | Points to the `tees_wardrobe_t3` database |
| `NEXT_PUBLIC_SITE_URL` | No | Public address for link previews |

## Where everything is

| Step | Write-up | Evidence |
|---|---|---|
| 1 One page | `docs/spa-rationale.md` | `01`–`04` |
| 2 Fields and terms | `docs/field-justification.md`, `docs/terms-note.md` | |
| 3 Validation | `docs/validation-rules.md`, `lib/validation.ts` | `05`–`08` |
| 4 Number vs text input | `docs/validation-rules.md` (phone) | `09`. The text input is the current form |
| 5 Sensitive shape | `docs/enumeration.md` | |
| 6 Accessibility | `docs/accessibility-audit.md` | `extra-sr-before-*`, `extra-sr-after-*` |
| 7 Button | below | `13`, `14` |
| 8 Attack and direct request | `docs/client-side-is-not-security.md` | `15`, `16`, `extra-16-…` |
| 9 Rollback | `docs/rollback.md` | `17` |
| Defects | `docs/defects.md` | |

## Step 4: why phone isn't a number input

A number input treats `08031234567` as a quantity. It refuses spaces and `+234`, and one press of the arrow key turned it into `8031234568`: the leading 0 is gone, and it's a different person's number (`evidence/09`). The form uses a text input that strips spaces, dashes and brackets in one line (`cleanPhone`) before sending.

A number input is the right choice for an actual quantity, like how many pieces of the same garment someone is ordering, where 0, arrows and arithmetic make sense.

## Step 7: password and button

**Password:** at least 8 characters, because length beats complexity (`validation-rules.md`). I chose a **show-password toggle** over a confirm field, because typing a password twice on a phone is slow, and Tee said she'd reject software that's slow on a phone. In a stricter industry, like banking, a confirm field is better, because a typo there locks someone out of their money, and a toggle shows the password on screen to anyone looking over their shoulder.

**Button:** I built it hidden until the form was valid first (`evidence/13`), then always visible but marked disabled (`evidence/14`). The disabled version is better. Customers expect to see the button, and a hidden one gives no clue that anything is missing. Mine stays in the tab order (`aria-disabled`, not `disabled`), and it explains itself. A line under it says "Fill in every field and tick both boxes to create your account", and clicking it moves focus to the first problem, including "Please agree to the Terms and Privacy Notice to continue."
