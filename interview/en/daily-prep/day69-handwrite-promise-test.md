# Day 69 Adding tests for handwrite/promise execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 69 | Adding tests for handwrite | [Testing strategy](../advanced/week7/testing-strategy), [promisify](../handwrite/promisify) |

## Today's goals

- Look at the repo `hand-write/promise` or `hand-write/simulate/eventEmitter.js`
- Add Vitest unit tests for one of them: happy path + error path + edges
- Write up “3 steps to test a library”: map API edges → case matrix → add tests

## Reading notes

- For Promise, test: `then / catch / finally / resolve / reject / all / race / allSettled / any`
- For EventEmitter, test: `on / off / emit / once / argument passing / error isolation`
- Interviews often ask “what coverage do you have?” — you need to say **coverage is the result; the case matrix is the process**

## Cheat sheet / knowledge

### Case-matrix method

```text
1. List API edges: resolve / reject / then / catch / finally / all / race / allSettled / any
2. Split each API into happy + error + edge:
   - Happy path: basic behavior is correct
   - Error path: errors are caught correctly
   - Edge: empty array / empty value / multiple resolve / broken then chain
3. Cross-cutting: then chaining + reject piercing / one reject inside all
```

### Must-have Promise cases

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

### Common misses

- `then` returns a Promise (not a value) — must unwrap recursively.
- `resolve(thenable)` — a thenable is adopted.
- Async resolve — resolve asynchronously in the executor; whether `then` callbacks enqueue correctly.

## Handwritten / flowcharts

### Full MyPromise tests

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

## Oral questions

### 1. How would you plan tests for a library?

Answer template:

> Three steps. First, **list API edges** — write down every public API and split each into happy path, error path, and edge. Second, **draw a case matrix** — API × scenario as a table; each cell is a test. Third, **implement by priority** — happy path first to lock basic behavior, then error paths for robustness, then edges for completeness.
>
> For Promise, I would list resolve/reject/then/catch/finally/all/race and similar APIs, with at least happy + error + edge for each. Use `it.each` to cut duplication.

### 2. How do you handle async flows in tests?

Answer template:

> Three ways. First, `async/await` — preferred: `await expect(asyncFn()).resolves.toBe(value)` or `await expect(asyncFn()).rejects.toThrow()`. Second, return a Promise — if `it`’s callback returns a Promise, Vitest waits for it to resolve. Third, `vi.useFakeTimers` to control async timing — for `setTimeout` / `setInterval` logic.
>
> A common trap is forgetting `await` — the test passes before the assertion finishes, so it looks green but verified nothing. Vitest has an experimental `--no-false-positive` option to help catch this.

## 5-minute recording order

Record in this order; do not reorganize on the spot:

1. Case-matrix method (API edges → happy/error/edge) (1.5 min)
2. Key Promise cases (then chain / value piercing / all reject) (2 min)
3. How to read coverage + common misses (1.5 min)

After recording, self-check:

- Did you state the three-step case matrix.
- Did you mention then value piercing and multiple-resolve edges.
- Did you mention `async/await` in tests.
- Did you say coverage is the result; the case matrix is the process.

## Today's recap

The 3 points that most need review today:

1. Recursive unwrap tests when `then` returns a Promise.
2. EventEmitter `once` and `off` edge tests.
3. Using Vitest `--coverage` to find missed branches.
