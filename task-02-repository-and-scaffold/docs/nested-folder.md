# The nested folder, broken and fixed two ways

Evidence: [`05-nested-folder-error.txt`](../evidence/05-nested-folder-error.txt) (30 Oct, 02:01 WAT) and [`06-nested-folder-fixed.txt`](../evidence/06-nested-folder-fixed.txt) (02:10 WAT).

## The problem

An agent sometimes creates the project inside an extra sub-folder, e.g. `my-folder/tees-app/package.json`. You're standing in `my-folder/`, you run `npm run dev`, and npm can't find `package.json`, because it's one folder further in.

I recreated it with a throwaway copy of the app inside `disposable-nested/tees-app/`, so the real app was never touched. The folder is git-ignored.

## What I found first (it didn't fail)

My first attempt put `disposable-nested/` inside the Task Two folder. `npm run dev` from there **did not fail**: it printed `tees-wardrobe-app@0.1.0 dev` and started the **real** app.

When npm can't find `package.json` where you are, it searches the parent folders and uses the first one it finds. So a nested project inside another project silently runs the wrong project. In a real codebase that's worse than an error: you'd be editing one app while testing another, with no warning.

## The real error

I moved `disposable-nested/` to the repository root, which has no `package.json` above it, and ran `npm run dev` from it again:

```
npm error code ENOENT
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory,
  open '/Users/mac/Desktop/tee's wardrobe /disposable-nested/package.json'
```

ENOENT means "no such file or directory".

## Fix 1: tell the agent to rescaffold in place

I gave Antigravity this prompt:

```text
I am testing a "nested folder" problem for my bootcamp evidence. Work ONLY inside this folder:

  disposable-nested/   (at the repository root, next to task-01-design-system and task-02-repository-and-scaffold)

Right now the project is nested one level too deep: its files (package.json, app/, styles/, public/, next.config.mjs, tsconfig.json, next-env.d.ts, and a node_modules shortcut) are inside disposable-nested/tees-app/, so running npm from disposable-nested/ fails with ENOENT.

Rescaffold it in place: move every file and folder from disposable-nested/tees-app/ up into disposable-nested/ itself, so package.json sits directly in disposable-nested/. Keep node_modules as the same shortcut (do not copy or reinstall packages). Then remove the now-empty tees-app/ folder.

Rules:
- Do not touch anything outside disposable-nested/.
- Do not run git commands, do not start the server, and do not install anything.
- When finished, list the contents of disposable-nested/ and tell me exactly which commands you ran.
```

The agent reported running:

```
mv "disposable-nested/tees-app"/* "disposable-nested"/
rmdir "disposable-nested/tees-app"
```

I checked its work myself: from `disposable-nested/`, `ls` showed `package.json` directly there, and `npm run dev` reached "Ready in 2.4s" on port 3000.

## Fix 2: change directory

I recreated the nesting (moved everything back into `tees-app/`), confirmed `npm run dev` failed with ENOENT again, then ran `cd tees-app` and `npm run dev`: "Ready in 2.2s" on port 3000.

## Which fix is better

- **Changing directory** is instant and safe, but it only fixes it for me, this once. Every command, script and teammate has to remember the extra folder.
- **Rescaffolding in place** fixes the structure for everyone, but it moves files. On a real project I'd commit first, so a bad move could be undone.

## What I didn't do perfectly

I let the agent run Fix 1 before recording Fix 2, so `06` shows Fix 1 first, then the problem recreated, then Fix 2.
