# First page load

Measured on my Mac on 30 October 2026 at 01:24 WAT ([`03-server-start.txt`](../evidence/03-server-start.txt), [`04-first-load.txt`](../evidence/04-first-load.txt)).

| | First load | Reload |
|---|---:|---:|
| Status | 200 | 200 |
| Total time (curl) | **2,459 ms** | **60 ms** |
| Server's own timing | 2,450 ms | 55 ms |

The server was `next dev` on port 3000, started with `npm run dev`. It reported "Ready in 2.4s" before any page was requested.

## How far from a reasonable target

The class target is around **10 ms**. My first load is about **245 times** slower than that; my reload (60 ms) is about 6 times slower.

## Where the time went

**Measured:**

- **Compiling: about 2,100 ms.** The server log says `Compiled / in 2.1s (671 modules)`. In development mode, Next.js doesn't build a page until someone first asks for it, then it compiles everything that page needs: React, Next.js itself and my code, 671 files in total.
- **Everything else on the server: about 350 ms.** The server reported 2,450 ms in total, so roughly 350 ms is left after compiling. I haven't measured what that is.
- **Network: about 9 ms.** curl's total (2,459 ms) minus the server's own figure (2,450 ms) is the trip between curl and the server on the same machine.

**Guessing:** the 350 ms is probably the server running my page's code and turning it into HTML. I'd need a profiler to prove that.

**Why the reload is fast:** the compiled page stays in memory, so the second request skips the 2.1 seconds of compiling.

## The first-ever load was much slower

When the agent first ran the server on 28 October, the first load took **33,919 ms**, with `Compiled / in 29.5s` ([agent's record](../evidence/agent-run/04-first-load.txt)). My run was 14 times faster because Next.js had saved its compiled work in the `.next` folder from that earlier run, so mine wasn't truly starting from nothing.

That means "first load" depends on whether `.next` exists. Deleting it would reproduce the slow cold start.

## What would close the gap

None of this would happen in production. `next build` compiles everything once, before deployment, so real users never wait for compiling. I haven't run a production build and measured it yet, so I can't say what its first load would be.
