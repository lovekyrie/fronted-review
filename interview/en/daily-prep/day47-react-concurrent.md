# Day 47 useTransition / useDeferredValue and Concurrent Features Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 47 | Concurrency | [Concurrency](../advanced/week4/concurrency) |

## Today's Goals

- Finish React useTransition, useDeferredValue, Suspense
- Produce a concurrent-rendering answer script: Lanes / interruptible Render / priority
- Pick a real scenario: a search box that renders a large result list while keeping input smooth

## Reading Checkpoints

- `useTransition` marks an update as **non-urgent**, so the browser can prioritize urgent work (input)
- `useDeferredValue` does not change the trigger; it **defers the consumer**; the two complement each other
- Concurrent is not multithreading; it is **interruptible scheduling** on a single thread

## Cheat Sheet / Knowledge Points

### Core concurrent-rendering ideas

- **Not multithreading**; it is **interruptible scheduling** on a single thread.
- High-priority updates (user input) can interrupt low-priority updates (list rendering).
- Interrupted low-priority work is not lost; it resumes when idle.

### useTransition

```jsx
const [isPending, startTransition] = useTransition()

function handleChange(e) {
  // Urgent update: the input responds immediately
  setInput(e.target.value)
  // Non-urgent update: the result list can wait
  startTransition(() => {
    setSearchResults(filterData(e.target.value))
  })
}
```

- setState inside `startTransition` is marked as TransitionLane (low priority).
- When `isPending` is true you can show a loading indicator.
- If the user keeps typing, the previous transition render is interrupted.

### useDeferredValue

```jsx
const deferredQuery = useDeferredValue(query)
// deferredQuery “lags” the update so the current frame can prioritize urgent work
```

- Difference from `useTransition`: `useTransition` marks low priority on the **trigger**; `useDeferredValue` delays using the value on the **consumer**.
- Fits cases where you cannot control who calls setState (for example a value from props).

### How to choose

| Scenario | Choose |
|------|------|
| You control setState | `useTransition` |
| The value comes from props/outside | `useDeferredValue` |
| You need a loading state | `useTransition` (has `isPending`) |

### Working with Suspense

```jsx
<Suspense fallback={<Loading />}>
  <SearchResults query={deferredQuery} />
</Suspense>
```

- Transition + Suspense: when a low-priority render suspends, show the old UI instead of the fallback.
- Better UX: the input stays smooth, and old results stay visible until new results are ready.

## Handwritten / Flowcharts

### Full search-box example

```jsx
function SearchPage() {
  const [input, setInput] = useState('')
  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState([])

  function handleChange(e) {
    setInput(e.target.value)  // urgent: the input responds immediately
    startTransition(() => {
      // non-urgent: filter a large dataset
      setResults(hugeList.filter(item => item.includes(e.target.value)))
    })
  }

  return (
    <>
      <input value={input} onChange={handleChange} />
      {isPending && <Spinner />}
      <ul>
        {results.map(r => <li key={r}>{r}</li>)}
      </ul>
    </>
  )
}
```

### Concurrent scheduling flow

```text
User types 'a'
  → SyncLane: setInput('a') → immediately render the input
  → TransitionLane: setResults(filter) → start rendering the list
User keeps typing 'ab' (the list is still rendering)
  → SyncLane: setInput('ab') → interrupt list render → immediately render the input
  → TransitionLane: setResults(filter('ab')) → discard the previous render and start over
Result: the input stays smooth; the list only renders the final result
```

## Oral Questions

### 1. How do you choose between useTransition and useDeferredValue?

Answer template:

> It depends on whether you can control the setState call. If you control where the update is triggered (for example in an event handler), use `useTransition` and wrap the non-urgent setState in `startTransition`. It also gives you `isPending` for a loading state.
>
> If you cannot control setState (for example the value comes from props, or from a third-party library), use `useDeferredValue` and delay using the value on the consumer. The essence is the same — both mark the update as low priority so urgent updates run first.

### 2. React concurrent is not multithreading, so where is the “concurrency”?

Answer template:

> React’s concurrency is at the **scheduler layer**, not OS threads. It implements “interruptible rendering” on a single thread. Concretely: Render-phase work is split into small tasks (each Fiber node is a unit of work). After each Fiber, it checks whether a higher-priority task arrived. If so, it pauses the current render, handles the high-priority work first, and resumes when idle.
>
> It is like OS time slicing: there is only one CPU (the JS thread), but fast switching makes it feel like several tasks are running “at the same time”. High priority (user input) is never blocked; low priority (large list rendering) finishes in idle time.

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. What concurrent rendering means (single-thread interruptible scheduling + Lanes priority) (1.5 minutes)
2. useTransition search-box scenario + isPending (2 minutes)
3. useDeferredValue scenario + keeping old UI with Suspense (1.5 minutes)

Self-check after recording:

- Did you state that concurrent is not multithreading but interruptible scheduling.
- Did you state that startTransition marks low priority.
- Did you state that useTransition controls the trigger and useDeferredValue controls the consumer.
- Did you state that Suspense + Transition keeps the old UI and does not flash the fallback.

## Today's Review

The 3 points that most need follow-up today:

1. How `startTransition` and `useDeferredValue` differ in Lane assignment at the source level.
2. Suspense’s “reveal” strategy in Concurrent mode (when to show fallback vs keep the old UI).
3. How `useOptimistic` works together with Transition.
