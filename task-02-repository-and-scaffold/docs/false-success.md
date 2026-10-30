# First database write, and the false success it avoids

Evidence: `11-write-succeeded-logs.txt`, `11a`–`11c` (201 screenshots), `12-database-rows.txt` and `.png`, `13-write-failed-logs.txt`, `13a-first-attempt-wrong-tab.txt`, `13b-network-500.png`, `13c-rows-after-failure.txt`. All recorded on 30 October 2026.

## What a false success is

The screen says "Order saved", but nothing reached the database. For Tee that's the worst kind of bug: she thinks an order is recorded, the customer thinks so too, and nobody finds out until the garment is due.

## How the form avoids it

The page only shows "Order saved (#id)" when the server replies **201** *and* sends back the new row's id (`app/orders/new/page.tsx`). The server only replies 201 after `prisma.order.create` has finished (`app/api/orders/route.ts`). Anything else shows the error in red.

## Proof it saves

| Order | Server log | Network | Database |
|---|---|---|---|
| #1 | `write succeeded id=1`, 201 in 1503 ms | `11a` | row 1, 12:04:02 GMT, fee 20000 |
| #2 | `write succeeded id=2`, 201 in 197 ms | `11b` | row 2, 12:11:32 GMT, fee 21000 |
| #3 | `write succeeded id=3`, 201 in 932 ms | `11c` | row 3, 12:27:46 GMT, fee **empty** |

Order 3 had a blank delivery fee. The database stored it as empty, not 0, so "awaiting a quote" can't turn into "free delivery".

Order 1 was slower because Next.js compiled the API route on first use (910 ms).

## Proof it doesn't lie

1. I started the server and switched PostgreSQL off with `brew services stop postgresql@17`.
2. I submitted "femi test 2 · agbada · 50000 · 2500".
3. The page showed **"Could not save the order"** in red. The Network tab showed **500** (`13b`). The log showed `[orders] write failed: PrismaClientKnownRequestError`, the error name only, with no customer details or connection string.
4. I switched PostgreSQL back on and queried the table (`13c`): still 4 rows, no "femi test 2".

## How a demo reviewer would have been fooled

In a demo you see the screen, not the database. If the form had shown "Order saved" straight after clicking, without waiting for the server, the demo would look identical whether the database worked or not: same green message, same smooth flow. A reviewer clicking through would sign it off.

What would give it away is only behind the screen:
- the server log would show no `201` (a `500`, or no `POST /api/orders` at all);
- the table would have no new row.

That's why the evidence here is the log and the table, not the page. I broke the connection by stopping PostgreSQL, which is the same as pointing the URL at nothing: the app had no database to talk to.

## The 30-second check

Submit an order, then look in the database itself, not the screen:

```bash
psql tees_wardrobe -c 'SELECT id, "createdAt" FROM "Order" ORDER BY id DESC LIMIT 1;'
```

If the newest row's time matches when you clicked Save, it really saved.

## My first attempt went wrong

I typed the stop command into the tab where the server was running. A busy terminal doesn't run new commands, so the database stayed on and order #4 ("femi test") really saved. I kept that log as `13a-first-attempt-wrong-tab.txt` and redid the test in a free tab.

## What this doesn't prove

- It tests one failure: the database being off. A slow database, or a failure *after* the save but before the reply, isn't tested. In that case the order could be saved while the page shows an error, which is the opposite risk: Tee might enter it twice.
- A price too big for the database column (e.g. 99999999999) gets a 500 instead of a clear 400 message.
