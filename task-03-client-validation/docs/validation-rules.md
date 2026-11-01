# Validation rules

Every rule on the account forms: what it is, what goes wrong without it, and **which real customer it wrongly blocks**. Every rule blocks someone; I've tried to name who.

These rules are derived from Tee's business (`field-justification.md`, and the Task One owner interview), not copied from class. They run **in the browser only**. They make the form easier to fill correctly. They don't protect the server, which still accepts anything (see `client-side-is-not-security.md`).

## Category 1: empty fields

| Rule | When it shows | Message (my wording) |
|---|---|---|
| A required field left empty | When the customer leaves the field (blur) without typing anything, and again on submit | Full name: "Tee needs your first name and surname." Email: "Enter the email you'll log in with." Phone: "Enter a number Tee can reach you on." Password: "Choose a password." |

- **Without it:** the customer finds out only after pressing the button, and has to hunt for what they missed.
- **Who it wrongly blocks:** nobody is blocked, since every one of these fields is genuinely required. The cost is a customer who tabs through the form to read it first, and gets an error on each field they passed. I accepted that, because the message only appears on fields they actually entered and left.

## Category 2: length and structure

### Full name: at least two words

**Rule:** extra spaces are trimmed. Then the name must be at least two words, each starting with a letter. Only letters (including accented ones like é or ọ), spaces, hyphens and apostrophes are allowed, up to 80 characters.

- **Why, for Tee:** she matches each account to the person in her notebook and WhatsApp chats. A first name alone can't be matched: "Blessing" could be three different customers from her church. Bots and AI agents also fill name fields with one token like "a" or "test".
- **Without it:** accounts named "Blessing", "a" or "test" that Tee can't connect to any order, which breaks the bookkeeping the app exists for.
- **A bug I caught in the agent's version:** it allowed only "letters" (`\p{L}`), and rejected `Ọlá Adébáyọ̀`. The final ọ̀ is stored as `ọ` plus a separate tone mark (U+0300), which Unicode counts as a *mark* (`\p{M}`), not a letter. The agent reported "all 46 checks pass", but its tests only used names like "Blessing Okafor". Yoruba and Igbo names often carry tone marks, so the rule would have blocked the very customers Tee serves. The fix allows `\p{M}` too (`lib/validation.ts` line 98). I found it by testing awkward names myself.
- **Who it wrongly blocks:**
  - **People who genuinely have only one name.** There are many, in Nigeria and elsewhere. I accept this knowingly. For Tee, a single name can't be matched to an order, and such a customer can still order by direct message as they do now.
  - **People who write an initial with a full stop**, like "J. Okafor". They'd have to type "J Okafor".
  - **Names in scripts or with characters outside letters, hyphens and apostrophes.**

### Phone number: Nigerian or overseas shape

**Rule:** spaces, dashes and brackets are removed first. Then it must be one of these:
- `0` followed by 10 digits (a Nigerian mobile, like `0803 123 4567`)
- `+234` followed by 10 digits
- `+` followed by 8 to 15 digits (an overseas number)

- **Why, for Tee:** this is how she tells a customer their outfit is ready, which is customers' second most common question. Most customers are Nigerian, but some order from abroad now and then, so a Nigeria-only rule would block real customers.
- **Without it:** a number with a missing digit, and an outfit that sits uncollected because Tee can't reach its owner.
- **Who it wrongly blocks:**
  - **Nigerian landlines**, which have a different length.
  - **People who type `234…` without the `+`.**
  - **Numbers with an extension.**

### Password: at least 8 characters

**Rule:** 8 to 64 characters. There's no "must include a capital, a number and a symbol" rule, because length beats complexity. A password can't be only spaces, and spaces are **never** trimmed from a password. 8 is the minimum NIST (the US standards body) recommends for passwords people choose themselves. Customers can always choose longer.

- **Without it:** a 4-character password can be guessed in minutes by trying every combination.
- **Who it wrongly blocks:** people used to a short password or a 6-digit PIN, who now have to think of something longer on a phone keyboard.

### The two checkboxes

**Rule:** "I agree to the Terms and Privacy Notice" and "I am 18 or older" must both be ticked.

- **Without it:** there's no record that the customer agreed to how their data is used, and Tee might collect a child's data without a parent's consent (my understanding of the Nigeria Data Protection Act 2023).
- **Who it wrongly blocks:** Tee's real 17-year-old customers. They can still order by direct message.

## Category 3: format, in real time

### Email shape

**Rule:** spaces at either end are trimmed. Then it must be some characters, then `@`, then a domain containing a dot, with no spaces, up to 254 characters.

**When it's checked:**
- **Sign-up: as they type**, once they've started typing in the field. This is the first time Tee collects the address, and a mistake here means they can never reset their password. Some friction is fair at this point, like a bank being strict when you open an account.
- **Login and reset: only when they press the button.** They've already given Tee this address once. Telling someone it's "invalid" while they're halfway through typing their own email is just irritating.

- **Without it:** a reset link sent to `blessing@gmailcom` goes nowhere.
- **Who it wrongly blocks:** valid but unusual addresses, such as one at a domain with no dot. These are extremely rare for customers.

**Why the form checks the shape, not whether the address exists.** Even if the browser could ask "does this inbox exist?", a yes wouldn't prove the inbox belongs to the person typing it. Anyone can type someone else's real address. Only a code sent to that inbox, and typed back, proves ownership. So existence-checking would cost a request and prove nothing.

## Category 4: accessible errors

This is covered by the accessibility audit (`accessibility-audit.md`). I built the errors first and audited them afterwards, so the audit records what the form was really like before the fixes.
