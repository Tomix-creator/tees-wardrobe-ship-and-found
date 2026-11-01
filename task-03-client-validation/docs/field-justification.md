# Field justification

Every field on the account forms, asked three questions: **why is it needed, what does Tee do with it, and what happens if the customer gets it wrong?** A field that fails all three comes out.

My sources for what Tee needs are the Task One owner interview and clarifications (`task-01-design-system/docs/business-research.md`). Customers themselves haven't been interviewed, so anything about what customers want is Tee's guess, and I say so where it matters.

## Sign-up form

| Field | Why it's needed | What Tee does with it | If they get it wrong | Decision |
|---|---|---|---|---|
| **Full name** | Tee has to match an account to the person in her notebook and WhatsApp chats | Finds their orders, and greets them by name when an outfit is ready | Their orders can't be matched to their account, or they're matched to someone else with a similar name | **Keep, required** |
| **Email** | To log in, and to send a reset link when they forget their password | Nothing else. Tee doesn't email customers; she talks to them by direct message | They can't reset their password, and a typo could send someone else's reset link to a stranger | **Keep, required** |
| **Phone number** | Customers find Tee and order "through direct messages", and her records live in WhatsApp chats | Tells them their outfit is ready, agrees delivery, and confirms payments. "Is my outfit ready?" is customers' second most common question | Tee can't reach them, and the outfit sits uncollected. A wrong number means she messages a stranger about someone's order | **Keep, now required** (the agent made it optional). Accepts Nigerian numbers (`080…`, `+234…`) **and** overseas numbers, because most customers are Nigerian but some order from abroad now and then |
| **Password** | Protects the customer's order history and balance | Nothing. Tee never sees it, and it's never stored yet (hashing comes in Task Four) | They're locked out until they reset it | **Keep, required** |
| **Confirm password** | To catch a typo in the password | Nothing | It doubles typing on a phone for every customer, to catch a mistake that "show password" catches too | **Removed.** Replaced with a show-password toggle (Step 7) |
| **I agree to the Terms and Privacy Notice** (new) | Tee collects personal data, and customers send her money | Records that the customer agreed to how their data is used | No account can be made without it, which is the point | **Added, required** |
| **I am 18 or older** (new) | Tee said her customers are "17 and over". In my understanding of the Nigeria Data Protection Act 2023, collecting a child's data needs a parent's or guardian's consent | Avoids collecting a child's data without that consent | A 17-year-old who ticks it anyway: the box records what they said, it doesn't prove it | **Added, required.** It wrongly blocks Tee's real 17-year-old customers from making an account. They can still order by direct message as they do today, so they don't lose her service |

## Fields deliberately not asked for

| Field | Why it's not on the form |
|---|---|
| **Body measurements** | Only needed for made-to-order pieces, not ready-made ones. Tee wants measurements limited to herself. Asking every customer at sign-up would collect sensitive data that most will never need |
| **Delivery address** | Delivery is quoted per destination, per order, and some customers collect in person. It belongs on an order, not the account |
| **Date of birth** | The 18+ checkbox answers the only question Tee has about age. A date of birth collects more personal data to learn the same thing, and can be faked just as easily |
| **Username** | Customers already have a name and an email. A third identifier is one more thing to forget |

## Login form

| Field | Why | If wrong | Decision |
|---|---|---|---|
| **Email** | Identifies the account | When login is built (Task Four), the reply must be "incorrect details", without saying which part was wrong (see `enumeration.md`). For now it says "Not built yet" | Keep |
| **Password** | Proves it's them | Same message | Keep |

## Reset form

| Field | Why | If wrong | Decision |
|---|---|---|---|
| **Email** | Where to send the reset link | When reset is built, it must give the same reply whether or not the email has an account, so it can't be used to check who Tee's customers are. For now it says "Not built yet" | Keep |

## Decoration removed

- **The drop shadow under each form card** (`className="shadow-soft"`). It does nothing a customer can use. On a phone, a raised card looks like something to tap, but tapping it does nothing. The thin border stays, because it groups the fields.
- **"(optional)" next to Phone number.** Phone is now required.
