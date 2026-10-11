# Day 65 Vitest basics execution log

## Goals

- Finish Vitest Features
- Add a `vitest.config.ts` in the repo and get a minimal test suite running
- Produce a Vitest cheat sheet: `describe / it / expect / beforeEach / vi.mock / test.each`

## Read in order

1. [Testing strategy](../advanced/week7/testing-strategy)
2. [Automated testing](../engineering/automated-testing)

## Practice and self-check

**Checkpoints**

- Vitest shares Vite config; no extra Babel/tsconfig wiring
- Environment switch: `happy-dom` / `jsdom` / `node`; `happy-dom` is lighter for frontend component tests
- `test.each` cuts a lot of duplicated cases

**Produce or redraw from memory**

- Vitest core API cheat sheet — [reference section](../advanced/week7/testing-strategy#day-65-vitest-core-api-cheat-sheet)
- Common matchers — [reference section](../advanced/week7/testing-strategy#day-65-common-matchers)
- Choosing an environment — [reference section](../advanced/week7/testing-strategy#day-65-choosing-an-environment)
- Why Vitest integrates well with Vite — [reference section](../advanced/week7/testing-strategy#day-65-why-vitest-integrates-well-with-vite)
- Full test example — [reference section](../advanced/week7/testing-strategy#day-65-full-test-example)
- Async tests — [reference section](../advanced/week7/testing-strategy#day-65-async-tests)

**Answer aloud without reading a reference answer**

- 1. Advantages of Vitest over Jest?
- 2. How do you choose `happy-dom` vs `jsdom`?

**Recording drill**

Record in this order; do not reorganize on the spot:

1. Vitest + Vite integration advantages + vs Jest (1.5 min)
2. Core APIs (`describe`/`it`/`expect`/`beforeEach`/`it.each`) (2 min)
3. Environment choice (`node`/`happy-dom`/`jsdom`) + watch mode (1.5 min)

After recording, self-check:

- Did you say Vitest shares Vite config.
- Did you mention `it.each` parameterized tests.
- Did you say happy-dom is faster than jsdom.
- Did you say the API is Jest-compatible.

## Recap

The 3 points that most need review today:

1. When to use `vi.hoisted` (you need hoisting when using variables inside `vi.mock`).
2. Configuring Vitest Workspace in a monorepo.
3. Current state and fit of Vitest Browser Mode.
