# Day 45 useEffect Pitfalls and Strict Mode Double Invoke Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 45 | useEffect pitfalls | [Week 4 Hooks](../advanced/week4/hooks), [React Hooks](../framework/react/hooks) |

## Today's Goals

- Finish the official React useEffect docs (focus on “Specifying reactive dependencies”)
- Produce a three-pitfall checklist for useEffect: incomplete deps / missing cleanup / unstable object/function refs
- Explain the purpose of Strict Mode double invoke: help you find **non-idempotent** effects

## Reading Checkpoints

- Every reactive value read inside an effect should go into the dependency array; use `useEffectEvent` (React 19) to isolate values you do not want to retrigger
- Cleanup exists so “each effect run feels like the first time”; commonly used for subscriptions / timers / racing requests
- Strict Mode double-mount is there to surface the cleanup you forgot to write

## Cheat Sheet / Knowledge Points

### When useEffect runs

```text
component render → DOM update → browser paint → useEffect runs asynchronously
                                      ↑ does not block paint

Compare useLayoutEffect:
component render → DOM update → useLayoutEffect runs synchronously → browser paint
                         ↑ blocks paint
```

### When cleanup runs

1. **On unmount**: run cleanup.
2. **When deps change**: first run the **old effect’s cleanup**, then run the **new effect**.
3. Order: old cleanup → new effect.

### Three-pitfall checklist

| Pitfall | Symptom | Fix |
|----|------|------|
| Incomplete deps | The effect reads state/props but they are not in deps | Add every reactive value to deps, or use `useEffectEvent` |
| Missing cleanup | Subscriptions/timers/requests are not cleaned up → leaks / races | return a cleanup function |
| Unstable object/function refs | Each render creates a new object/function → the effect runs forever | Stabilize the ref with `useMemo` / `useCallback` |

### Strict Mode double invoke

- **Development only**: React will mount → unmount → mount the component.
- Purpose: expose **non-idempotent** effects (missing cleanup, duplicate subscriptions, duplicate requests).
- If your effect writes cleanup correctly, double invoke has no extra side effects.

## Handwritten / Flowcharts

### Handling racing requests

```jsx
useEffect(() => {
  const controller = new AbortController()
  
  async function fetchData() {
    try {
      const res = await fetch(`/api/user/${id}`, {
        signal: controller.signal
      })
      const data = await res.json()
      setUser(data)  // set only if not aborted
    } catch (e) {
      if (e.name !== 'AbortError') throw e
    }
  }
  
  fetchData()
  
  return () => controller.abort()  // abort the previous request when deps change
}, [id])
```

### The unstable-ref pitfall

```jsx
// ❌ each render creates a new object → the effect runs forever
useEffect(() => {
  fetch('/api', { headers: { token } })
}, [{ token }])  // a new reference every time!

// ✅ stabilize the reference with useMemo
const headers = useMemo(() => ({ token }), [token])
useEffect(() => {
  fetch('/api', { headers })
}, [headers])
```

### useEffect vs useLayoutEffect

```jsx
// useEffect: async, does not block paint. Fine for most cases
useEffect(() => {
  document.title = `Count: ${count}`
}, [count])

// useLayoutEffect: sync, blocks paint. For reading/writing DOM layout
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect()
  // adjust position from rect to avoid flicker
}, [])
```

## Oral Questions

### 1. When exactly does useEffect cleanup run?

Answer template:

> Two timings. First, cleanup runs when the component **unmounts**. Second, when a dependency change causes the effect to **re-run**, the old effect’s cleanup runs first, then the new effect.
>
> This design exists so every effect run starts from a “clean” environment. For example, if you subscribed to a WebSocket for some id, when id changes you must cancel the old subscription before creating a new one. Without cleanup you would have multiple subscriptions at once, causing leaks and mixed-up data.
>
> A memory hook: cleanup clears the “previous” side effect so “this” run has a clean environment.

### 2. Why does Strict Mode double-invoke? What does it expose?

Answer template:

> In development, Strict Mode mounts → unmounts → mounts the component, so effects also run twice. The goal is to expose non-idempotent side effects: if your effect writes cleanup correctly (unsubscribe, clear timers, abort requests), the state after a double run should be identical to a single run.
>
> If double invoke produces bugs (duplicate requests, duplicate subscriptions, extra DOM content), your cleanup is wrong. This matters even more in Concurrent mode, because React may interrupt rendering and start over; effects must be idempotent.
>
> Production does not double-invoke, so it does not affect live performance.

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. useEffect timing (async, after DOM update and browser paint) + difference from useLayoutEffect (2 minutes)
2. Three pitfalls (incomplete deps / missing cleanup / unstable refs) + racing-request fix (2 minutes)
3. Purpose of Strict Mode double invoke + the idempotency requirement (1 minute)

Self-check after recording:

- Did you state that cleanup runs “before deps change” and “on unmount”.
- Did you state that racing requests are handled with AbortController.
- Did you state that Strict Mode exposes non-idempotent effects.
- Did you state that useLayoutEffect blocks paint and is for DOM reads/writes.

## Today's Review

The 3 points that most need follow-up today:

1. How to use `useEffectEvent` (React 19 experiment): isolate values that should not retrigger the effect.
2. How to write async functions inside an effect (you cannot make the effect itself async; wrap a layer).
3. When `useInsertionEffect` applies (CSS-in-JS libraries injecting styles).
