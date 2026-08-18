# Day 70 Testing follow-up recap execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 70 | Testing recap | [Week 7 roadmap](../advanced/week7/roadmap), [Testing strategy](../advanced/week7/testing-strategy) |

## Today's goals

- Roll up Day 64–69 into a *Frontend testing strategy 10-question answer book*
- Produce a formal “frontend test-layering strategy” answer (1-minute / 3-minute / 5-minute versions)
- Record an 8-minute clip: why testing is not optional in engineering

## Reading notes

- Interviews often ask “what is your project’s coverage?” — pull the focus from the **number** to **critical paths**
- Interviews often ask “what flaky test have you fixed?” — prepare 1 real case
- Interviews often ask “unit vs E2E, how do you choose?” — answer with **change frequency + failure cost**

## Cheat sheet / knowledge

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

## Handwritten / flowcharts

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

## Oral questions

### 1. How do you talk about frontend test layering?

Answer template:

> I organize with the testing pyramid, four layers. The bottom is **unit tests** — pure functions, utils, custom hooks, run with Vitest, millisecond-fast. The middle is **component tests** — VTU or Testing Library, user-visible behavior: render, click, type, emit. Above that is **integration tests** — multiple components + API wiring, MSW to mock APIs. The top is **E2E** — Playwright on core business paths; 10–20 is enough.
>
> The key principle is **ROI thinking**: unit tests are cheap and high-yield, write more; E2E is expensive and flaky, write few and only P0. Component tests are the sweet spot. Coverage is a floor, not a goal — 80% that is all happy path is worse than 60% that covers error branches.

### 2. 3 self-drawn follow-ups

**Q: What is your team’s coverage, and how did you drive it?**

> Full coverage is 75%; incremental coverage must be 80%. How we drive it: CI gates incremental coverage — new code that misses the bar cannot merge. We do not chase 100% overall, because backfilling tests on some legacy code has poor ROI. The focus is that new features and bug fixes have tests.

**Q: What flaky test have you fixed?**

> An E2E login test failed intermittently. It turned out tests shared one account, and concurrent runs collided on the session. Fix: each test creates an isolated user via API and deletes it afterward. We also added retry=2 in CI as a safety net.

**Q: Unit vs E2E, how do you choose?**

> Two dimensions: **change frequency** and **failure cost**. Logic that changes often (utils, data transforms) gets unit tests — fast verification during refactors. High-failure-cost paths (pay, signup) get E2E — keep the end-to-end flow intact. The middle (form components, list interactions) gets component tests.

## 8-minute recording order (testing topic)

1. Layering strategy (pyramid + four-layer roles + ROI) (2 min)
2. Vitest core API + component tests (`mount`/`trigger`/`emitted`) (2 min)
3. E2E placement (P0 paths + Playwright auto-wait + locator priority) (1.5 min)
4. Coverage strategy + four-step flaky governance + CI duration control (1.5 min)
5. Engineering value of tests (refactor confidence + documentation + team collaboration) (1 min)

## Today's recap

The 3 questions most likely to trip you up:

1. “What is your coverage? How did you drive it?” — you need a concrete number + a drive strategy (CI gate).
2. “What flaky test have you fixed?” — prepare a real case (cause + fix + prevention).
3. “Where is the boundary between component tests and E2E?” — you need change frequency + failure cost.

3 new “why” questions from this week:

1. Why does Testing Library not offer `shallowMount`? (It encourages testing real behavior, not implementation details)
2. Why is Vitest faster than Jest? (Native ESM + Vite on-demand compile + no Babel transform)
3. Why are E2E tests often flaky? (Real browser + network + animation + shared state → lots of nondeterminism)
