# Interview answers (Task Three)

## Validation

### 1. Why is client-side validation not enough?

Because the client belongs to the user, not to me. My validation is JavaScript running in the customer's browser, and anything running there can be skipped, switched off or rewritten. I proved it on my own app. My sign-up form refuses a one-letter name, an email with no @ and a phone number that isn't a number. Then I sent exactly that straight to the endpoint with `curl`:

`{"fullName":"a","email":"not-an-email","phone":"x"}`

The server answered `201 Created`, and the database now holds customer #1, called "a", whom Tee can't reach or match to any order. None of my eight rules ran, because `curl` never loads the form.

Client-side validation is still worth having. It tells an honest customer about a mistake instantly, without a round trip, which matters on a phone on mobile data in Lagos. But it's a convenience for people who want to fill the form in correctly. It isn't protection from people who don't. Only checks on the server, which the user can't touch, can protect the data. That's what Task Four adds: the same rules repeated in the API, returning 400 before anything reaches the database.

### 2. What security checks belong in the frontend, and what must the server enforce regardless?

**The frontend can do anything that helps an honest user:**
- required-field messages,
- format hints, like the email shape,
- length limits that stop someone typing 300 characters by accident,
- my two-word name rule,
- showing the password rules as they type,
- not revealing sensitive shapes (no "6-digit code" hint).

None of these protect anything. They reduce mistakes and round trips.

**The server must enforce, whatever the frontend did:**
- every one of those same rules again,
- authentication (who is this?),
- authorisation (are they allowed to do this?),
- uniqueness, like one account per email,
- limits on size, like my database's int4 price column,
- rate limiting, so a script can't create hundreds of accounts,
- hashing passwords with a slow algorithm,
- recording consent with a timestamp.

My Task Three server enforces none of this. It only checks that the body is valid JSON, and the `curl` request proved it.

The rule I'd give a junior developer: **anything you would be embarrassed to see bypassed belongs on the server.** The frontend copy exists only so honest users find out sooner. My `lib/validation.ts` is written as pure functions with no browser code, so the server can import the same rules, and the two can't drift apart.

### 3. The user interface hides the delete button for non-administrators. Is that enough?

No. Hiding a button is presentation, not permission. The delete action is still an HTTP request to an endpoint. Anyone can send that request with `curl`, the browser's developer tools, or by replaying a request they saw an administrator's browser make. If the server doesn't check who is asking, it will happily delete.

It's the same mistake as my sign-up form, in a more dangerous place. My form "hid" bad data by refusing to submit it, and the server accepted bad data anyway when I went around the form. A hidden delete button is a locked display cabinet with the shop's back door open.

What's actually needed:
- the server identifies the user from their session,
- it checks their role before performing the delete, on every request,
- it returns 403 if they're not allowed,
- ideally, it logs the attempt.

Hiding the button is still good design, because people shouldn't be offered actions they can't take. But it's for the honest user's sake.

For Tee, this will matter in Task Four. She wants future helpers to see orders but not measurements or payments. That rule has to be enforced in the API that returns the data, not just by leaving those columns off the helper's screen.

### 4. What is the difference between validation, encoding and sanitisation?

**Validation** asks "is this acceptable?", and rejects the input if not. My rules are validation. A name needs two words, a phone must be `0` plus 10 digits or start with `+`, and anything else is refused with a message. Nothing is changed. The input passes or fails.

**Sanitisation** changes the input to make it acceptable. My `cleanPhone` function is a small sanitiser: it removes spaces, dashes and brackets, so `0803-123-4567` becomes `08031234567` before it's checked and sent. Trimming the spaces around an email is the same idea. The danger is changing something the user meant. That's why I never trim passwords, where a space can be deliberate.

**Encoding** doesn't change what the data *means*. It changes how it's *written* for a particular destination, so it can't be mistaken for code there. A customer's name shown on a web page is HTML-encoded, so `<script>` appears as text instead of running. Sent to the database, it goes as a parameter. Prisma does that, so the name can't become part of the SQL.

They work in order. Validate what you accept, sanitise only where you're sure of the intent, and encode at every output, for that output. You can't encode "in advance" for all destinations, which is why "sanitise everything in the browser" isn't a defence.

### 5. Why should you validate route parameters and query strings, not just the body?

