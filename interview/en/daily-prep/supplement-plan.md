# Daily Prep supplement plan

## Principles

- Advance in `Day 20 -> Day 80` order; do not skip stages to fill answers.
- Do not chase file length. Only add high-frequency interview points, likely follow-ups, and engineering judgment.
- Prefer four blocks per day: cheat sheet, flow/code, spoken answers, today's recap.
- Recap days are not knowledge dumps. Distill the answer book, follow-up list, and weak spots.
- Day 80 is only the master index and final gap-fill. It does not replace earlier days.

## Minimum bar per file

### Cheat sheet / knowledge

- 5-8 core conclusions.
- Each should cover at least 2 of: what / why / scene / trap.
- Do not copy docs in bulk. Prefer short sentences you can say in an interview.

### Handwritten / flow

- Internals questions: minimal code or an ASCII pipeline.
- Engineering questions: flow, checklist, or config skeleton.
- Scenario questions: module split, data flow, error branches.

### Spoken questions

- At least 2 per day.
- Each: conclusion → pipeline → trade-offs → traps → land it on a project.
- Keep spoken length to 1-3 minutes; recap days can go to 5.

### Today's recap

- No vague feelings.
- Always distill 3 points: most likely follow-up, current gap, next action.

## Order

### Round 1: Engineering and delivery, Day 20-28

Goal: string build, CI/CD, Docker, Nginx, env, release/rollback, and production troubleshooting into one path.

Focus files:

- `day20-production-build.md`: env/mode, source map, chunk, artifact analysis.
- `day21-build-review.md`: 15-question build answer book.
- `day22-github-actions.md`: workflow, runner, cache, secrets, artifacts.
- `day23-docker-basics.md`: multi-stage build, image layers, tags, runtime.
- `day24-nginx-config.md`: location, try_files, proxy_pass, gzip, cache headers.
- `day25-env-and-mode.md`: build-time vars, runtime config, secret boundary.
- `day26-release-rollback.md`: version, canary, rollback, keeping assets.
- `day27-online-troubleshoot.md`: static 404, white screen, cache pollution, API failures.
- `day28-deploy-review.md`: 15-question deploy answer book.

### Round 2: Vue internals spine, Day 29-42

Goal: tell Vue 3 reactivity, compile optimizations, render updates, Router/Pinia/SSR as one spine.

Spine:

- `Proxy / Reflect -> track / trigger -> effect / scheduler -> computed / watch`
- `template compiler -> patch flag -> block tree -> renderer diff`
- `component update -> router -> state management -> SSR / hydrate`

### Round 3: React mechanics secondary, Day 43-49

Goal: stably answer React render, state queue, effect, memo, concurrent, and React 19.

Spine:

- `render / commit / batching`
- `state queue / stale closure / effect cleanup`
- `memo / useMemo / useCallback benefits and costs`
- `transition / deferred / RSC / React 19 new APIs`

### Round 4: Advanced TypeScript, Day 50-56

Goal: move from “can write types” to “can explain type design”.

Spine:

- Generic constraints and inference direction.
- Conditionals, distributivity, `infer`.
- Mapped types, key remapping, template literals.
- Handwritten utility types and modeling a business API.

### Round 5: Perf, security, monitoring, Day 57-63 + Day 75

Goal: connect metrics, causes, optimizations, and production observation.

Spine:

- Event Loop and the render pipeline.
- Web Vitals mapped to optimizations.
- HTTP cache, Service Worker, first-paint optimization.
- XSS, CSRF, CSP boundaries.
- Capture, source map, release, sampling, alert loop.

### Round 6: Testing, Day 64-70

Goal: explain why test, what to test, how, and how it enters CI.

Spine:

- Test pyramid and layer duties.
- Vitest, Vue Test Utils, Mock, coverage.
- Playwright E2E and trace debugging.
- Flaky-test hygiene and CI duration.

### Round 7: Scenarios, projects, mocks, Day 71-80

Goal: fold earlier knowledge into senior interview delivery.

Spine:

- Large-file upload, virtual list, permission system, micro-frontends.
- Project STAR, resume HR, two mock recaps.
- Day 80: green/yellow/red status, high-frequency 30, next 2 weeks of gap-fill.

## Cadence

- Fill 2-3 consecutive days at a time so context switches stay small.
- After each recap day (Day 21, 28, 42, 49, 56, 63, 70, 80), update stage weak spots.
- Prefer answers you can speak. Completeness of notes is secondary.
