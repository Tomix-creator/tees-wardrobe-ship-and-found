# README test on a real person

## Who and when

- **Tester:** a friend, testing remotely on their own Mac. They had never set up this project and had no help from me while it ran. Name not recorded, and their Mac username is blacked out in the screenshots.
- **Date and time:** 1 November 2026. Their terminal logs are stamped 19:50 and 19:54 UTC (20:50 and 20:54 Lagos time). They sent me a short video and a photo of their screen at about 21:13.
- **Their computer:** a MacBook Pro. Homebrew and PostgreSQL 17 worked. npm was version 11.20.0.
- **What I told them:** where the README was, to follow only the README, and to send voice notes and screenshots of anything that went wrong. I didn't explain the steps.

**Before the test started:** they told me they were stuck and didn't know how to start. That's finding #1. The README assumes the reader already knows to open the Terminal app and paste commands one at a time.

## What happened, step by step

From their video (`evidence/21-readme-test-video-still.jpg`) and the photo of their screen (`evidence/21b-readme-test-npx-timeout.jpg`). The terminal text is copied exactly.

| README step | Got through it? | What they typed or saw (verbatim) | Did I help? |
|---|---|---|---|
| You need (Node, Git, PostgreSQL) | Yes | | No |
| 1. Clone and `cd` | Yes | Their prompt shows `task-02-repository-and-scaffold %` | No |
| 2. Start PostgreSQL, `createdb` | Yes | `Successfully started 'postgresql@17'` · `createdb tees_wardrobe` | No |
| 3. `.env` | **No, but they didn't know** | `cp .env.example .env`, then **`sed -i '' "s/[their username]/$(whoami)/" .env`**. They put their own username where `USER` belongs, so the command changed nothing and `.env` still says `USER` | No |
| 4. `npm install` | **No** | `npm error code ETIMEDOUT` … `npm error network This is a problem related to network connectivity.` | No |
| 4. `migrate deploy` | **No** | They carried on to `npx prisma migrate deploy`. It asked `Need to install the following packages: prisma@8.0.0-rc.29 Ok to proceed? (y)`, they typed `y`, and it failed again with `npm error code ETIMEDOUT` | No |
| 5. `npm run dev` | Not reached | | |
| 6. Check with `psql` | Not reached | | |

**Second attempt, after I sent them the corrected steps** (`evidence/21c-readme-test-second-attempt.jpg`, logs at 20:20 and 20:33 UTC, which is 21:20 and 21:33 Lagos time):

| Step | What they typed or saw (verbatim) |
|---|---|
| `npx prisma migrate deploy` (run first) | `Need to install the following packages: prisma@8.0.0-rc.29 Ok to proceed? (y) y`, then `npm error code ETIMEDOUT` |
| `npm install` | `npm error code ETIMEDOUT` … `npm error network This is a problem related to network connectivity.` |

They ran the migrate step before `npm install`, and said yes to Prisma 8 again. They were still reading the **old** README on GitHub (visible behind their terminal), because my fixes hadn't been pushed yet. Their connection to the npm registry failed both times, 13 minutes apart.

**Total time:** at least 4 minutes between the two logs, plus the time stuck before they told me. They said it had been "rolling like this" for a while.

## Where they got stuck

1. **Didn't know how to start.** The README begins with commands, and doesn't say where to type them.
2. **They edited the `sed` command.** The README said "replace `USER` with your Mac username… Or do both in one go", and then gave the command. The tester reasonably did both: they replaced `USER` *inside the command* with their username. The command then looked for their username in `.env`, found nothing, and silently did nothing. This would have failed later, at the database step, with an error far from its cause.
3. **`npm install` failed on their internet** (`ETIMEDOUT`), and nothing in the README told them to stop. This isn't a README fault, but the README let them carry on.
4. **The worst one: `npx` offered to download the wrong Prisma.** Because nothing had installed, `npx prisma` offered to fetch `prisma@8.0.0-rc.29`, a pre-release. That's the exact version mismatch I fixed in Task Two (`defects.md` §9). They said yes. It only failed because their internet was down. On a working connection, it would have run a different Prisma from the one the app is pinned to.

## What I changed in the README because of it

| Problem | Change | Commit |
|---|---|---|
| Edited the `sed` command | "Copy this command exactly, without changing any part of it", plus what `USER` and `$(whoami)` each mean, and a note that my tester hit this | This commit, on `docs/readme` |
| Carried on after `npm install` failed | "If `npm install` prints red `npm error` lines, stop here", plus what `ETIMEDOUT` means and what to do | Same |
| `npx` offered Prisma 8 | "If it asks `Need to install the following packages`, type `n`", plus why | Same |
| Didn't know how to start | **Not fixed yet.** It needs a short "open Terminal, paste one command at a time" opening. Noted as still open | |

## What this test doesn't prove

- **The tester never reached a running app.** Steps 5 and 6 are untested by anyone but me. I rehearsed them myself from a fresh clone on 31 October.
- **The three fixes haven't been re-tested on a person.** On the second attempt, the tester was still reading the old README on GitHub, and their internet blocked npm both times. Nobody but me has reached a running app from these steps.
- **One person, one type of computer** (macOS with Homebrew). Windows and Linux aren't covered at all.
