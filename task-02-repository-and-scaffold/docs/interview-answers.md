# Interview defence (Task Two)

Fifteen answers, about 200 words each, using my own project where I can.

## Version control

### 1. Git Flow vs trunk-based development, and why many teams moved to trunk-based

Git Flow uses several long-lived branches: `main` for releases, `develop` for ongoing work, plus feature, release and hotfix branches. Work can sit on `develop` for weeks before it's released. That gives a clear structure, but branches drift apart, so merges get large and painful, and feedback is slow.

Trunk-based development keeps one main line (the trunk). Everyone works on short-lived branches, often lasting less than a day, and merges back quickly, usually protected by automated tests. Unfinished features can be hidden behind feature flags instead of living on a separate branch.

Teams moved towards trunk-based because small, frequent merges cause fewer conflicts, problems are found while the change is still fresh, and it suits continuous deployment, where `main` goes live many times a day.

My project works closer to trunk-based. `feature/order-form` lived for one afternoon: five commits, then pull request #1 merged it into `main` with a merge commit (`bef6c23`). `docs/working-tree` lived for under an hour before pull request #2. I don't have automated tests yet, which trunk-based relies on, so for me the pull request review is the safety step.

### 2. What `git push --force` does, and why `--force-with-lease` is safer

A normal `git push` refuses if GitHub has commits my Mac doesn't. That refusal protects other people's work. `git push --force` overrides it and makes GitHub's branch match my Mac exactly. If a teammate pushed a commit in the meantime, it disappears from GitHub, and they may not notice until much later.

`--force-with-lease` adds a condition: "force it, but only if GitHub's branch is still where I last saw it." Git remembers where the remote branch was when I last fetched. If someone has pushed since, the lease doesn't match and the push is refused, so I can't wipe out work I've never seen.

Force pushing is sometimes needed: after tidying my own unshared branch with a rebase, or when removing a leaked secret from history. Even then, the lease version is the one to use.

I haven't force pushed in this project. When my commit `2ec4ebf` had a message that promised a screenshot it didn't contain, I didn't amend and force push to hide it; I added a new commit (`16ae6b4`). The history shows what really happened, and nothing shared was rewritten.

### 3. Why rewriting history (rebase, amend, force push) is dangerous on a shared branch

Every commit has an ID calculated from its contents and its parent. Rebasing or amending doesn't edit commits; it makes new ones with new IDs and abandons the old ones.

On my own unshared branch, that's harmless: nobody else has the old commits. On a shared branch, other people have already built on them. After a force push, their copy of the branch no longer matches GitHub. When they pull, Git sees two different histories. They can end up with duplicated commits, painful conflicts, or work that silently disappears if they force push in turn.

It also damages trust in the history. A reviewer who commented on a commit finds it no longer exists, and evidence that pointed to a commit ID now points at nothing.

My rule follows the "can't undo quietly" mark on my hand-drawn working tree: before `git push`, rewriting is a private decision; after it, history is shared and I add new commits instead. For example, I fixed a misleading commit message with a follow-up commit rather than `--amend`, and I merged my pull requests with merge commits rather than rebasing them.

### 4. `git merge` vs `git rebase`, and when to pick each

Both bring the work from one branch into another, but they record it differently.

A **merge** keeps every original commit and adds one new merge commit with two parents, joining the two lines. The history shows exactly what happened, including that a branch existed. My log shows this: `bef6c23 Merge pull request #1 from …/feature/order-form` with the branch's five commits beside it.

A **rebase** takes my branch's commits and replays them on top of the latest `main` as new copies with new IDs. The result is one straight line, as if I'd started my work later. It's tidier to read, but it rewrites the commits.

When I'd pick each:
- **Rebase** my own branch, before anyone else has it, to catch up with `main` and keep my pull request clean.
- **Merge** anything shared, and when bringing a finished branch into `main`, because it doesn't rewrite what others have seen.

