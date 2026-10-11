# Day 22 GitHub Actions

## Goals

- Finish the GitHub Actions docs and Workflow Syntax
- Based on `.github/workflows/deploy.yml` in this repo, write a go-live review (trigger → build → deploy)
- Be able to explain the 6 core concepts: `on / jobs / steps / secrets / matrix / cache`

## Read in order

1. [CI/CD](../advanced/week2/ci-cd)
2. [Git](../engineering/git)

## Practice and self-check

**Checkpoints**

- Combining `on.push` branch filters with `paths` filters can cut a lot of useless runs
- Jobs run in parallel by default; `needs` sequences them; `if` is for conditional branches
- The `actions/cache` key must include the lockfile hash, or you will reuse stale dependencies

**Produce or redraw from memory**

- Knowledge notes — [reference section](../advanced/week2/ci-cd#day-22-knowledge-notes)
- Practice example — [reference section](../advanced/week2/ci-cd#day-22-practice-example)

**Answer aloud without reading a reference answer**

- 1. What stages should a complete frontend CI pipeline include?
- 2. How do you make CI faster?

**Recording drill**

1. The 6 core workflow concepts (1.5 minutes)
2. Review of this repo's deploy.yml (2 minutes)
3. Cache + parallel + conditional-trigger optimizations (1.5 minutes)

## Recap

1. Most likely follow-up: the key for `actions/cache` or `setup-node cache` cannot be a fixed string; the cache must invalidate when the lockfile changes.
2. Current gap: prepare a real workflow review. Be able to say why each job exists, and how you locate a failure.
3. Next to add: connect CI/CD with Docker, Nginx, and release rollback, so you are not stuck at GitHub Actions syntax.