Because every part of a request is user input, not just the form fields. The address bar is as editable as a text box.

My own app has an example. The account page reads `?form=signup`, `?form=login` or `?form=reset` from the query string. Someone can type `?form=admin`, or `?form=<script>…`, straight into the address bar. I handle it by treating anything that isn't one of the three known values as `login`. It's a whitelist, not trust. If I'd used that value to pick a file, build a database query or write into the page, an unchecked query string would be an attack route.

Route parameters are the same. A future `/orders/42` page reads `42` from the URL. Without checking, someone changes it to `/orders/43` and sees another customer's order and balance. That's an authorisation failure caused by trusting an ID. Or they send `/orders/abc`, or a huge number, and the database throws a 500. That's exactly the int4 overflow defect I already have in Task Two's price field.

So the same rule applies to the path, the query string, headers and cookies as to the body: decide what shape is allowed, reject everything else, and check the user is allowed to see whatever the ID points to.

## Architecture

### 6. Explain what a single page application is, and how you make one discoverable by search engines.

A single page application loads one page, then changes what's on screen with JavaScript, instead of asking the server for a new page on every click. My account page works this way. Sign-up, login and reset used to be three pages, `/signup`, `/login` and `/reset-password`, each a full request. Now they're one page, `/account`, and the form swaps instantly. I switched forms 12 times, and the server log showed only the first load. The address still changes (`?form=login`), using `history.pushState`, so Back works and the link can be shared.

The discoverability problem: a search engine that reads the raw HTML may see an empty shell, or the same content for every "page". I saw a small version of this myself. The raw HTML title is "Account | Tee's Wardrobe" for all three forms, because the per-form titles are only set in the browser after JavaScript runs.

**The fixes:**
- **Render on the server.** Next.js sends real HTML first, then makes it interactive, so crawlers get content without running JavaScript.
- **Give each piece of content its own real URL**, with server-side metadata: title, description and canonical link.
- **Keep a sitemap.**

For Tee, the account forms don't need to rank in search, so the single-page trade-off is fine there. Her product pages, if she adds a catalogue, should be separate server-rendered pages.

### 7. What are the advantages and disadvantages of a single page application against a multi-page application?

**Advantages, as I saw them:**
- **Speed after the first load.** Switching between my three account forms is instant, with no request. Before, the first login load took 986 ms on my own Mac, longer on a phone on mobile data.
- **Keeping state.** What the customer typed can survive a switch.
- **One address to remember.** I mistyped `/signin` and `/forgotpassword` myself while testing the old version, and got two 404s.

**Disadvantages:**
- **Search engines and link previews see less.** All three forms share one raw title.
- **Everyone downloads everything.** A customer who only wants to log in downloads the sign-up form too.
- **More JavaScript, and more ways to fail.** My form-switching links became buttons, which screen readers announce differently, and you can't right-click a button to open it in a new tab.
- **Accessibility needs extra work.** On a real page load, a screen reader announces the new page automatically. In an SPA you have to manage focus and announcements yourself, which my audit showed the agent hadn't done.

**When I'd use multiple pages:** when areas belong to different people with different permissions. Tee's order form stays separate from customer accounts, so each can be protected on its own, and a wrong query string can never show one in place of the other. Also, when each page needs its own search result, like a product catalogue.

## Accessibility

### 8. Can you explain the four principles of the Web Content Accessibility Guidelines, with examples from your own work?

WCAG's four principles spell **POUR**.

**Perceivable:** information must reach the user through a sense they have. My errors were red text and a red border. Someone with red-green colour blindness sees grey text with no warning. I added a caution icon before every error, so the signal doesn't depend on colour. In Task Two, I changed a link coloured 2.5:1 against the background to 16.35:1, because low contrast isn't perceivable either.

**Operable:** everything must work by keyboard. The "Terms and Privacy Notice" link sat inside the checkbox label, and Tab never reached it. I moved it out into its own link. I also kept the disabled Create account button in the tab order, using `aria-disabled` instead of `disabled`.

**Understandable:** people must be able to tell what's wrong and how to fix it. My messages say what to do in plain words, such as "Enter a number Tee can reach you on". Required fields are announced as "required".

**Robust:** it must work with assistive technology. The biggest failure in my audit: VoiceOver read nothing about six errors on screen. After linking each error with `aria-describedby` and `aria-invalid`, VoiceOver reads "Email address, Enter the email you'll log in with., edit text, required, invalid data".