I chose merge commits for both pull requests, partly for safety and partly because Step 9 asks me to prove my branch structure with a `git log --graph`. A rebase or squash would have flattened that structure away.

### 5. What causes a merge conflict, and what's happening in the file

A conflict happens when two branches change **the same lines of the same file** in different ways, or one branch edits a file the other deleted. Git can combine changes to different parts of a file automatically, but when both sides changed the same lines it can't know which version is right, so it stops and asks.

Git writes both versions into the file between markers:

```
<<<<<<< HEAD
const price = 20000;
=======
const price = 25000;
>>>>>>> feature/order-form
```

Everything between `<<<<<<<` and `=======` is the version on the branch I'm on (HEAD). Everything between `=======` and `>>>>>>>` is the incoming branch's version. The file is left in this broken state on purpose: it won't run until a person decides.

To resolve it, I read both versions, keep one or combine them, delete all three marker lines, save, then `git add` the file and `git commit` to finish the merge.

I haven't hit a conflict yet, because my branches were short and touched different files. That's the practical way to avoid them: small branches, merged quickly, and pulling `main` often so you're never far behind.

### 6. Working directory vs staging area vs repository

They're three stages a change passes through before it's saved in history.

The **working directory** is the files as they are on my disk right now, including unfinished edits. Git notices changes here but hasn't saved anything.

The **staging area** is the list of changes I've chosen for the next commit. `git add` puts a change there. It's like an outbox: I decide what goes in this snapshot and what waits.

The **repository** (the `.git` folder) holds the commits: saved snapshots with messages. `git commit` takes everything in the staging area and saves it as one commit. Only my Mac has it until I `git push`.

The staging area is what makes clean commits possible. On 30 October my working directory had two changed files: my 13-to-14 tone fix in `colour-roles.md`, and an old agent report, `checkpoint-report.md`. I staged only `colour-roles.md` and committed it as "Correct the standard tone count to 14". The report stayed in my working directory, untracked, never committed.

`git status` shows all three at once: what's changed, what's staged, and whether my branch is ahead of GitHub. I run it before every commit, to check the message matches what's actually staged and that `.env` isn't in the list.

### 7. What branch protection is, and what it typically enforces

Branch protection is a set of rules on GitHub that guard an important branch, usually `main`, because it's the branch that deploys.

It typically enforces:
- **No direct pushes:** every change has to come through a pull request.
- **Required reviews:** at least one other person must approve before merging.
- **Required status checks:** automated tests and builds must pass first.
- **Up to date with main:** the branch must include the latest `main`, so it was tested against what it will actually join.
- **No force pushes and no deletion** of the protected branch.
- Sometimes signed commits, or only certain people allowed to merge.

The point is that no single mistake, or single person, can put something broken in front of customers. It turns "please be careful" into a rule.

My repository doesn't have branch protection switched on: I work alone, so I couldn't get a second reviewer anyway. But I've followed the habit it enforces. After my first push I left `main`, and every change since has come in through a pull request (#1 and #2) with a written description, which I checked in the "Files changed" tab before merging. Before Tee's site is deployed, I'd switch on "require a pull request" and "no force pushes" at minimum.

## The role and the engagement

### 8. A technical project you built end to end

Tee's Wardrobe is an order system for a one-person clothing business in Nigeria. Tee was keeping orders across a paper notebook and WhatsApp chats, and the one thing that must work is recording an order reliably, including whether delivery has been quoted.

I started with a written business brief, then built a design system in Figma: Tee's sea-green brand colour (`#32B1AA`), which I had to pin into the palette because the Material plugin replaced it, an 18-tone palette, colour roles checked against WCAG contrast, a 15-style type scale and brand-tinted shadows. I exported the tokens as JSON and had an agent convert them to CSS variables, then checked it actually used them.

Then I scaffolded a Next.js app from those context files, recorded the agent's plan before approving it, and deliberately broke the server three ways (nested folder, port conflict, 404) and recovered.

