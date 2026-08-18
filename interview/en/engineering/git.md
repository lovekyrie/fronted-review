### Git internals and advanced operations

#### 1. Object model (the principle they always ask)

Git is a content-addressable file system. Everything lives under `.git/objects/`.

```bash
# .git layout
.git/
  objects/       # object store (blob/tree/commit)
  refs/          # refs (branch/tag)
  HEAD           # current branch pointer
  index          # staging area
```

**Four object types:**
```bash
# blob: file content (no filename)
echo 'hello' | git hash-object --stdin -w
# → 8ab686eafeb9f447ab20ebf5aa31717fbe73b1c7

# tree: directory (filename + blob/tree pointer)
git cat-file -p HEAD^{tree}

# commit: snapshot + author + message + parent pointer
git cat-file -p HEAD

# ref: pointer to a commit (branch/tag)
cat .git/refs/heads/main
```

> **Interview bonus**: filenames live in the tree; content lives in the blob. Do not mix them up.

---

#### 2. Three layers: worktree, index, repository

```
Working Directory
  ↓ git add
Staging Area / Index
  ↓ git commit
Repository / Objects
```

```bash
# Index details: .git/index is binary
git ls-files --stage  # list the index

# HEAD points at the tip of the current branch
cat .git/HEAD
# → ref: refs/heads/main
```

---

#### 3. Three `git reset` modes

| Mode | HEAD | Index | Worktree | Typical use |
|------|------|--------|--------|----------|
| `--soft` | Move to that commit | Keep | Keep | Squash several commits |
| `--mixed` (default) | Move | Reset | Keep | Unstage, keep edits in the worktree |
| `--hard` | Move | Reset | **Reset (lost)** | Emergency clean rollback |

```bash
# --hard is dangerous: the worktree is overwritten and cannot be recovered from the files themselves
git reset --hard HEAD~3
git reset --hard 1a2b3c4

# Recover if reflog still has it
git reflog
git reset --hard HEAD@{5}
```

> **Frequent follow-up**: why is `reset --hard` dangerous? It overwrites the worktree. Uncommitted edits are gone.

---

#### 4. How rebase works, and the risk

```bash
# rebase replays the current branch’s commits on top of the target
git rebase main

# Find the fork, take the unique commits, replay them on the target
# fork = merge base = git merge-base main feature
```

**Risks (know these well):**
- **Do not rebase a branch that was already pushed**: history rewrite breaks collaborators
- Interactive `-i` can squash / edit / drop commits, but only on unpushed branches

```bash
# Squash the last 3 commits
git rebase -i HEAD~3
# In the editor, change pick to squash from the second commit onward
```

> **Answer template**: rebase “moves the base” — commits are replayed on a new parent, history looks linear but hashes change. merge “joins” and keeps full history, at the cost of a merge commit. Never rebase a shared branch; local cleanup is fine.

---

#### 5. How stash is implemented

```bash
# Surface: stash the current edits
git stash push -m "WIP: feature"

# Internally: two commits
# 1. WIP commit (based on HEAD)
# 2. index commit (based on the staging area)
# both hang off refs/stash
git cat-file -p stash@{0}  # first is WIP
git cat-file -p stash@{0}^2  # second is the index commit
```

```bash
# Restore options
git stash pop    # restore and drop
git stash apply  # restore and keep
git stash list   # list all
```

---

#### 6. Common mistakes and recovery

```bash
# 1. Accidental git reset --hard
git reflog  # find the old HEAD
git reset --hard HEAD@{1}

# 2. Accidental branch delete
git branch -D feature
git checkout -b feature HEAD@{1}  # restore from reflog

# 3. Commit on the wrong branch
git commit -m "WIP"  # landed on main
git reset --soft HEAD~1  # undo the commit, keep the edits
git checkout feature  # switch to the right branch
git commit  # commit again

# 4. Force-push overwrote others
git push --force-with-lease  # safer than --force; refuses if remote moved
```

---

#### 7. Git Flow vs GitHub Flow

| Model | When | Branching |
|------|----------|----------|
| **Git Flow** | Fixed release cadence (e.g. every two weeks) | main + develop + feature + release + hotfix |
| **GitHub Flow** | Continuous delivery, small team | main + feature only; branch off main anytime |
| **Trunk-based** | Trunk always shippable, fast integrate | Everyone on main; short-lived features |

> **Follow-up**: why do internet companies pick GitHub Flow or trunk? Releases are frequent, they do not maintain many versions, and Git Flow’s release/hotfix branches cost too much.

---

#### 8. Advanced interview questions

1. **Why is Git faster than SVN**
   - Full repo is local; no round-trip for every operation
   - Simple object model: commit / tree / blob
   - zlib compression, compact storage

2. **When merge vs rebase**
   - Shared branches: merge (do not rewrite history)
   - Local cleanup: rebase (linear history)
   - Golden rule: never rebase a pushed branch

3. **How cherry-pick works**
   - Take the diff of a commit and apply it on the current branch
   - New hash (same change, different history)

---

#### 9. Interview answer template

Start with the object model (blob / tree / commit), then the three layers (worktree / index / repo), then pick reset / rebase / cherry-pick from the scenario. If they ask about recovery, go straight to reflog.