### 9. Discuss the importance of semantic HTML in the context of accessibility.

Semantic HTML means using the element that *is* the thing: `<button>` for a button, `<label>` for a label, `<a>` for a link, `<h1>` for the main heading. Screen readers, keyboards and browsers understand those elements without any extra work. A `<div>` styled to look like a button is silent and unreachable by Tab, unless you rebuild everything the real button already does.

**From my audit:**
- Because my inputs had real `<label for=…>` elements, VoiceOver said "Phone number, edit text, telephone number field" straight away. Without labels, it would have said only "edit text", and a blind customer wouldn't know what to type.
- The show-password control is a real `<button type="button">`, so VoiceOver announced "Show password, button", and Space activates it.
- Semantics can also go wrong. The agent put a link *inside* the checkbox's label, and VoiceOver garbled it into "I agree to theand 1 more item". The fix was more correct structure: the label holds only the label, and the link sits next to it.

ARIA is for the gaps HTML can't express, like linking an error to its field, or announcing a count of problems. The first rule of ARIA is not to use it when a native element does the job. A real `<button>` beats `<div role="button">` every time, because keyboard focus, Enter and Space, and the announcement come for free and can't be forgotten.

## The engagement

### 10. Tell me about a time when you disagreed with what a customer wanted to build.

In Task One, Tee assumed her customers would rather have WhatsApp links than log in to an app, and that they often had poor mobile data. They were reasonable guesses, but they were hers. No customer had been interviewed.

My disagreement wasn't with Tee's goal. It was with building around an untested guess as if it were fact. If I'd designed everything for "customers hate logging in", I might have skipped accounts entirely. Then customers couldn't check their own balance, and the main question customers send her, "how much do I still owe?", would still have to go through Tee's notebook.

So I recorded both assumptions as **unconfirmed** in the business research, and kept the design able to go either way. In Task Three, I asked only for what she needs to match and reach a customer: name, email and phone. A customer who doesn't want an account can still order by direct message, as they do today.

I explained it to her in her terms: "If we're wrong about customers hating logins, we've built the wrong thing and you've paid for it. Let's ask three customers first." That's the pattern I'd use with any client. Agree on the outcome, be honest about which parts are evidence and which are guesses, and design the first version so a wrong guess is cheap.

### 11. How would you explain to a non-technical executive why their AI implementation is not performing as expected?

I'd start with what they see, not with the technology. Then I'd show one concrete failure, and the reason behind it in plain words.

From my own project: the AI agent built Tee's sign-up feature and reported "Everything checks out". It had even run 46 tests that passed. But it had never once saved a real account. When I tested it by actually sending a sign-up, every attempt failed, because one setup step was missing. And separately, its name rule rejected Yoruba names with tone marks, such as `Ọlá Adébáyọ̀`. That's exactly the customers Tee serves. Its tests only used names like "Blessing Okafor".

**To an executive, I'd say:** the AI produces work that *looks* finished, and reports on its own work confidently. It checks the cases it thought of, not the ones your customers will bring. So "the AI says it works" isn't evidence. Evidence is a real customer's action going all the way through, checked at the end, in the database.

**Then the fix:** define what success looks like in your business's terms, test with your real data (your customers' names, your currencies, your edge cases), and have a person verify the end result before trusting the report. It isn't that the AI is useless. It's fast, but it needs supervising, like a quick new hire.

## About my work

### 12. One of your validation rules wrongly blocks a category of legitimate user. Name the rule, name the users, and defend the trade-off or say you got it wrong.

**The rule:** a full name must be at least two words.

**Who it wrongly blocks:** people who genuinely have only one name. There are many, in Nigeria and around the world. It also blocks anyone who writes an initial with a full stop, like "J. Okafor".

**Why I keep it:** the reason comes from Tee's real work, not from class. She matches each account to the person in her notebook and her WhatsApp chats, and her customers come largely from her church. "Blessing" alone could be three different women. A first name can't be matched to an order, so it defeats what the app is for: knowing whose balance is whose. It also stops bots and agents filling the field with "a" or "test".

