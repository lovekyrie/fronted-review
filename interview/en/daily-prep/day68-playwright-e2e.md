# Day 68 Playwright E2E execution log

## Goals

- Finish Playwright Writing Tests docs
- Write 1 E2E sample: login / navigate / assert a key element
- Produce an E2E strategy: core paths + canary data + CI parallelism

## Read in order

1. [Testing strategy](../advanced/week7/testing-strategy)
2. [Automated testing](../engineering/automated-testing)

## Practice and self-check

**Checkpoints**

- Locator priority: `getByRole > getByLabel > getByText > locator('css')`, closer to the user
- Default retry + auto-wait; do not sleep by hand
- In CI, E2E uses `workers` for parallelism, but avoid shared state

**Produce or redraw from memory**

- Locator priority — [reference section](../advanced/week7/testing-strategy#day-68-locator-priority)
- Common expect assertions — [reference section](../advanced/week7/testing-strategy#day-68-common-expect-assertions)
- Playwright core features — [reference section](../advanced/week7/testing-strategy#day-68-playwright-core-features)
- E2E strategy principles — [reference section](../advanced/week7/testing-strategy#day-68-e2e-strategy-principles)
- Full E2E example: login flow — [reference section](../advanced/week7/testing-strategy#day-68-full-e2e-example-login-flow)
- Page Object Model — [reference section](../advanced/week7/testing-strategy#day-68-page-object-model)
- CI config — [reference section](../advanced/week7/testing-strategy#day-68-ci-config)

**Answer aloud without reading a reference answer**

- 1. Which scenarios should E2E cover?
- 2. How do you treat the usual E2E “slow + brittle” problems?

**Recording drill**

Record in this order; do not reorganize on the spot:

1. Where E2E sits in the layers + what it covers (1 min)
2. Locator priority + auto-wait + no sleep (2 min)
3. CI parallelism + Trace Viewer debugging + Page Object pattern (2 min)

After recording, self-check:

- Did you say `getByRole` beats CSS selectors.
- Did you mention auto-wait and retry.
- Did you say E2E only covers P0 core paths.
- Did you mention Trace Viewer’s debugging value.

## Recap

The 3 points that most need review today:

1. Skipping login with Playwright `test.use({ storageState })`.
2. Playwright Component Testing (experimental) vs Vitest component tests.
3. When to use visual regression (`toHaveScreenshot`) and how to set the threshold.
