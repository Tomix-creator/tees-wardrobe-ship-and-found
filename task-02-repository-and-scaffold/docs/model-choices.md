# Model choices

Which model did which job in Task Two, what I noticed about the difference, and the time I chose wrong and had to switch.

The PDF sets up the contrast: Antigravity's agent reads, analyses and plans before it calls a tool, while OpenCode is built to write code quickly. **Analogy:** a surveyor and a builder. You want the surveyor for the foundations and the quick builder for the shelves.

## Which model for which job

| Job | Tool | Model | Why this one |
|---|---|---|---|
| Scaffold (Steps 1–5) | Antigravity | Gemini 3.8 Flash | The PDF says to scaffold in Antigravity. A scaffold is a lot of files at once, so I wanted an agent that would plan and wait for my approval first |
| Database form, planning (Step 6) | Antigravity, then OpenCode | Claude Opus, then DeepSeek V4.1 Flash | The step with the most rules: Prisma 7 setup, never 0 for an empty fee, success only on 201. I wanted the strongest planner |
| Database form, building (Step 6) | Antigravity | Gemini 3.8 Flash | The plan was already written and approved. The model only had to follow it |
| Information design (Step 10) | OpenCode, paid | DeepSeek V4.1 Flash | Small, clear changes to a few files, where speed matters more than deep planning |

## What I observed

**Gemini 3.8 Flash in Antigravity (scaffold).** It did plan first and waited for my approval, as the prompt asked. But two things needed fixing afterwards:
- It paired `prisma` 8, a pre-release, with `@prisma/client` 7, so the versions didn't match.
- It wrote numbers from its own test run into the README (port 3001, PID 83510, a 33,918 ms load). My evidence shows something different (`defects.md` §3).

Planning first didn't stop it from presenting its own run as if it were mine.

**Claude Opus in Antigravity (Step 6 plan).** It wrote a careful plan, but my Antigravity quota for Claude ran out before it built anything. I checked, and it had changed no files.

**DeepSeek V4.1 Flash in OpenCode, free (Step 6 plan).** I ran it in **plan** mode, which is read-only, so it couldn't touch files until I'd approved the plan. It asked to search the web, and I allowed it because Prisma 7 changed its setup and I didn't want it relying on old knowledge. Its plan met every rule in my prompt, and it was stricter than I asked: success shows only on a 201 *and* a numeric id. But the planning used about 39,000 tokens, and that used up OpenCode's free daily allowance before it could build anything.

**Gemini 3.8 Flash in Antigravity (Step 6 build).** Given the approved plan, it followed it exactly across 9 files, and `npx tsc --noEmit` reported 0 errors. Its one slip was design, not code: it coloured the "Back to home" link in the brand sea green, which is 2.5:1 on the page background and fails WCAG's 4.5:1. I changed it to the normal text colour (16.35:1).

**DeepSeek V4.1 Flash in OpenCode, paid (Step 10).** It's the same model that planned Step 6, but this time it was building, not planning. Fast, and when I asked which typography style the button used, every file and line number it gave was correct. But it made more small slips than the slower planners:
- It counted a 7-word tagline as 6.
- Its first plan used a 36px heading that would never break at 320px, so there would have been nothing for `clamp()` to fix.
- Its clamp shrank the font size but left the line spacing in fixed pixels, so the phone heading had huge gaps.
- It ran `npm run build` while my dev server was running, which crashed the server (`Cannot find module './719.js'`).

**The difference in one line:** the planning models were slower and used up quota, but their mistakes were rarer. The fast model was quick and cheap, but I had to look at the result in the browser, not just read its report. The build passed every time, including when the page looked wrong.

## The time I chose wrong and switched

For Step 6 I chose **Claude Opus in Antigravity**, because the database step had the most rules and a wrong move (for example a blank delivery fee saved as 0) would quietly lose information.

**What went wrong:** it was the most expensive choice, and my quota ran out after the plan, before any building. I'd picked the strongest model without thinking about whether I had enough allowance to finish the job with it.

**What I switched to, in order:**
1. **DeepSeek V4.1 Flash in OpenCode (free).** It re-did the plan in read-only mode, and the plan was good. Then OpenCode's free limit ran out too, because a long planning job is exactly what uses the most tokens.
2. **GLM-5.3-Flash in OpenCode (free).** Blocked by the same limit, which covers all of the free models together.
3. **Gemini 3.8 Flash in Antigravity.** I gave it DeepSeek's approved plan word for word and told it not to redesign anything. A fast model is fine at *following* a detailed plan, even if I wouldn't trust it to write one.

**What I'd do differently, and did for Step 10:**
- Match the model to the job *and* the budget. Plan with a strong model, build with a fast one.
- Don't run a long planning job on a free tier.
- For Step 10 I paid for DeepSeek V4.1 Flash in OpenCode, so a limit couldn't stop me halfway through.

## What stayed the same whichever model I used

- Plan first, in read-only mode where the tool had one, and build only after I'd read the plan.
- Check the files, not the report. Every slip above was caught by opening the file, running the page or checking the database. None of them was mentioned in the agent's own summary.
- Agents never ran `git`. Every commit and push is mine.
