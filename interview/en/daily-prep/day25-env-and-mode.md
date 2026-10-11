# Day 25 Multi-env Variables and Build Mode

## Goals

- Finish Vite Env and Mode, and Docker Build Variables
- Draw a chain diagram of env vars from `.env` → build artifacts → runtime
- Collect a diff list for the three environments dev / staging / prod (domains / APIs / feature flags)

## Read in order

1. [Deployment](../advanced/week2/deployment)
2. [CI/CD](../advanced/week2/ci-cd)

## Practice and self-check

**Checkpoints**

- Vite only exposes variables that start with `VITE_` to the client, to prevent leaking secrets
- Build-time injection vs runtime injection: the former is baked into artifacts; the latter uses `window.__CONFIG__` / an API
- Docker `ARG` vs `ENV`: the former exists only at build time; the latter enters the runtime image

**Produce or redraw from memory**

- Knowledge notes — [reference section](../advanced/week2/deployment#day-25-knowledge-notes)
- Practice example — [reference section](../advanced/week2/deployment#day-25-practice-example)

**Answer aloud without reading a reference answer**

- 1. How do you choose between build-time and runtime injection?
- 2. Why does Vite only expose variables with the `VITE_` prefix?

**Recording drill**

1. Env-var chain (1.5 minutes)
2. Build-time vs runtime injection (2 minutes)
3. Secret boundaries (1.5 minutes)

## Recap

1. Most likely follow-up: build-time variables are already baked into artifacts. Changing `ENV` at container runtime will not automatically change the JS in the browser.
2. Current gap: prepare a real `config.js` or placeholder-replacement scheme, and explain cache, type checking, and defaults.
3. Next to add: connect env vars with release rollback, so a rollback to an old version does not mismatch config files and static-asset versions.
