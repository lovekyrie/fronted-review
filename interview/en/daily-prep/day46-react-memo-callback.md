# Day 46 useMemo / useCallback / React.memo

## Goals

- Finish official React useMemo / useCallback / memo
- Produce **misuse cases** for the trio: wrapping everything in memo, wrong dependency arrays, wrapped objects that are still new references
- Combined with the React 19 compiler preview, explain “why you may not need to memo by hand in the future”

## Read in order

1. [React Performance Optimization](../framework/react/performance-optimization)
2. [Week 4 Hooks](../advanced/week4/hooks)

## Practice and self-check

**Checkpoints**

- `memo` only shallow-compares; it often fails when props contain objects / functions / arrays
- `useMemo` caches a **value**, `useCallback` caches a **function reference**; they are the same underneath
- React Compiler (future) will insert memo logic automatically, but production still needs handwritten memo today

**Produce or redraw from memory**

- Essence of the trio — [reference section](../framework/react/performance-optimization#day-46-essence-of-the-trio)
- Usage guidelines — [reference section](../framework/react/performance-optimization#day-46-usage-guidelines)
- Four cases that need a stable reference — [reference section](../framework/react/performance-optimization#day-46-four-cases-that-need-a-stable-reference)
- React Compiler (future) — [reference section](../framework/react/performance-optimization#day-46-react-compiler-future)
- Anti-pattern: memo fails — [reference section](../framework/react/performance-optimization#day-46-anti-pattern-memo-fails)
- Correct pattern: stable references — [reference section](../framework/react/performance-optimization#day-46-correct-pattern-stable-references)

**Answer aloud without reading a reference answer**

- 1. Is more useMemo always better?
- 2. When does React.memo fail?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Essence of the trio (useMemo caches values / useCallback caches functions / memo caches rendering) (1.5 minutes)
2. When to use vs when not to + four memo-failure cases (2 minutes)
3. Where React Compiler is heading + why you may not need handwritten memo in the future (1.5 minutes)

Self-check after recording:

- Did you state that useCallback is equivalent to `useMemo(() => fn, deps)`.
- Did you state that memo shallow-compares and fails on new references.
- Did you state that more memo is not always better, because comparison has cost.
- Did you mention React Compiler.

## Recap

The 3 points that most need follow-up today:

1. How to use `React.memo`’s second argument `areEqual(prevProps, nextProps)`, and what to watch out for.
2. Combining `useCallback` with `useRef` for an “always latest” callback pattern.
3. React Compiler’s compile strategy: how it automatically finds values that need caching.