The core was the first real database write: a new-order form saving to PostgreSQL through Prisma. I proved it with logs, 201 responses and the rows in Prisma Studio, then switched the database off and proved the form shows an honest error instead of a false success. Everything went through pull requests, and I've documented the defects I know about.

### 9. A time something you built broke in production

I haven't deployed to real users yet, so I'll answer with the closest real case, and how I'd handle it.

**What happened:** while reproducing a "nested folder" problem, I made a project folder inside my Task Two folder and ran `npm run dev` from it, expecting an error. Instead, it started a server.

**How I noticed:** the output said `tees-wardrobe-app@0.1.0 dev`, which was the name of my *real* app, not the copy.

**What I checked:** npm, when it can't find `package.json` where you are, searches the parent folders and uses the first one it finds. So it had silently run the wrong project. In a real codebase you'd be editing one app while testing another, with no warning. That's worse than an error.

**What I changed:** I moved the test to the repository root, where nothing is above it, got the real `ENOENT` error, and documented both fixes in `nested-folder.md`.

In production I'd follow the same shape, in order: protect users first (roll back or revert), then find the cause from logs rather than guesses, fix it on a branch, and write up what happened so it doesn't repeat.

### 10. How you learn a new platform or codebase quickly

I start with what the codebase says about itself: the README, the `package.json` scripts, and the folder structure. Then I run it before changing anything, because running it shows me what's really there. On my own scaffold, running it showed me the agent's README described a different run from mine.

Next I trace one real path end to end. For the order form: the page in `app/orders/new/page.tsx` sends a request to `app/api/orders/route.ts`, which uses `lib/prisma.ts` to write to the `Order` table defined in `prisma/schema.prisma`. One complete path teaches more than skimming every file.

Then I make one small, safe change on a branch and watch what happens.

I use AI agents to explain unfamiliar parts, but I check what they tell me against the files. Agents can be confidently wrong. The agent that scaffolded my app installed mismatched Prisma versions, and another wrote documentation claiming spacing tokens were used when they weren't. I asked agents to plan first, in read-only mode, and reviewed the plan before approving.

Finally, I write down what I've learned as I go. My study guide and defects list are partly that: a map I'll need again.

### 11. Code that is correct vs code that is complete

**Correct** code does what it's meant to for the cases it handles. **Complete** code also handles everything it will meet in real use: bad input, failures, limits, security, and the documentation someone needs to run and change it.

My order route is correct for normal use: it checks each field, saves the order, returns 201 with the new id, and shows an honest error when the database is down. I proved that with three saved orders and a deliberate failure.

But it isn't complete:
- A price above 2,147,483,647 passes the check, then the database rejects it, so the user gets a 500 instead of a clear 400.
- Anyone who can reach the app can create orders: there's no login.
- A fresh clone fails at `npm install` if `.env` doesn't exist yet.
- `npm audit` lists three security advisories.

All of these are in `defects.md` with file and line.

The difference matters because correct code passes the demo. Complete code survives real people. A demo uses sensible values in the right order; Tee will typo an extra zero at the end of a long day. Knowing exactly where my code stops being complete is, I think, more useful than claiming it's finished.

### 12. Designing software for a customer who'll maintain it after you leave

Tee works alone and isn't technical, and any developer she hires later will be new to the code. So I design for the person who arrives with no context.

**One place to change things.** Colours, type and spacing are design tokens. Changing the brand colour means changing one primitive, not hunting through files.

**Plain documentation that explains why.** My docs record decisions and their limits, like why the palette has 18 tones, or why a blank delivery fee is stored as empty and never 0.

**A README a stranger can follow.** Step 7 has someone who's never seen the project follow it, and I record where they got stuck. My own testing already found one trap: `npm install` fails if `.env` doesn't exist yet.

**Safe defaults.** `.env` is ignored, `.env.example` shows what's needed, Prisma versions are pinned exactly, and a script regenerates the database client on install.

**Honest limits.** `defects.md` lists what's broken, so nobody discovers it the hard way.