**I accept the cost knowingly**, and I've limited the damage:
- A single-name customer isn't locked out of Tee's business. They can still order by direct message, as everyone does today.
- The rule accepts any letters, including tone-marked Yoruba and Igbo names. The agent's first version didn't. It rejected `Ọlá Adébáyọ̀`, and I caught and fixed it.

**What I'd change with more time:** an "I only have one name" option that asks for a second identifier Tee can match instead, like the name she has them saved under in WhatsApp. That keeps the matching, without pretending everyone has a surname.

### 13. You sent a request directly to your own endpoint. Say exactly what happened and what it tells you about the eight rules you spent two days writing.

I ran this command:

`curl -i -X POST http://localhost:3000/api/signup -H "Content-Type: application/json" -d '{"fullName":"a","email":"not-an-email","phone":"x","password":" "}'`

**My first attempt returned 500,** which looked like the server refusing junk. It wasn't. The agent's database migration had never regenerated the Prisma client, so every sign-up crashed, including perfectly valid ones from the form. The agent had reported "Everything checks out". After `npx prisma generate` and a restart, the same request returned `201 Created {"id":1}`. In the database, there was a customer named `a`, with email `not-an-email` and phone `x`.

**What it tells me about my eight rules:** none of them ran. Not the two-word name, the email shape, the phone format, the password length, either checkbox, the required fields, or the real-time check. They live in the browser, and `curl` doesn't use the browser. They're real work, and they're useful: they help an honest customer fix mistakes before pressing the button. But they protect nothing. All the actual protection is still missing, on the server.

**Two lessons:**
- **Test by actually writing data, and check the database.** A 500 can look like security when it's really a broken app.
- **The server has to enforce every rule itself.** Task Four does that, reusing the same `lib/validation.ts` functions. Then I'll send this exact request again and expect a 400.

### 14. Wrong-answer analysis

*The candidate says:* "I use strong client-side validation with regex on every field, disable the submit button until everything is valid, and sanitise all inputs in the browser before sending them. That covers the main injection and bad-data risks."

**Useless as security:** all three measures. Regex in the browser, a disabled button, and browser-side sanitising all run on the attacker's machine. My own `curl` request skipped all of them and saved a customer named "a". An attacker never meets the regex or the button.

**Actively misleading:**
- **"Sanitise all inputs in the browser"** suggests the server can then trust what arrives. It can't, because the server receives whatever is sent, sanitised or not. Believing it can is how injection gets through.
- **"Disable the submit button"** is not only no protection. Done with the `disabled` attribute, it removes the button from the tab order, so screen reader users are left with no explanation. That's the PDF's Hauwa case. My version uses `aria-disabled`, and explains itself.

**What they've confused:**
- **Validation with security.** Validation helps honest users. Security has to hold against dishonest ones, and only the server can do that.
- **Sanitising with encoding.** Injection is stopped by encoding at the point of output (HTML-escaping on the page, parameterised queries in the database), not by cleaning input once, in advance, somewhere the attacker controls.

**The correct statement:** client-side checks are for user experience. The server validates every field again, uses parameterised queries, encodes on output, authenticates and authorises, and rate-limits.

## The extra question: what is user enumeration, and how do error messages contribute to it?

User enumeration is finding out which accounts exist, without logging in to any of them. It doesn't break in by itself. It hands the attacker a list of real targets.

**Error messages are the most common cause:**
- A login that says "no account with that email" for one address, and "wrong password" for another, tells the attacker which emails are real customers.
- A password reset that says "we've sent you a link" for real accounts, but "email not found" for others, does the same.
- So does a sign-up page that says "this email is already registered".
- Even the *time* a response takes can leak it, if real accounts take longer to check.

**For Tee, that list is valuable.** Her customer list is her business. With it, an attacker can try common passwords against only real accounts, or send her customers convincing fake "Tee's Wardrobe payment" messages. In my understanding of the Nigeria Data Protection Act, that could also be a disclosure of personal data.

**My app already has the seed of this problem.** Customer email is unique in the database, so a duplicate sign-up fails differently from a new one.

**The fix, planned for Task Four:**
- Login always says "Incorrect email or password".
- Reset always says "If that email has an account, we've sent a link".
- Sign-up with an existing email replies "check your email to continue", and tells the real owner by email.

The cost is a slightly harder time for a customer who's forgotten which email they used, which I accept (`enumeration.md`).
