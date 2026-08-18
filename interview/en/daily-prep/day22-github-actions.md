# Day 22 GitHub Actions Execution Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 22 | GitHub Actions | [CI/CD](../advanced/week2/ci-cd), [Git](../engineering/git) |

## Today's goals

- Finish the GitHub Actions docs and Workflow Syntax
- Based on `.github/workflows/deploy.yml` in this repo, write a go-live review (trigger → build → deploy)
- Be able to explain the 6 core concepts: `on / jobs / steps / secrets / matrix / cache`

## Reading pitfalls

- Combining `on.push` branch filters with `paths` filters can cut a lot of useless runs
- Jobs run in parallel by default; `needs` sequences them; `if` is for conditional branches
- The `actions/cache` key must include the lockfile hash, or you will reuse stale dependencies

## Cheat sheet / key points

- `on` decides when a workflow runs. Common events are `push`, `pull_request`, and `workflow_dispatch`; combine them with `branches` and `paths` to reduce useless runs.
- `jobs` run in parallel by default; use `needs` for sequential dependencies and `if` for conditions.
- `steps` are sequential units inside a job. You can use a third-party action or run a shell command directly.
- A `runner` is the execution environment. GitHub-hosted runners need less maintenance; self-hosted runners fit intranet deploys, large caches, or special environments.
- `secrets` store sensitive values, but variables injected into a frontend bundle are still visible in the browser. Do not treat a secret as a client-side key.
- `artifacts` keep outputs between jobs or after a build, such as dist, test reports, and coverage reports.
- `environment` can add approvals, env vars, and protection rules for prod/staging. It is part of release governance.
- CI is not just automatically running commands. It turns lint, test, typecheck, build, and deploy verification into a stable quality gate.

## Handwritten / flow diagrams

```yaml
name: frontend-ci

on:
  pull_request:
    branches: [main]
    paths:
      - 'src/**'
      - 'package.json'
      - 'pnpm-lock.yaml'
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist
```

```text
PR -> lint/test/typecheck/build -> artifacts/reports
main push -> build artifacts -> deploy staging/prod -> smoke test -> rollback or block on failure
```

## Oral questions

### 1. What stages should a complete frontend CI pipeline include?

> Answer template: Complete frontend CI is not just running build. At PR time you at least install deps, run lint, typecheck, unit tests, and a build check, so cheap mistakes are blocked before merge. On the main branch, after the quality gate passes, you produce a traceable artifact such as dist or a Docker image, then upload it as an artifact or to a registry. When you enter CD you still need env vars, secrets, approvals, a post-deploy smoke test, and a rollback entry. A more senior answer stresses: CI verifies that a change is reliable; CD delivers one traceable version stably.

### 2. How do you make CI faster?

> Answer template: I would first find where it is slow, then optimize each part. Slow installs get a package-manager cache, and the cache key must include the lockfile hash. Independent work becomes parallel jobs; only true serial work uses `needs`. Too many triggers get `branches`, `paths`, and PR rules to cut useless runs. Slow tests get layered into unit, component, and E2E: PRs run the critical set, nights or main run the full set. Slow builds then get sourcemap, minify, typecheck, and plugin time. Do not skip quality gates just to go faster.

## 5-minute recording outline

1. The 6 core workflow concepts (1.5 minutes)
2. Review of this repo's deploy.yml (2 minutes)
3. Cache + parallel + conditional-trigger optimizations (1.5 minutes)

## Today's review

1. Most likely follow-up: the key for `actions/cache` or `setup-node cache` cannot be a fixed string; the cache must invalidate when the lockfile changes.
2. Current gap: prepare a real workflow review. Be able to say why each job exists, and how you locate a failure.
3. Next to add: connect CI/CD with Docker, Nginx, and release rollback, so you are not stuck at GitHub Actions syntax.
