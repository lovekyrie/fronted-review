### Testing Strategy

In senior frontend interviews, testing questions are not about “whether you can write `expect`”, but about:

- how you split testing layers
- how you decide what is worth testing
- how you keep the test system from slowing delivery

A better way to answer is to treat testing as part of a quality strategy, not a tooling question.

#### 1. Why you need test layering

Different kinds of problems should be found by different layers of tests.

If you expect E2E to catch everything:

- cost is high
- feedback is slow
- failures are hard to locate

If you rely only on unit tests:

- many integration issues are not covered
- UI interaction and real browser behavior are missing

So a more reasonable approach is layering.

#### 2. Common testing layers

##### 2.1 Unit tests

Goals:

- verify pure functions, utilities, and state-transition logic
- fast feedback
- cheap coverage of edge cases

Good for:

- utility functions
- reducers
- data-transform functions
- parts of custom hooks that do not depend on a real DOM

##### 2.2 Component tests

Goals:

- verify how a component behaves in a near-real usage style
- focus on rendering, interaction, state changes, accessibility

Good for:

- form components
- list components
- dialogs
- data-display components

The point is not to test internals, but to test results the user can see and operate.

##### 2.3 Integration tests

Goals:

- verify that multiple modules collaborate correctly
- check behavior after components, state, and the request layer are combined

Good for:

- page-level interactions
- form submit flows
- linkage logic after a route change

##### 2.4 E2E tests

Goals:

- verify key business flows from the user’s perspective
- find integration issues in a real browser environment

Good for:

- login
- placing an order
- search
- pre-payment flows
- permission redirects

E2E should not cover every detail. It should cover the most critical, most failure-sensitive, most cross-layer main paths.

#### 3. A practical test pyramid

A more solid strategy is usually:

- lots of unit tests
- a moderate amount of component / integration tests
- a small number of critical E2E tests

The reason is not dogma, but cost and feedback speed:

- unit tests are cheap and fast
- component tests are closer to real usage
- E2E is slowest but closest to the real environment

#### 4. What is worth testing

Not all code deserves the same testing intensity.

Usually more worth testing:

- logic that easily regresses
- high business-value flows
- modules with complex state combinations
- places that historically caused incidents
- parts with many external dependencies and complex integration boundaries

Usually not worth over-testing:

- purely static pages with almost no logic
- internal behavior a third-party library already guarantees well
- assertions bound too tightly to implementation details

#### 5. How to write tests that survive refactoring

Good tests should focus more on behavior than implementation details.

Wrong direction:

- testing internal state variables
- testing whether a private method was called
- testing how many times a hook was called

A more solid direction:

- how the page changes after user input
- whether a button is clickable
- whether an error message appears
- whether the right request happens after submit

#### 6. The boundary of mocks

Mocks are a necessary tool, but they can be overused.

##### 6.1 What is a good fit to mock

- network requests
- time
- browser APIs
- third-party SDKs

##### 6.2 What is a poor fit to over-mock

- the core logic you actually want to verify
- real collaboration between components
- key user flows

The result of over-mocking is tests that are “all green”, then the real system breaks as soon as it runs.

#### 7. How to look at coverage

Coverage is a reference metric, not the goal itself.

High coverage is not high quality, because:

- assertions may be weak
- critical branches may be untested
- executing the code does not mean verifying the behavior

A better framing:

- use coverage to find obviously untested areas
- do not treat coverage as the only KPI
- care more about whether high-value logic has effective assertions

#### 8. How to handle flaky tests

Unstable tests are one of the things that most damage team trust in a test system.

Common causes:

- depending on time
- depending on the network
- depending on async timing
- depending on globally shared state
- depending on fragile selectors

Common ways to govern them:

- wait for a real visible state, not a blind timeout
- isolate test data
- reduce shared-environment dependencies
- use stable locators
- synchronize more explicitly on async behavior

#### 9. A recommended tool mix for frontend projects

##### 9.1 Unit / component tests

A good fit:

- Vitest
- Testing Library / Vue Test Utils

##### 9.2 E2E

A good fit:

- Playwright

