# Day 67 Mock / Spy / coverage trade-offs execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 67 | Mock / coverage | [Testing strategy](../advanced/week7/testing-strategy) |

## Today's goals

- Finish Vitest Mocking / Coverage
- Write up three mock tiers: `vi.spyOn` / `vi.fn` / `vi.mock('module')`
- Write 1 test that mocks time, mocks fetch, and mocks a module

## Reading notes

- `vi.spyOn` instruments an existing method and keeps the original behavior; `vi.fn` creates a full stand-in
- `vi.mock('module')` is hoisted to the top of the file; pair that hoisting with `vi.hoisted`
- Coverage ≠ quality: high coverage that **skips error branches** / **skips edges** is meaningless

## Cheat sheet / knowledge

### Three mock tiers

| Tier | API | Behavior | Fit |
|------|-----|------|------|
| **Spy** | `vi.spyOn(obj, 'method')` | Watch calls, keep original impl | Verify a function was called |
| **Stub** | `vi.fn()` | Create an empty stand-in | Callbacks, event handlers |
| **Module mock** | `vi.mock('module')` | Replace the whole module | Third-party deps, API modules |

### vi.spyOn

```ts
import * as api from './api'

const spy = vi.spyOn(api, 'fetchUser')
// keep original impl, only watch
spy.mockResolvedValue({ id: 1, name: 'Alice' })
// replace the return value

await api.fetchUser(1)
expect(spy).toHaveBeenCalledWith(1)

spy.mockRestore()  // restore original impl
```

### vi.fn

```ts
const onClick = vi.fn()
mount(Button, { props: { onClick } })
await wrapper.find('button').trigger('click')
expect(onClick).toHaveBeenCalledTimes(1)
```

### vi.mock (module level)

```ts
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1 }),
  fetchPosts: vi.fn().mockResolvedValue([]),
}))
// the entire './api' module is replaced
// vi.mock is hoisted to the top of the file
```

### Mocking time

```ts
vi.useFakeTimers()

setTimeout(() => console.log('done'), 1000)
vi.advanceTimersByTime(1000)  // fast-forward 1000ms

vi.useRealTimers()  // restore real time
```

### Four coverage metrics

| Metric | Meaning | Importance |
|------|------|--------|
| **Branch** | Every if/else branch is taken | ⭐⭐⭐ most important |
| **Function** | Every function is called | ⭐⭐ |
| **Statement** | Every statement runs | ⭐⭐ |
| **Line** | Every line runs | ⭐ easy to game |

### Common flaky-test causes

| Cause | Symptom | Fix |
|------|------|------|
| Time dependence | Sometimes times out, sometimes passes | `vi.useFakeTimers` |
| Order dependence | Passes alone, fails in the suite | Independent setup per test |
| Async races | Intermittent failures | `await flushPromises` / wait for a condition |
| Random data | Non-deterministic results | Seed or fixture data |
| Environment leftover | Global state leaks | Clean up in `afterEach` |

## Handwritten / flowcharts

### Mock fetch + async test

```ts
import { it, expect, vi } from 'vitest'
import { fetchUserName } from './user-service'

vi.mock('./api', () => ({
  fetchUser: vi.fn(),
}))

import { fetchUser } from './api'

it('returns user name', async () => {
  vi.mocked(fetchUser).mockResolvedValue({ id: 1, name: 'Alice' })

  const name = await fetchUserName(1)
  expect(name).toBe('Alice')
  expect(fetchUser).toHaveBeenCalledWith(1)
})
```

### Fake-timer test

```ts
import { it, expect, vi } from 'vitest'

function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

it('debounce calls fn after delay', () => {
  vi.useFakeTimers()
  const fn = vi.fn()
  const debounced = debounce(fn, 300)

  debounced('a')
  debounced('b')
  debounced('c')

  expect(fn).not.toHaveBeenCalled()
  vi.advanceTimersByTime(300)
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith('c')

  vi.useRealTimers()
})
```

## Oral questions

### 1. When do you use spyOn vs mock?

Answer template:

> `spyOn` is for “watch without changing” — you want to know whether a function was called and with what args, without replacing its implementation. Example: spy on `console.error` to verify error handling. If you need to replace the return value, chain `mockReturnValue`.
>
> `vi.fn` / `vi.mock` are for “full replacement” — you do not want the real logic to run. Example: mock API calls to avoid a real network, or mock a whole module (`vi.mock('axios')`). Module-level mocks are hoisted to the top of the file, which fits replacing third-party deps.
>
> Principle: spy when you can (keeping the original impl is safer); mock only when you must isolate an external dependency.

### 2. How do you deal with flaky tests systematically?

Answer template:

> Four steps. First, **identify** — mark flaky tests in CI (run 3 times; sometimes pass, sometimes fail). Second, **classify** — time dependence (fix with fake timers), order dependence (independent setup per test), async races (add await / poll), or leftover environment (`afterEach` cleanup). Third, **fix** — treat the cause. Fourth, **prevent** — CI retry as a safety net (not a cure), every test must be independently repeatable, and no real network or clock.
>
> The most common cause is not waiting for async work — use `flushPromises` or Testing Library’s `waitFor` so the DOM has updated before you assert.

## 5-minute recording order

Record in this order; do not reorganize on the spot:

1. Three mock tiers (spyOn / fn / mock module) + when to use each (2 min)
2. Mocking time + a full mock-fetch example (1.5 min)
3. Four coverage metrics + handling flaky tests (1.5 min)

After recording, self-check:

- Did you state the difference among the three tiers.
- Did you say `vi.mock` is hoisted to the top.
- Did you say branch coverage is the most important.
- Did you name common flaky causes and how to fix them.

## Today's recap

The 3 points that most need review today:

1. Pairing `vi.hoisted` with `vi.mock` (using outer variables in the mock factory).
2. Why MSW (Mock Service Worker) can beat `vi.mock` in integration tests.
3. Wiring coverage reports into CI (incremental coverage gate vs full coverage gate).
