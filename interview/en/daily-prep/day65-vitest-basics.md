# Day 65 Vitest basics execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 65 | Vitest basics | [Testing strategy](../advanced/week7/testing-strategy), [Automated testing](../engineering/automated-testing) |

## Today's goals

- Finish Vitest Features
- Add a `vitest.config.ts` in the repo and get a minimal test suite running
- Produce a Vitest cheat sheet: `describe / it / expect / beforeEach / vi.mock / test.each`

## Reading notes

- Vitest shares Vite config; no extra Babel/tsconfig wiring
- Environment switch: `happy-dom` / `jsdom` / `node`; `happy-dom` is lighter for frontend component tests
- `test.each` cuts a lot of duplicated cases

## Cheat sheet / knowledge

### Vitest core API cheat sheet

| API | Role |
|-----|------|
| `describe(name, fn)` | Test group |
| `it(name, fn)` / `test(name, fn)` | A single test |
| `expect(value)` | Assertion entry |
| `beforeEach / afterEach` | Hooks around each test |
| `beforeAll / afterAll` | Hooks around the whole group |
| `it.each(table)(name, fn)` | Parameterized tests |
| `it.skip / it.only / it.todo` | Skip / focus / todo |

### Common matchers

```ts
expect(1 + 1).toBe(2)                    // strict equality
expect({ a: 1 }).toEqual({ a: 1 })       // deep equality
expect([1, 2, 3]).toContain(2)            // contains
expect(fn).toHaveBeenCalledWith('arg')    // function was called
expect(fn).toThrow(/error/)              // throws
expect(value).toBeTruthy()               // truthy
expect(value).toBeNull()                 // null
```

### Choosing an environment

| Environment | Traits | Fit |
|------|------|------|
| `node` | No DOM APIs | Pure functions / utils / API |
| `happy-dom` | Light DOM mock, fast | Vue/React component tests |
| `jsdom` | Full DOM mock, slower | Need fuller browser APIs |

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'happy-dom',  // default environment
  },
})

// Per-file override
// @vitest-environment jsdom
```

### Why Vitest integrates well with Vite

- Shares `vite.config.ts` (alias, plugins, TS config).
- Native ESM + on-demand compile; startup is very fast.
- Watch mode only re-runs affected tests.
- Built-in TypeScript; no Babel needed.
- Jest-compatible API (low migration cost).

## Handwritten / flowcharts

### Full test example

```ts
import { describe, it, expect, beforeEach } from 'vitest'

// function under test
function formatPrice(cents: number): string {
  return `¥${(cents / 100).toFixed(2)}`
}

describe('formatPrice', () => {
  // parameterized tests
  it.each([
    [0, '¥0.00'],
    [100, '¥1.00'],
    [999, '¥9.99'],
    [12345, '¥123.45'],
  ])('formatPrice(%i) = %s', (input, expected) => {
    expect(formatPrice(input)).toBe(expected)
  })

  // edge case
  it('handles negative values', () => {
    expect(formatPrice(-100)).toBe('¥-1.00')
  })
})
```

### Async tests

```ts
import { it, expect, vi } from 'vitest'

it('fetches user data', async () => {
  const mockFetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ name: 'Alice' }),
  })
  vi.stubGlobal('fetch', mockFetch)

  const res = await fetch('/api/user')
  const data = await res.json()

  expect(data.name).toBe('Alice')
  expect(mockFetch).toHaveBeenCalledWith('/api/user')

  vi.unstubAllGlobals()
})
```

## Oral questions

### 1. Advantages of Vitest over Jest?

Answer template:

> Three core wins. First, it shares Vite config — alias, plugins, and TS support reuse `vite.config.ts`, with no separate Babel/tsconfig; zero-config out of the box. Second, native ESM + on-demand compile, so startup and watch re-runs are much faster than Jest. Third, the API is Jest-compatible (`describe`/`it`/`expect`/`vi.mock`), so migration is cheap.
>
> Extra: built-in coverage (c8/v8), a built-in UI, Workspace (monorepo), and experimental browser mode.

### 2. How do you choose `happy-dom` vs `jsdom`?

Answer template:

> Default to `happy-dom` — it is a lightweight DOM mock, 2–3× faster than jsdom, and covers about 90% of common DOM APIs, which is enough for Vue/React component tests. Switch to `jsdom` only when you hit APIs happy-dom does not support well (`IntersectionObserver`, `Canvas`, complex `getComputedStyle` behavior).
>
> Pure-function tests should use the `node` environment — fastest. Set a global default in `vitest.config.ts` and override per file with a comment.

## 5-minute recording order

Record in this order; do not reorganize on the spot:

1. Vitest + Vite integration advantages + vs Jest (1.5 min)
2. Core APIs (`describe`/`it`/`expect`/`beforeEach`/`it.each`) (2 min)
3. Environment choice (`node`/`happy-dom`/`jsdom`) + watch mode (1.5 min)

After recording, self-check:

- Did you say Vitest shares Vite config.
- Did you mention `it.each` parameterized tests.
- Did you say happy-dom is faster than jsdom.
- Did you say the API is Jest-compatible.

## Today's recap

The 3 points that most need review today:

1. When to use `vi.hoisted` (you need hoisting when using variables inside `vi.mock`).
2. Configuring Vitest Workspace in a monorepo.
3. Current state and fit of Vitest Browser Mode.
