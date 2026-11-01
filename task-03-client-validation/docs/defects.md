# Known defects (Task Three)

All of these were checked on my machine on 1 November 2026.

1. **The server accepts anything.** `app/api/signup/route.ts` has no validation of its own, so `curl` saved a customer named `a`, with email `not-an-email` and phone `x` (`evidence/16`). This is deliberate at this stage. Task Four adds server-side checks.
2. **A duplicate email gives a 500, not a clear message.** The database refuses a second account with the same email (`@unique` in `prisma/schema.prisma`), and the server answers "Could not create account." Fixing it must not create user enumeration (`enumeration.md`).
3. **Two misleading error messages.** An 81-character name is told "Please enter at least your first name and surname". A 260-character email is told "Check for a missing @ or dot". Neither is the real problem (`evidence/15`, `lib/validation.ts`).
4. **The rules check shape, not truth.** `a b`, `test test`, `a@b.c`, `00000000000` and `aaaaaaaa` all pass the form (`evidence/15`).
5. **The terms page is a placeholder.** `/terms` has no terms yet (`terms-note.md`). The app must not go live until it does.
6. **Login and password reset aren't built.** They validate, then say "Not built yet" in a browser `alert()`. Pop-up alerts are also awkward for screen reader users.
7. **Accessibility gaps I didn't verify:** the live region's spoken summary wasn't captured, and Safari's Tab key skips the "Read the Terms" link unless Option-Tab is used. Only VoiceOver on macOS was tested (`accessibility-audit.md`).
8. **The password hint isn't built.** The PDF asks for the password rule to appear only once typing begins. Right now, the rule appears only as an error after leaving the field.
9. **The agent's migration never regenerated the Prisma client.** Every sign-up crashed until I ran `npx prisma generate` (`evidence/extra-16-first-attempt-500…`). It's fixed now, but anyone running `migrate dev` on Prisma 7 must also run `generate`.
10. **The Task Two defects carried over,** because this is a copy of that app: a huge price gives a 500, there are three `npm audit` advisories, and there's no login on the order form.
