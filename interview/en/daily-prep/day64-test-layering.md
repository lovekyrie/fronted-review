# Day 64 Test layering execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 64 | Test layering | [Testing strategy](../advanced/week7/testing-strategy), [Automated testing](../engineering/automated-testing) |

## Today's goals

- Finish Vitest / Playwright / the official layering model (unit / integration / E2E / visual)
- Produce a four-layer testing-strategy comparison: granularity, runtime, maintenance cost, typical tools
- Write an answer draft for “what you should not test”

## Reading notes

- Testing pyramid: more at the bottom, less at the top; more E2E is not better
- Unit tests focus on **pure functions and small units**; they should not be mock-heavy
- Visual regression (Percy / Chromatic) is for UI component libraries

## Cheat sheet / knowledge

### Four-layer comparison

| Layer | Granularity | Runtime | Maintenance cost | Typical tools |
|----|------|----------|----------|----------|
| **Unit** | Function / class / hook | Milliseconds | Low | Vitest / Jest |
| **Component** | Single component | Seconds | Medium | VTU / Testing Library |
| **Integration** | Multiple components + API | Seconds | Medium-high | Vitest + MSW |
| **E2E** | Full page flows | Minutes | High | Playwright / Cypress |

Extra layer: **visual regression** (Percy / Chromatic) — screenshot diffs to catch UI changes.

### Testing pyramid

```text
        /\
       / E2E \        ← few critical paths
      /--------\
     / Integration \  ← key page interactions
    /--------------\
   / Component tests \ ← complex components
  /------------------\
 /    Unit tests      \  ← lots of pure functions / utils
/______________________\
```

### What each layer should and should not test

| Layer | Test | Do not test |
|----|--------|----------|
| Unit | Pure functions, utils, custom hooks | No heavy mocks, no DOM |
| Component | Rendered output, user interaction, props/emit | No internal state, no style details |
| Integration | Page-level flows, API wiring | Do not cover every branch |
| E2E | Core business paths (login/order/pay) | Do not cover every combination |

### Coverage ≠ quality

- High coverage is not high quality: testing only the happy path can still be 100% line coverage.
- **Branch coverage** is more meaningful than line coverage.
- Coverage is a floor, not a goal: 80% is a common reasonable line.

## Handwritten / flowcharts

### Testing-strategy decision tree

```text
Shipping a new feature — what tests to write?
  ├─ Pure functions / utils? → unit tests (first)
  ├─ Complex components (form/table/dialog)? → component tests
  ├─ Multi-component + API? → integration tests (MSW mock API)
  └─ A core business path? → E2E (Playwright)

Limited maintenance budget?
  → Cut E2E (high cost, flaky)
  → Keep unit + component tests (best ROI)
```

## Oral questions

### 1. How do you talk about test layering like an engineer?

Answer template:

> I organize with the testing pyramid: a large base of unit tests covering pure functions and utils — fast to run, cheap to maintain. The middle is component tests, focused on user-visible behavior — render, click, type. The top is a small set of E2E tests covering core business paths — login, place order, pay.
>
> The key is **ROI thinking**: you do not need a lot at every layer. Unit tests are cheap and high-yield, so write those first. E2E is expensive and often flaky, so only cover P0 paths. Component tests are the sweet spot — closer to the user than unit tests, more stable than E2E. In a real project I look at which layer produces the most bugs and spend the test budget there.

### 2. What code is not worth testing?

Answer template:

> Four kinds. First, pure presentational components with no logic — they only render text from props; a test is unnecessary, visual regression is a better fit. Second, framework/third-party behavior — you do not need to prove Vue Router’s `push` works; that is the library’s job. Third, implementation details — do not assert internal state values; assert what the user sees. Fourth, frequently changing UI details — if a dialog’s styles change every week, detailed snapshot tests only create maintenance load.
>
> Core principle: **test behavior, not implementation; test what is deterministic, not what is volatile**.

## 5-minute recording order

Record in this order; do not reorganize on the spot:

1. Testing pyramid + four-layer responsibilities (1.5 min)
2. What each layer should / should not test + tool choice (2 min)
3. Coverage pitfalls + ROI thinking (1.5 min)

After recording, self-check:

- Did you state each layer’s granularity and typical tools.
- Did you say “test behavior, not implementation”.
- Did you say coverage is a floor, not a goal.
- Did you say E2E only covers P0 paths.

## Today's recap

The 3 points that most need review today:

1. Testing Trophy (Kent C. Dodds’ inverted-pyramid model) vs the classic pyramid.
2. The value of contract testing in a split frontend/backend project.
3. How to set a coverage gate in CI (incremental coverage vs full coverage).