Advantages of this mix:

- fast feedback
- good compatibility with modern frontend build tools
- covers different layers from functions to browser flows

#### 10. How to run tests in CI

Test strategy has to work with the delivery chain, not exist on its own.

A more reasonable CI approach is usually:

1. at the PR stage, run lint, unit tests, component tests, and build verification
2. at the main-branch stage, add critical E2E or smoke tests
3. after release, watch error monitoring and key metrics

Why:

- put fast feedback in front
- put high-cost verification later
- do not let the whole team get stuck on the slowest tests

#### 11. If this repo adds more tests, what to add first

This repo is a better fit to add two kinds of content first:

1. unit tests for hand-written implementations
2. a minimal smoke test for the docs site or key interactions

Highest-priority candidates:

- `hand-write/promise`
- `hand-write/simulate/eventEmitter.js`
- some utility functions and state-transition logic

#### 12. High-frequency interview questions

##### 12.1 How do unit, component, and E2E tests divide work

Unit tests own small logic and edges. Component tests own interaction and render behavior. E2E owns key business paths and real-browser integration issues.

##### 12.2 Why high coverage is not high quality

Because coverage only shows that code was executed. It does not mean key behavior was correctly verified, or that assertions are strong enough.

##### 12.3 Why tests should be layered

Because feedback speed, cost, and locating ability differ by layer. Pushing every problem onto one layer unbalances the quality system.

##### 12.4 What is a good frontend test

It stably finds high-value issues, gives fast feedback, is friendly to refactoring, is loosely coupled to implementation details, and is maintainable on the team.

#### 13. Interview answer suggestions

If you are asked about testing strategy, do not only say “we use Vitest and Playwright”. A more solid structure is:

1. first why you need test layering
2. then what each layer tests and does not test
3. then the trade-offs of mocks, coverage, and flaky tests
4. finally how CI carries the testing strategy

That upgrades the answer from “can write tests” to “can design a quality-assurance system”.

## Daily practice reference

### Day 64: Four-layer comparison

| Layer | Granularity | Runtime | Maintenance cost | Typical tools |
|----|------|----------|----------|----------|
| **Unit** | Function / class / hook | Milliseconds | Low | Vitest / Jest |
| **Component** | Single component | Seconds | Medium | VTU / Testing Library |
| **Integration** | Multiple components + API | Seconds | Medium-high | Vitest + MSW |
| **E2E** | Full page flows | Minutes | High | Playwright / Cypress |

Extra layer: **visual regression** (Percy / Chromatic) — screenshot diffs to catch UI changes.

### Day 64: Testing pyramid

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

### Day 64: What each layer should and should not test

| Layer | Test | Do not test |
|----|--------|----------|
| Unit | Pure functions, utils, custom hooks | No heavy mocks, no DOM |
| Component | Rendered output, user interaction, props/emit | No internal state, no style details |
| Integration | Page-level flows, API wiring | Do not cover every branch |
| E2E | Core business paths (login/order/pay) | Do not cover every combination |

### Day 64: Coverage ≠ quality

- High coverage is not high quality: testing only the happy path can still be 100% line coverage.
- **Branch coverage** is more meaningful than line coverage.
- Coverage is a floor, not a goal: 80% is a common reasonable line.

### Day 64: Testing-strategy decision tree

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

### Day 65: Vitest core API cheat sheet

| API | Role |
|-----|------|
| `describe(name, fn)` | Test group |
| `it(name, fn)` / `test(name, fn)` | A single test |
| `expect(value)` | Assertion entry |
| `beforeEach / afterEach` | Hooks around each test |
| `beforeAll / afterAll` | Hooks around the whole group |
| `it.each(table)(name, fn)` | Parameterized tests |
| `it.skip / it.only / it.todo` | Skip / focus / todo |

### Day 65: Common matchers

```ts
expect(1 + 1).toBe(2)                    // strict equality
expect({ a: 1 }).toEqual({ a: 1 })       // deep equality
expect([1, 2, 3]).toContain(2)            // contains
expect(fn).toHaveBeenCalledWith('arg')    // function was called
expect(fn).toThrow(/error/)              // throws
expect(value).toBeTruthy()               // truthy
expect(value).toBeNull()                 // null
```

