# Frontend standards: ESLint + Husky + lint-staged + commitlint

## 1. Why bother

- Catch silly mistakes before the commit.
- Keep style consistent so reviews stay cheap.
- Conventional commits make changes easier to trace.

## 2. How ESLint works (interview short version)

- Parse source into an AST.
- Walk nodes against rules and report issues.
- Rules that can auto-fix run under `--fix`.

## 3. Commit pipeline

1. `git commit` fires Husky `pre-commit`.
2. `lint-staged` only checks staged files and runs `eslint --fix` / `prettier`.
3. `commit-msg` runs commitlint against the message format.

## 4. Conventional Commits

- `feat:` new feature
- `fix:` bug fix
- `refactor:` refactor
- `docs:` docs
- `test:` tests

## 5. High-frequency follow-ups

### Q1: Why lint-staged?

Only staged files are linted, so it is faster and less annoying.

### Q2: Why commitlint?

Readable history, and it plays with automated release (semver).