**Boring choices.** Common tools (Next.js, PostgreSQL, Prisma), so help is easy to find.

The test I use: could someone fix a typo in the order form without calling me?

## About my work

### 13. Where did your first-load time go?

My first load took **2,459 ms** (curl, 30 October), and the reload took **60 ms**, both returning 200. The class target is nearer 10 ms.

**Measured:**
- **Compiling: about 2,100 ms.** The server log says `Compiled / in 2.1s (671 modules)`. In development, Next.js only builds a page when someone first asks for it, then compiles everything that page needs.
- **Network: about 9 ms.** curl measured 2,459 ms and the server reported 2,450 ms, so the gap is the trip on my own machine.

**Guessed:**
- **About 350 ms** is left after compiling, within the server's 2,450 ms. I think it's the server running my page's code and producing the HTML, but I didn't attach a profiler, so I can't prove it.

**Why the reload is fast:** the compiled page stays in memory, so the 2.1 seconds of compiling is skipped.

**A comparison that taught me something:** the agent's first-ever load was 33,919 ms, compiling for 29.5 seconds. Mine was faster because the `.next` cache from that run already existed. So "first load" depends on the cache, and I'd delete `.next` to measure a true cold start.

Real users wouldn't see compile time: `next build` compiles before deployment. I haven't measured a production build yet.

### 14. Your app reported success while saving nothing: the mechanism, and the 30-second check

A false success happens when the screen decides "it worked" without proof from the database. The usual mechanisms:
- the form shows a success message as soon as the request is *sent*, not when the server *confirms* it;
- the server catches a database error but still replies 200;
- the app is connected to no database at all (like the class example, where Prisma Studio said "no database URL found"), and nothing checks.

In a demo it looks identical either way: same green message, same smooth flow.

I designed against it. My form only shows "Order saved (#id)" when the server replies **201** *and* sends back the new row's id, and the server only sends 201 after `prisma.order.create` finishes. Then I tested the inverse: I stopped PostgreSQL and submitted. The page showed a red "Could not save the order", Network showed 500, the log showed `write failed: PrismaClientKnownRequestError`, and the table still had 4 rows.

**The 30-second check:** submit once, then look behind the screen. Is there a `201` for the POST in the server log or the Network tab? Then query the table for the newest row and check its `createdAt` matches the time you clicked:

`psql tees_wardrobe -c 'SELECT id, "createdAt" FROM "Order" ORDER BY id DESC LIMIT 1;'`

### 15. Wrong-answer analysis: "If the dashboard loads, the backend is working"

**What's wrong:** reaching the dashboard proves the *front end* moved to another page. It doesn't prove anything was saved. A redirect can happen in the browser regardless of what the server replied, or the server can reply "success" after silently failing. That's exactly the scenario in the brief: weeks of visitors seeing a success screen, and not one 201 in the logs.

**What it misses:**
- whether the request returned 201 (created), or 200, 401 or 500;
- whether a row exists in the database, with the right values;
- what happens when the database is unreachable, which is when false successes appear;
- whether a second, different signup also works, as opposed to one cached or hard-coded account.

**What I'd do instead**, as I did for my order form:
1. Watch the Network tab and server log for the request: name the status code, and expect 201.
2. Open the database inspector and find the new row, with its id and timestamp.
3. Submit again with different values, minutes later, and check for a second row.
4. Break the connection on purpose and confirm the user sees an error, not success.

The principle: trust the database and the logs, not the screen.

## Also ready: you committed a secret to a public repository

First, rotate it: change the password or key immediately and treat the old one as stolen, because deleting the file doesn't remove it from history and bots scan public repos within minutes. Then remove it from history with a history-rewriting tool, force push, and ask collaborators to re-clone. Check the service's logs for misuse. Finally, prevent a repeat: `.env` in `.gitignore`, only `.env.example` committed, `git status` before every commit. In my repo, `git check-ignore -v .env` confirms it's ignored, and a search of the full history finds my connection string zero times.
