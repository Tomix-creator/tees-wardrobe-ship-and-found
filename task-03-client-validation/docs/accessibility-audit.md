# Accessibility audit: the sign-up form

A written audit, field by field, against five criteria:
- **Colour independence:** the error signal reaches someone who can't see red.
- **Keyboard reachability:** everything can be reached with Tab.
- **Focus visibility:** you can see where you are.
- **Screen reader announcement:** what VoiceOver actually says.
- **Error association:** the error is read out *with* its field.

**Screen reader:** VoiceOver on macOS, in Safari, at http://localhost:3000/account?form=signup. I moved through the form with Tab, and pressed buttons with Control-Option-Space. The words below are copied from VoiceOver's caption panel, exactly as shown, including its odd wording. Screenshots: `evidence/extra-sr-before-01` to `09`.

## Before the fixes (1 November 2026, 19:41 to 20:23)

### What VoiceOver said, field by field

| Field | VoiceOver said (verbatim) | What was on screen at the time |
|---|---|---|
| Email | "Email address edit text email field with autofill menu" | A red error under Full name ("Tee needs your first name and surname."). Not mentioned |
| Phone | "Phone number, edit text telephone number field with autofill menu" | A red error under Email. Not mentioned |
| Password | "Password, secure edit text with autofill menu" (once as "Safari, Create account \| Tee's Wardrobe, window, Password, secure edit text with autofill menu") | A red error under Phone. Not mentioned |
| Show button | Only the hint was captured: "You are currently on a button. To click this button, press Control-Option-Space." | The button's name was spoken first, but the hint replaced it in the caption before I could capture it |
| Terms checkbox | "I agree to the Terms and Privacy Notice I agree to theand 1 more item, unticked, tickbox" | The label is read twice, then garbled into "theand 1 more item", because the link sits inside the label |
| Tab after Terms | "application, Markup, button", with the focus ring on the 18+ checkbox | Tab never stopped on the "Terms and Privacy Notice" link |
| 18+ checkbox | "I am 18 or older, unticked, tickbox" | No "required" |
| Create account, pressed with the form empty | "You are currently on a button, inside web content. To click this button, press Control-Option-Space. To exit this web area, press Control-Option-Shift-Up Arrow." | **Six red errors appeared on screen. VoiceOver said nothing about any of them** |

### Field by field, against the five criteria

| Field | Colour independence | Keyboard | Focus visible | Announcement | Error association |
|---|---|---|---|---|---|
| Full name | ❌ Error is red text and a red border only | ✅ | ✅ | ⚠️ No "required" | ❌ Error not read with the field |
| Email | ❌ Red only | ✅ | ✅ | ⚠️ No "required" | ❌ |
| Phone | ❌ Red only | ✅ | ✅ | ⚠️ No "required" | ❌ |
| Password | ❌ Red only | ✅ | ✅ | ⚠️ No "required" | ❌ |
| Show button | n/a | ✅ | ✅ | ✅ Has an accessible name ("Show password" / "Hide password" in the code) | n/a |
| Terms checkbox | ❌ Red only. The link inside it is the same colour as the text, with no underline | ❌ The link is skipped by Tab | ✅ | ❌ Garbled: "I agree to theand 1 more item" | ❌ |
| 18+ checkbox | ❌ Red only | ✅ | ✅ | ⚠️ No "required" | ❌ |
| Create account | n/a | ✅ | ✅ | ✅ | ❌ After pressing, nothing tells a screen reader user what went wrong |

### The real problems found

1. **Errors are never announced.** Six errors appear after pressing Create account, and VoiceOver stays silent. A blind customer presses the button, nothing seems to happen, and they assume the site is broken. This is the PDF's Hauwa story, in my own form.
2. **Errors aren't linked to their fields.** Even when focus lands on a field showing an error, VoiceOver reads only the label. There's no `aria-describedby` connecting the message to the input, and no `aria-invalid`.
3. **No field is announced as required.** No field says "required", so a screen reader user can't tell what must be filled in until it fails.
4. **The Terms checkbox is garbled, and its link can't be reached.** The link inside the label makes VoiceOver say "I agree to theand 1 more item". Tab skips the link, so a keyboard user can't open the terms they're agreeing to. Visually, the link looks identical to the surrounding text. (Part of the Tab skip is Safari itself: by default it tabs only to form controls, and Option-Tab reaches links. The garbled label and the invisible link are mine, though.)
5. **The error signal is colour only.** It's red text and a red border. Someone with red-green colour blindness sees grey text with no warning attached.