### Day 65: Choosing an environment

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

### Day 65: Why Vitest integrates well with Vite

- Shares `vite.config.ts` (alias, plugins, TS config).
- Native ESM + on-demand compile; startup is very fast.
- Watch mode only re-runs affected tests.
- Built-in TypeScript; no Babel needed.
- Jest-compatible API (low migration cost).

### Day 65: Full test example

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

### Day 65: Async tests

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

### Day 66: Vue Test Utils core API

| API | Role |
|-----|------|
| `mount(Component, options)` | Full render (including children) |
| `shallowMount(Component, options)` | Shallow render (children become stubs) |
| `wrapper.find(selector)` | Find a DOM element |
| `wrapper.findComponent(Comp)` | Find a child component |
| `wrapper.text()` | Get text content |
| `wrapper.html()` | Get HTML |
| `wrapper.trigger('click')` | Trigger an event |
| `wrapper.setValue(value)` | Set an input value |
| `wrapper.emitted()` | Get emit records |
| `wrapper.props()` | Get props |
| `wrapper.setProps(props)` | Update props |

### Day 66: Common mount options

```ts
mount(MyComponent, {
  props: { title: 'Hello' },
  slots: { default: '<span>slot content</span>' },
  global: {
    plugins: [pinia, router],
    stubs: { ChildComponent: true },
    mocks: { $t: (key: string) => key },
    provide: { theme: 'dark' },
  },
})
```

### Day 66: Assertion principle: test behavior, not implementation

| ✅ Test | ❌ Do not test |
|--------|---------|
| Rendered text / DOM structure | Internal `ref` / `reactive` values |
| UI changes after user interaction | Whether an internal method was called |
| Emitted events and payloads | How a computed is calculated |
| Render after props change | How many times a watcher fired |

### Day 66: VTU vs Testing Library

| Dimension | VTU | @testing-library/vue |
|------|-----|----------------------|
| API style | Operate on the component instance | Query from the user’s view |
| Query style | CSS selector / component ref | getByRole / getByText |
| Fit | Need access to component internals | Pure user-behavior tests |

### Day 66: Full Counter component test

```vue
<!-- Counter.vue -->
<template>
  <div>
    <span class="count">{{ count }}</span>
    <button @click="increment">+1</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const count = ref(0)
const emit = defineEmits(['change'])
function increment() {
  count.value++
  emit('change', count.value)
}
</script>
```

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter', () => {
  it('renders initial count', () => {
    const wrapper = mount(Counter)
    expect(wrapper.find('.count').text()).toBe('0')
  })

  it('increments on click', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.count').text()).toBe('1')
  })

  it('emits change event', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')![0]).toEqual([1])
  })
})
```

### Day 66: Props + slot test

```ts
it('renders with props and slot', () => {
  const wrapper = mount(Card, {
    props: { title: 'Hello' },
    slots: { default: '<p>body</p>' },
  })
  expect(wrapper.text()).toContain('Hello')
  expect(wrapper.html()).toContain('<p>body</p>')
})
```

### Day 66: Form test

```ts
it('submits form data', async () => {
  const wrapper = mount(LoginForm)
  await wrapper.find('input[name="email"]').setValue('a@b.com')
  await wrapper.find('input[name="password"]').setValue('123456')
  await wrapper.find('form').trigger('submit')

  expect(wrapper.emitted('submit')![0][0]).toEqual({
    email: 'a@b.com',
    password: '123456',
  })
})
```

### Day 67: Three mock tiers

| Tier | API | Behavior | Fit |
|------|-----|------|------|
| **Spy** | `vi.spyOn(obj, 'method')` | Watch calls, keep original impl | Verify a function was called |
| **Stub** | `vi.fn()` | Create an empty stand-in | Callbacks, event handlers |
| **Module mock** | `vi.mock('module')` | Replace the whole module | Third-party deps, API modules |

### Day 67: vi.spyOn

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

### Day 67: vi.fn

```ts
const onClick = vi.fn()
mount(Button, { props: { onClick } })
await wrapper.find('button').trigger('click')
expect(onClick).toHaveBeenCalledTimes(1)
```

### Day 67: vi.mock (module level)

```ts
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1 }),
  fetchPosts: vi.fn().mockResolvedValue([]),
}))
// the entire './api' module is replaced
// vi.mock is hoisted to the top of the file
```

### Day 67: Mocking time

```ts
vi.useFakeTimers()

