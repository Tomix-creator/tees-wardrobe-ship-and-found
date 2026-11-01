# Client-side validation is not security

## The request I sent

I skipped the browser and the form completely, and sent this from the terminal (`evidence/16-direct-request-command-and-response.txt`):

```bash
curl -i -X POST http://localhost:3000/api/signup -H "Content-Type: application/json" -d '{"fullName":"a","email":"not-an-email","phone":"x","password":" "}'
```

A one-letter name, an "email" with no `@`, a phone number of `x`, and a password of one space. My form blocks every one of those.

## What my server did with it

**It accepted it.**

```
HTTP/1.1 201 Created
{"id":1}
```

Then I checked the database itself, not the response:

```
 id | fullName |    email     | phone
----+----------+--------------+-------
  1 | a        | not-an-email | x
```

The junk is stored as customer #1. If Tee opened her customer list, she'd see a customer called "a" whom she can't reach and can't match to any order. That's exactly the bookkeeping mess the two-word name rule was meant to prevent.

The password wasn't stored, but not because anything checked it. The server ignores passwords completely until Task Four adds hashing.

## Which of my client-side rules were enforced on that request

**None of them.**

| Rule (in `lib/validation.ts`) | Enforced on the direct request? |
|---|---|
| 1. Required fields | No |
| 2. Full name: two words, letters only, max 80 | No. `a` was saved |
| 3. Phone: Nigerian or overseas shape | No. `x` was saved |
| 4. Password: 8–64, not only spaces | No. The server never looks at the password |
| 5. Email shape | No. `not-an-email` was saved |
| 6. Terms checkbox | No. The request didn't even mention it |
| 7. 18+ checkbox | No. The request didn't mention it |
| 8. Email checked in real time on sign-up, on submit for login | No. There was no form to check anything |

The only thing that could have refused it was the database's own rule that emails are unique. The server's only check of its own is that the body is valid JSON.

## What this proves

My validation rules live in the browser, in JavaScript the customer's own device runs. `curl` doesn't run that JavaScript, and neither does a bot or anyone who opens their browser's developer tools. **The rules are a convenience for honest customers, not a lock on the door.** They help Tee's customers fill the form correctly the first time. They don't stop anyone who decides not to use the form.

**Analogy:** the form is a polite receptionist who checks your details before showing you in. The server is the back door, and it's unlocked. Anyone who walks round the side of the building never meets the receptionist.

The attack through the form (`evidence/15-form-attack-results.txt`) shows something smaller but related: even for someone using the form, the rules check *shape*, not truth. `a b`, `a@b.c`, `00000000000` and `aaaaaaaa` all get through.

## A second finding: sign-up had never worked

My first direct request got **500, not 201** (`evidence/extra-16-first-attempt-500-client-not-generated.txt`).

**Cause:** in Prisma 7, `prisma migrate dev` created the `Customer` table, but didn't regenerate the client code in `generated/prisma/`. That code only knew about `Order`, so `prisma.customer` didn't exist and **every** sign-up crashed, including perfectly valid ones from the form. The agent's report had said "Everything checks out".

I fixed it with `npx prisma generate` and a dev server restart. Then the junk went straight in.

Two lessons:
- **The first test that actually wrote to the database found the bug, not the agent's report.**
- **A server that refuses everything isn't secure, it's broken.** The 500 looked like protection, but it would have refused Tee's real customers too.

## What I'll do about it in Task Four

The server becomes the source of truth:

- **Repeat every rule on the server**, in `app/api/signup/route.ts`: the same two-word name, phone shape, email shape, password length and both checkboxes. Anything that fails gets a **400** with the reason, before anything touches the database. The browser rules stay too, but only to save honest customers a round trip.
- **Share one set of rules** between browser and server, so they can't drift apart: `lib/validation.ts` is already pure functions with no browser code in it.
- **Store that the customer agreed to the terms and confirmed they're 18+, with the time**, so consent is recorded on the server and not just ticked in a browser.
- **Hash passwords with a slow algorithm** (bcrypt or Argon2) instead of discarding them.
- **Rate-limit sign-up**, so a script can't create hundreds of junk accounts a minute.
- **Return the same response for "email already taken"** as for other failures, so sign-up can't be used to check who Tee's customers are (`enumeration.md`).
- **Then send this exact `curl` request again**, and record the 400.