## The fixes

All the fixes are in `app/account/AccountForms.tsx`. No validation rule or message changed.

| Problem | Fix |
|---|---|
| 1. Errors never announced | When submit fails, keyboard focus moves to the **first invalid field**, so VoiceOver reads it with its error. A visually hidden `aria-live="assertive"` region also says how many problems there are |
| 2. Errors not linked to fields | Every error has an id. Its input gets `aria-describedby` pointing at it, plus `aria-invalid="true"` while the error shows. Both are removed when the error clears. The checkboxes get the same treatment |
| 3. Required not announced | `aria-required="true"` on every required input and both checkboxes. I didn't use the HTML `required` attribute, because it brings up the browser's own pop-ups instead of my messages |
| 4. Garbled Terms checkbox, unreachable link | The link moved **out of** the label. The label is now exactly "I agree to the Terms and Privacy Notice", and a separate, underlined link reads "Read the Terms and Privacy Notice". All text links in the form are underlined, not just coloured |
| 5. Colour-only errors | A caution triangle icon (inline SVG, `aria-hidden="true"`, so VoiceOver doesn't read it twice) sits before every error message. The red stays |

The agent's model quota ran out while it was making these changes. I checked that the file was complete before accepting it: all five fixes were present, TypeScript reported no errors, and the page loaded.

## After the fixes (1 November 2026, 20:34 to 20:38)

Screenshots: `evidence/extra-sr-after-01` to `08`.

| Field | Before (verbatim) | After (verbatim) |
|---|---|---|
| Email, empty | "Email address edit text email field with autofill menu" | "Email address required edit text email field with autofill menu" |
| Email, **showing an error** | (the error wasn't read) | "**Email address Enter the email you'll log in with., edit text email field, required invalid data**" |
| Phone | "Phone number, edit text telephone number field with autofill menu" | "Safari, Create account \| Tee's Wardrobe, window, Phone number, required, edit text telephone number field with autofill menu" |
| Password | "Password, secure edit text with autofill menu" | "Password, required, secure edit text with autofill menu" |
| Show button | (name not captured, only the hint) | "Safari, Create account \| Tee's Wardrobe, window, Show password, button" |
| Terms checkbox | "I agree to the Terms and Privacy Notice I agree to theand 1 more item, unticked, tickbox" | "Safari, Create account \| Tee's Wardrobe, window, I agree to the Terms and Privacy Notice, required unticked, tickbox" |
| 18+ checkbox | "I am 18 or older, unticked, tickbox" | "Safari, Create account \| Tee's Wardrobe, window, I am 18 or older, required unticked, tickbox" |
| Create account, pressed with the form empty | Silent. Only the button hint, and six errors on screen | Focus jumps to **Full name** (`extra-sr-after-01`, focus ring on the first field), with every error showing its caution icon |

### What changed for a screen reader user

- Every field now says **"required"**.
- A field with an error now reads the **error itself**, plus **"invalid data"**. That's the most important change: before, a blind customer had no way to learn what was wrong.
- The Terms checkbox reads cleanly, once.
- After a failed submit, focus lands on the first broken field instead of staying on the button.

### What I didn't capture, or didn't fix

- **The live region's spoken summary** after pressing Create account. Focus visibly moved to Full name, but I didn't capture the caption at that instant. That announcement is unverified.
- **Reaching the "Read the Terms…" link with Tab in Safari.** By default, Safari's Tab skips links (Option-Tab reaches them), so this depends on a browser setting I didn't change.
- **The submit button is still always enabled.** Step 7's disabled-button behaviour, and its message, come next and need their own check.
- **One screen reader, one browser** (VoiceOver and Safari on macOS). NVDA or JAWS on Windows, and TalkBack on Android, weren't tested.
