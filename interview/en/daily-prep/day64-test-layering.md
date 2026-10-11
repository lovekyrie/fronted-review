# Day 64 Test layering execution log

## Goals

- Finish Vitest / Playwright / the official layering model (unit / integration / E2E / visual)
- Produce a four-layer testing-strategy comparison: granularity, runtime, maintenance cost, typical tools
- Write an answer draft for “what you should not test”

## Read in order

1. [Testing strategy](../advanced/week7/testing-strategy)
2. [Automated testing](../engineering/automated-testing)

## Practice and self-check

**Checkpoints**

- Testing pyramid: more at the bottom, less at the top; more E2E is not better
- Unit tests focus on **pure functions and small units**; they should not be mock-heavy
- Visual regression (Percy / Chromatic) is for UI component libraries

**Produce or redraw from memory**

- Four-layer comparison — [reference section](../advanced/week7/testing-strategy#day-64-four-layer-comparison)
- Testing pyramid — [reference section](../advanced/week7/testing-strategy#day-64-testing-pyramid)
- What each layer should and should not test — [reference section](../advanced/week7/testing-strategy#day-64-what-each-layer-should-and-should-not-test)
- Coverage ≠ quality — [reference section](../advanced/week7/testing-strategy#day-64-coverage-quality)
- Testing-strategy decision tree — [reference section](../advanced/week7/testing-strategy#day-64-testing-strategy-decision-tree)

**Answer aloud without reading a reference answer**

- 1. How do you talk about test layering like an engineer?
- 2. What code is not worth testing?

**Recording drill**

Record in this order; do not reorganize on the spot:

1. Testing pyramid + four-layer responsibilities (1.5 min)
2. What each layer should / should not test + tool choice (2 min)
3. Coverage pitfalls + ROI thinking (1.5 min)

After recording, self-check:

- Did you state each layer’s granularity and typical tools.
- Did you say “test behavior, not implementation”.
- Did you say coverage is a floor, not a goal.
- Did you say E2E only covers P0 paths.

## Recap

The 3 points that most need review today:

1. Testing Trophy (Kent C. Dodds’ inverted-pyramid model) vs the classic pyramid.
2. The value of contract testing in a split frontend/backend project.
3. How to set a coverage gate in CI (incremental coverage vs full coverage).
