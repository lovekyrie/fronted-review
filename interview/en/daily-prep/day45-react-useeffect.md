# Day 45 useEffect Pitfalls and Strict Mode Double Invoke

## Goals

- Finish the official React useEffect docs (focus on “Specifying reactive dependencies”)
- Produce a three-pitfall checklist for useEffect: incomplete deps / missing cleanup / unstable object/function refs
- Explain the purpose of Strict Mode double invoke: help you find **non-idempotent** effects

## Read in order

1. [Week 4 Hooks](../advanced/week4/hooks)
2. [React Hooks](../framework/react/hooks)

## Practice and self-check

**Checkpoints**

- Every reactive value read inside an effect should go into the dependency array; use `useEffectEvent` (React 19) to isolate values you do not want to retrigger
- Cleanup exists so “each effect run feels like the first time”; commonly used for subscriptions / timers / racing requests
- Strict Mode double-mount is there to surface the cleanup you forgot to write

**Produce or redraw from memory**

- When useEffect runs — [reference section](../advanced/week4/hooks#day-45-when-useeffect-runs)
- When cleanup runs — [reference section](../advanced/week4/hooks#day-45-when-cleanup-runs)
- Three-pitfall checklist — [reference section](../advanced/week4/hooks#day-45-three-pitfall-checklist)
- Strict Mode double invoke — [reference section](../advanced/week4/hooks#day-45-strict-mode-double-invoke)
- Handling racing requests — [reference section](../advanced/week4/hooks#day-45-handling-racing-requests)
- The unstable-ref pitfall — [reference section](../advanced/week4/hooks#day-45-the-unstable-ref-pitfall)
- useEffect vs useLayoutEffect — [reference section](../advanced/week4/hooks#day-45-useeffect-vs-uselayouteffect)

**Answer aloud without reading a reference answer**

- 1. When exactly does useEffect cleanup run?
- 2. Why does Strict Mode double-invoke? What does it expose?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. useEffect timing (async, after DOM update and browser paint) + difference from useLayoutEffect (2 minutes)
2. Three pitfalls (incomplete deps / missing cleanup / unstable refs) + racing-request fix (2 minutes)
3. Purpose of Strict Mode double invoke + the idempotency requirement (1 minute)

Self-check after recording:

- Did you state that cleanup runs “before deps change” and “on unmount”.
- Did you state that racing requests are handled with AbortController.
- Did you state that Strict Mode exposes non-idempotent effects.
- Did you state that useLayoutEffect blocks paint and is for DOM reads/writes.

## Recap

The 3 points that most need follow-up today:

1. How to use `useEffectEvent` (React 19 experiment): isolate values that should not retrigger the effect.
2. How to write async functions inside an effect (you cannot make the effect itself async; wrap a layer).
3. When `useInsertionEffect` applies (CSS-in-JS libraries injecting styles).
