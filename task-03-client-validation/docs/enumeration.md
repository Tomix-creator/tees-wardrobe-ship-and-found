# Not leaking the shape of sensitive data

## Which field, and why its shape is sensitive

**The password on the login form.**

On sign-up, the customer has to know the rule: "Use at least 8 characters", up to 64. On login, that same rule would be a hint to anyone guessing someone else's password: don't bother trying anything shorter than 8.

So the login form checks only that the password isn't empty. It never shows the length rule, never says "too short", and never shows a placeholder that hints at the format (`lib/validation.ts`: login calls `requiredPassword` only, never `passwordRules`).

**An honest note on "removing the hint":** the agent's forms never had a placeholder like "8+ characters", so there was no visible hint to delete. The decision I made was to *not* reuse the sign-up password rule on login, at Step 3, when the rules were written. I'm stating that plainly, rather than inventing a hint I removed.

**The same thinking applies to the reset code, when it's built in Task Four.** The code Tee's app emails will work like a short-lived password. The reset form must not show "Enter the 6-digit code", or a placeholder like `123456`, because that tells an attacker exactly how many combinations to try (6 digits is only a million).

## What an attacker gains from knowing the shape

**Fewer guesses.** If they know a password must be at least 8 characters, or that a code is exactly 6 digits, they can skip everything that can't match. Each hint shrinks the search.

The bigger leak is *which half was wrong*. A login that says "no account with that email" tells an attacker which emails belong to Tee's customers. That's **user enumeration**. They can then try common passwords against only real accounts, or send those customers convincing fake "Tee's Wardrobe" messages.

So when login is built in Task Four, a failure must say **"Incorrect email or password"**, whichever part was wrong. Password reset must say **"If that email has an account, we've sent a link"**, whether or not it does.

**A leak I found in my own app:** sign-up already enumerates. Customer email is `@unique` in the database. Today, a duplicate email returns a 500 "Could not create account" (`defects.md`). When Task Four turns that into a clear message, "this email already has an account" would tell anyone whether someone is Tee's customer. The safer pattern is to always reply "check your email to continue", and to tell the real owner by email.

## The trade-off I accepted

**Who it makes things harder for:** a real customer who's forgotten whether they signed up with their Gmail or their work email. With "incorrect email or password", they can't tell which half is wrong, so they may try the reset link on both addresses.

**How much harder:** one extra step for a minority of logins. On a phone, it's maybe 30 seconds and one email check.

**Is it worth it?** Yes. Tee's customer list is her business: names, phone numbers, and who has bought from her. Leaking it costs her customers' trust, and in my understanding of the Nigeria Data Protection Act it may be a reportable disclosure. A slightly slower login for a forgetful customer is the smaller cost.