setTimeout(() => console.log('done'), 1000)
vi.advanceTimersByTime(1000)  // fast-forward 1000ms

vi.useRealTimers()  // restore real time
```

### Day 67: Four coverage metrics

| Metric | Meaning | Importance |
|------|------|--------|
| **Branch** | Every if/else branch is taken | ⭐⭐⭐ most important |
| **Function** | Every function is called | ⭐⭐ |
| **Statement** | Every statement runs | ⭐⭐ |
| **Line** | Every line runs | ⭐ easy to game |

### Day 67: Common flaky-test causes

| Cause | Symptom | Fix |
|------|------|------|
| Time dependence | Sometimes times out, sometimes passes | `vi.useFakeTimers` |
| Order dependence | Passes alone, fails in the suite | Independent setup per test |
| Async races | Intermittent failures | `await flushPromises` / wait for a condition |
| Random data | Non-deterministic results | Seed or fixture data |
| Environment leftover | Global state leaks | Clean up in `afterEach` |

### Day 67: Mock fetch + async test

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

### Day 67: Fake-timer test

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

### Day 68: Locator priority

| Priority | Method | Example | Why |
|--------|------|------|------|
| 1 | `getByRole` | `getByRole('button', { name: 'Submit' })` | Semantic, close to the user |
| 2 | `getByLabel` | `getByLabel('Username')` | Most natural for forms |
| 3 | `getByText` | `getByText('Welcome back')` | Visible text |
| 4 | `getByTestId` | `getByTestId('submit-btn')` | Fallback |
| 5 | `locator('css')` | `locator('.btn-primary')` | Last resort |

### Day 68: Common expect assertions

```ts
await expect(page).toHaveURL('/dashboard')
await expect(page).toHaveTitle('Home')
await expect(locator).toBeVisible()
await expect(locator).toHaveText('Hello')
await expect(locator).toHaveCount(3)
await expect(locator).toBeDisabled()
await expect(locator).toHaveAttribute('href', '/about')
```

### Day 68: Playwright core features

| Feature | Notes |
|------|------|
| **Auto-wait** | Automatically wait until the element is visible + actionable before acting |
| **Retry** | Assertions retry by default until timeout |
| **Trace Viewer** | Records per-step screenshots + network + DOM; great for debugging |
| **Multi-browser** | Chromium / Firefox / WebKit |
| **Parallel** | `workers` controls concurrency |
| **Codegen** | `npx playwright codegen` records and generates code |

### Day 68: E2E strategy principles

```text
✅ Cover: core business paths (login/signup/order/pay/logout)
✅ Cover: P0 regression (smoke that every release must pass)
❌ Do not cover: every UI detail (use component tests instead)
❌ Do not cover: every combination (use parameterized unit tests instead)
```

### Day 68: Full E2E example: login flow

```ts
import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Account').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Log in' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Welcome back')).toBeVisible()
  })

  test('invalid credentials shows error', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Account').fill('wrong@example.com')
    await page.getByLabel('Password').fill('wrong')
    await page.getByRole('button', { name: 'Log in' }).click()

    await expect(page.getByText('Invalid account or password')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })
})
```

### Day 68: Page Object Model

```ts
// pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Account').fill(email)
    await this.page.getByLabel('Password').fill(password)
    await this.page.getByRole('button', { name: 'Log in' }).click()
  }
}

// tests/login.spec.ts
test('login', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login('admin@example.com', 'password123')
  await expect(page).toHaveURL('/dashboard')
})
```

### Day 68: CI config

```yaml
# .github/workflows/e2e.yml
- name: Run E2E
  run: npx playwright test --workers=4 --reporter=html
