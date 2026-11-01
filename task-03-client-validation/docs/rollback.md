# Rolling back without hallucination

## The change I regretted

Commit `0e848a7` made two changes on purpose, so I could capture them:
- the phone field became `type="number"`, and
- the Create account button was hidden until the form was valid.

Both were worse (`evidence/09-number-input-annoying.png`, `13-button-hidden-version.png`).

## How I rolled it back

1. I listed the commits with `git log --oneline -8`.
2. I picked the exact ID, `0e848a7`.
3. I ran `git revert` on that ID.

The full output is in `evidence/17-commit-list-and-rollback.txt`.

`git revert` adds a **new** commit (`96d88cd`) that does the opposite of the one named. It deletes nothing, so the history keeps both the mistake and its undo.

One complication: `0e848a7` also added the two evidence screenshots, and a plain revert would have deleted them. So I reverted without committing, restored the two screenshots from that commit, and then committed the undo.

My first attempt used a placeholder ID, `ABC1234`, that I'd forgotten to replace. Git refused: `fatal: bad revision`. Nothing changed.

## Why naming the ID is safer than describing the change

A commit ID points at exactly one set of changes, and if I get it wrong, Git refuses instead of guessing. My mistyped placeholder proved that. "Undo the last two versions" asks an agent to *guess* which changes I meant, and with the history moving under it, it can confidently undo the wrong thing, including work I wanted to keep.
