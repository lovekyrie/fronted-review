# Day 67 Mock / Spy / coverage trade-offs execution log

## Goals

- Finish Vitest Mocking / Coverage
- Write up three mock tiers: `vi.spyOn` / `vi.fn` / `vi.mock('module')`
- Write 1 test that mocks time, mocks fetch, and mocks a module

## Read in order

1. [Testing strategy](../advanced/week7/testing-strategy)

## Practice and self-check

**Checkpoints**

- `vi.spyOn` instruments an existing method and keeps the original behavior; `vi.fn` creates a full stand-in
- `vi.mock('module')` is hoisted to the top of the file; pair that hoisting with `vi.hoisted`
- Coverage ≠ quality: high coverage that **skips error branches** / **skips edges** is meaningless

**Produce or redraw from memory**

- Three mock tiers — [reference section](../advanced/week7/testing-strategy#day-67-three-mock-tiers)
- vi.spyOn — [reference section](../advanced/week7/testing-strategy#day-67-vi-spyon)
- vi.fn — [reference section](../advanced/week7/testing-strategy#day-67-vi-fn)
- vi.mock (module level) — [reference section](../advanced/week7/testing-strategy#day-67-vi-mock-module-level)
- Mocking time — [reference section](../advanced/week7/testing-strategy#day-67-mocking-time)
- Four coverage metrics — [reference section](../advanced/week7/testing-strategy#day-67-four-coverage-metrics)
- Common flaky-test causes — [reference section](../advanced/week7/testing-strategy#day-67-common-flaky-test-causes)
- Mock fetch + async test — [reference section](../advanced/week7/testing-strategy#day-67-mock-fetch-async-test)
- Fake-timer test — [reference section](../advanced/week7/testing-strategy#day-67-fake-timer-test)

**Answer aloud without reading a reference answer**

- 1. When do you use spyOn vs mock?
- 2. How do you deal with flaky tests systematically?

**Recording drill**

Record in this order; do not reorganize on the spot:

1. Three mock tiers (spyOn / fn / mock module) + when to use each (2 min)
2. Mocking time + a full mock-fetch example (1.5 min)
3. Four coverage metrics + handling flaky tests (1.5 min)

After recording, self-check:

- Did you state the difference among the three tiers.
- Did you say `vi.mock` is hoisted to the top.
- Did you say branch coverage is the most important.
- Did you name common flaky causes and how to fix them.

## Recap

The 3 points that most need review today:

1. Pairing `vi.hoisted` with `vi.mock` (using outer variables in the mock factory).
2. Why MSW (Mock Service Worker) can beat `vi.mock` in integration tests.
3. Wiring coverage reports into CI (incremental coverage gate vs full coverage gate).