- name: Upload trace
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-traces
    path: test-results/
```

### Day 69: Case-matrix method

```text
1. List API edges: resolve / reject / then / catch / finally / all / race / allSettled / any
2. Split each API into happy + error + edge:
   - Happy path: basic behavior is correct
   - Error path: errors are caught correctly
   - Edge: empty array / empty value / multiple resolve / broken then chain
3. Cross-cutting: then chaining + reject piercing / one reject inside all
```

### Day 69: Must-have Promise cases

| API | Happy | Error | Edge |
|-----|------|------|------|
| `resolve/reject` | Basic value passing | `then` does not run after reject | Multiple resolve only takes effect once |
| `then` | Chain returns a new value | Callback throws → catch | Value piercing (`then` with no callback) |
| `catch` | Catches reject | Catches throw inside `then` | Can continue `then` after `catch` |
| `finally` | Runs on both success and failure | Throw inside `finally` | Does not change the chained value |
| `all` | All resolve → result array | Any reject → fail fast | Empty array → resolve([]) |
| `race` | First settle decides the result | First reject → reject | Empty array → pending forever |
| `allSettled` | All results (including rejected) | - | Empty array → resolve([]) |
| `any` | First resolve → resolve | All reject → AggregateError | Empty array → reject |

### Day 69: Common misses

- `then` returns a Promise (not a value) — must unwrap recursively.
- `resolve(thenable)` — a thenable is adopted.
- Async resolve — resolve asynchronously in the executor; whether `then` callbacks enqueue correctly.

### Day 69: Full MyPromise tests

```ts
import { describe, it, expect } from 'vitest'
import { MyPromise } from './my-promise'

describe('MyPromise', () => {
  // basic resolve
  it('resolves with value', async () => {
    const p = new MyPromise((resolve) => resolve(42))
    await expect(p).resolves.toBe(42)
  })

  // basic reject
  it('rejects with reason', async () => {
    const p = new MyPromise((_, reject) => reject('err'))
    await expect(p).rejects.toBe('err')
  })

  // then chaining
  it('chains then calls', async () => {
    const result = await new MyPromise((resolve) => resolve(1))
      .then(v => v + 1)
      .then(v => v * 2)
    expect(result).toBe(4)
  })

  // then value piercing
  it('passes through when then has no callback', async () => {
    const result = await new MyPromise((resolve) => resolve(42))
      .then()
      .then(v => v)
    expect(result).toBe(42)
  })

  // catch
  it('catches rejected promise', async () => {
    const result = await new MyPromise((_, reject) => reject('err'))
      .catch(e => `caught: ${e}`)
    expect(result).toBe('caught: err')
  })

  // continue then after catch
  it('continues chain after catch', async () => {
    const result = await new MyPromise((_, reject) => reject('err'))
      .catch(() => 'recovered')
      .then(v => v + '!')
    expect(result).toBe('recovered!')
  })

  // multiple resolve only takes effect once
  it('ignores multiple resolve calls', async () => {
    const p = new MyPromise((resolve) => {
      resolve(1)
      resolve(2)
    })
    await expect(p).resolves.toBe(1)
  })

  // then callback throws
  it('catches throw in then callback', async () => {
    const result = await new MyPromise((resolve) => resolve(1))
      .then(() => { throw new Error('boom') })
      .catch(e => e.message)
    expect(result).toBe('boom')
  })
})

describe('MyPromise.all', () => {
  it('resolves all', async () => {
    const result = await MyPromise.all([
      MyPromise.resolve(1),
      MyPromise.resolve(2),
      MyPromise.resolve(3),
    ])
    expect(result).toEqual([1, 2, 3])
  })

  it('rejects on first failure', async () => {
    await expect(
      MyPromise.all([
        MyPromise.resolve(1),
        MyPromise.reject('err'),
        MyPromise.resolve(3),
      ])
    ).rejects.toBe('err')
  })

  it('resolves empty array', async () => {
    await expect(MyPromise.all([])).resolves.toEqual([])
  })
})
```
