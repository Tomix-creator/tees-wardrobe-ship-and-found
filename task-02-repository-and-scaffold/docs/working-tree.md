# The working tree

Drawing: [`evidence/14-working-tree-drawing.jpg`](../evidence/14-working-tree-drawing.jpg), drawn by hand on 30 October 2026.

## What the drawing shows

The top row is the pipeline my code travels along:

| Box | What it is | How code gets to the next box |
|---|---|---|
| My computer | The working directory, where I edit files | `git add` + `git commit` |
| Local Git store | The `.git` folder: my saved project history, only on my Mac | `git push` |
| GitHub | The online copy, which anyone with access can see | deploy |
| Production | The live site Tee's customers would use (planned, not deployed yet) | |

Two marks matter most:

- **Can't undo quietly: the push to GitHub.** Before I push, I can amend or delete commits and nobody is affected. After I push, GitHub and anyone who pulled have a copy, so undoing it means rewriting shared history with a force push, which everyone can see.
- **Visible to users: the deploy to production.** Until then, only people working on the code see a change.

The bottom half shows the branches. `main` is the line that would deploy. `feature/order-form` split off, got four commits, and was merged back through pull request #1 (merge commit `bef6c23`). `feature/information-design` is the next branch, for Step 10.

## What breaks when a tree has one branch

With only `main`, every commit lands on the line that deploys. There's nowhere to put work that isn't finished.

- **Half-finished work is mixed in with working code.** While I was building the order form, there was a stage where the code existed but the database table didn't. On `main`, that broken state would be the official version.
- **No review step.** A pull request only exists between two branches. With one branch, nobody (including me, a day later) looks at the change as a whole before it goes in.
- **Hard to back out one feature.** If the order form had to be removed, I'd be picking its commits out of a single line mixed with everything else. As a branch, it's one merge commit.
- **Experiments are expensive.** Trying an idea means it goes straight into the main line, so I'd stop trying things.

## Why it matters more after the first deployment

Before anything is deployed, `main` being broken only affects me. After the first deployment, `main` is what Tee's customers use:

- A half-finished commit on `main` becomes a broken page for a real customer.
- A bug like a false success would be losing real orders, not test ones.
- Fixing it is now public: I'd have to deploy a fix or revert it, and anyone who placed an order in between is affected.

A branch keeps unfinished work away from customers until it's been reviewed and merged on purpose. Before deployment that's good practice; after deployment it's what protects the business.
