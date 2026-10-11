# Day 70 Testing follow-up recap execution log

## Goals

- Roll up Day 64–69 into a *Frontend testing strategy 10-question answer book*
- Produce a formal “frontend test-layering strategy” answer (1-minute / 3-minute / 5-minute versions)
- Record an 8-minute clip: why testing is not optional in engineering

## Read in order

1. [Week 7 roadmap](../advanced/week7/roadmap)
2. [Testing strategy](../advanced/week7/testing-strategy)

## Practice and self-check

**Checkpoints**

- Interviews often ask “what is your project’s coverage?” — pull the focus from the **number** to **critical paths**
- Interviews often ask “what flaky test have you fixed?” — prepare 1 real case
- Interviews often ask “unit vs E2E, how do you choose?” — answer with **change frequency + failure cost**

**Produce or redraw from memory**

- Layering strategy in 3 lengths
- Flaky-governance flow
- Controlling CI duration
- Testing pipeline
- Coverage strategy

**Answer aloud without reading a reference answer**

- 1. How do you talk about frontend test layering?
- 2. 3 self-drawn follow-ups

**Mock format and scoring**

### Layering strategy in 3 lengths

**1-minute version:**

> Pyramid in four layers. A large base of unit tests (pure functions / utils), component tests in the middle (user behavior), a few E2E at the top (core paths). Test behavior, not implementation. Coverage is a floor, not a goal.

**3-minute version:**

> On top of the 1-minute version: tool choice (Vitest + VTU + Playwright), what each layer should and should not test, ROI thinking (E2E is expensive so only P0; component tests are the sweet spot).

**5-minute version:**

> On top of the 3-minute version: CI integration (Lighthouse CI + coverage gate + E2E parallelism), a four-step flaky-test playbook, a real case (coverage from X% to Y%).

### Flaky-governance flow

```text
1. Identify → CI marks flaky (3 consecutive runs, sometimes pass, sometimes fail)
2. Classify → time / order / async / leftover environment
3. Fix → fake timers / independent setup / flushPromises / afterEach cleanup
4. Prevent → CI retry as a net + independent tests + no real network
```

### Controlling CI duration

| Strategy | Effect |
|------|------|
| Unit-test parallelism (Vitest default) | Use multiple cores |
| E2E parallelism (workers=4) | No shared state between tests |
| Incremental tests (only what changed) | Biggest cut in duration |
| Staged (unit first, E2E later) | Fast feedback + full verification |

### Testing pipeline

```text
Local development
  ├─ Watch mode: Vitest watch → change code → auto re-run related tests
  └─ Manual: vitest run --coverage

PR stage
  ├─ CI triggers automatically
  │   ├─ Lint + Type Check (1–2 min)
  │   ├─ Unit + component tests (2–5 min)
  │   ├─ Coverage check (incremental ≥ 80%)
  │   └─ E2E (5–10 min, parallel)
  └─ All green → allow merge

Staging
  └─ E2E smoke (core paths)

Production
  └─ Online monitoring (web-vitals RUM + error reporting)
```

### Coverage strategy

```text
Full coverage: overall ≥ 80% (baseline)
Incremental coverage: new/changed code ≥ 80% (enforced on every PR)
Branch coverage: watch branch coverage (more meaningful than line)
Exclusions: config files / type declarations / mock data do not count
```

**Recording drill**

1. Layering strategy (pyramid + four-layer roles + ROI) (2 min)
2. Vitest core API + component tests (`mount`/`trigger`/`emitted`) (2 min)
3. E2E placement (P0 paths + Playwright auto-wait + locator priority) (1.5 min)
4. Coverage strategy + four-step flaky governance + CI duration control (1.5 min)
5. Engineering value of tests (refactor confidence + documentation + team collaboration) (1 min)

## Recap

The 3 questions most likely to trip you up:

1. “What is your coverage? How did you drive it?” — you need a concrete number + a drive strategy (CI gate).
2. “What flaky test have you fixed?” — prepare a real case (cause + fix + prevention).
3. “Where is the boundary between component tests and E2E?” — you need change frequency + failure cost.

3 new “why” questions from this week:

1. Why does Testing Library not offer `shallowMount`? (It encourages testing real behavior, not implementation details)
2. Why is Vitest faster than Jest? (Native ESM + Vite on-demand compile + no Babel transform)
3. Why are E2E tests often flaky? (Real browser + network + animation + shared state → lots of nondeterminism)
