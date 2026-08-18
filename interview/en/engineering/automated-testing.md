# Automated testing: unit tests and E2E

## 1. Test pyramid (simplified)

- Unit tests (most of them): fast, easy to pinpoint.
- Integration tests: check that modules work together.
- E2E tests (fewest): walk real user paths.

## 2. Unit tests (Jest / Vitest)

### What to focus on

- Pure functions, helpers, state management, component behavior.
- Isolate dependencies (mock network, time, randomness).

```ts
import { describe, it, expect } from 'vitest'
import { sum } from './sum'

describe('sum', () => {
  it('adds numbers', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
```

## 3. E2E tests (Cypress / Playwright)

### What to focus on

- Critical flows: login, checkout, payment, permission checks.
- Close to a real browser, so you catch integration bugs.

## 4. How to talk about coverage

- Higher is not always better. Cover the **critical paths**.
- Common metrics: `statements`, `branches`, `functions`, `lines`.
- Set a floor (e.g. 70%–80%) and a higher bar for core modules.

## 5. Interview answer template

1. Start with the layering strategy.
2. Then how the team runs it (which tests run in CI).
3. End with the payoff (fewer regressions, safer releases).
