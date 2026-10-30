# Diagnosing the 404

On 30 October 2026 I broke the home page on purpose by renaming `app/page.tsx` to `app/index.tsx`, then worked out the cause myself before asking for any help.

Evidence: [`09-404-error.txt`](../evidence/09-404-error.txt) (broken, 01:40 WAT) and [`10-404-resolved.txt`](../evidence/10-404-resolved.txt) (fixed, 01:45 WAT).

## What happened

Requesting `http://localhost:3000/` returned **HTTP 404** in **1.78 seconds**. In the browser, the home page was gone.

## What I checked, in order

1. **The status code.** I got 404 instead of "connection refused". That meant my server was working; it's just that what was asked for wasn't available to be delivered. So the problem wasn't the server being down.
2. **The server's log (Terminal 1).** It showed `GET / 404`, which means the server registered that I asked for the home page, but it didn't have it. So the request really reached the server, and the server itself decided there was nothing to show.
3. **The files.** I ran `ls app` to see what's in the folder. It showed `index.tsx` but no `page.tsx`. Next.js only treats a file named exactly `page.tsx` as a page, so with the wrong name the home page didn't exist as far as the server was concerned. That's why `ls app` mattered: it showed me why I got the 404.

## The fix

I renamed it back to `page.tsx` and asked again. The response was **HTTP 200** in **0.08 seconds**, and the page loaded on localhost.

## Why the order matters

Each check ruled something out before I looked deeper: first whether the server was alive, then whether it received the request, then what was wrong with the files.
