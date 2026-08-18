# Day 46 useMemo / useCallback / React.memo Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 46 | memo / callback | [React Performance Optimization](../framework/react/performance-optimization), [Week 4 Hooks](../advanced/week4/hooks) |

## Today's Goals

- Finish official React useMemo / useCallback / memo
- Produce **misuse cases** for the trio: wrapping everything in memo, wrong dependency arrays, wrapped objects that are still new references
- Combined with the React 19 compiler preview, explain “why you may not need to memo by hand in the future”

## Reading Checkpoints

- `memo` only shallow-compares; it often fails when props contain objects / functions / arrays
- `useMemo` caches a **value**, `useCallback` caches a **function reference**; they are the same underneath
- React Compiler (future) will insert memo logic automatically, but production still needs handwritten memo today

## Cheat Sheet / Knowledge Points

### Essence of the trio

| API | What it caches | Essence |
|-----|----------|------|
| `useMemo(fn, deps)` | caches the **computed result** | if deps are unchanged, return the previous result |
| `useCallback(fn, deps)` | caches the **function reference** | equivalent to `useMemo(() => fn, deps)` |
| `React.memo(Comp)` | caches **component render** | skip re-render if props are shallow-equal |

### Usage guidelines

**When you should use them:**
- Props (functions/objects) passed to a `memo` child need a stable reference.
- Expensive derived values (sorting, filtering a large array) use `useMemo`.
- Objects/functions used as `useEffect` dependencies need a stable reference.

**When you should not:**
- Simple math (`a + b`) does not need `useMemo`; caching itself has cost.
- If the component is cheap to render, memo’s comparison cost may be higher than just re-rendering.
- Wrapping everything in memo blindly increases complexity and hurts readability.

### Four cases that need a stable reference

1. A callback passed to a `memo` child → `useCallback`
2. An object/array passed to a `memo` child → `useMemo`
3. A `useEffect` dependency that is an object/function → `useMemo` / `useCallback`
4. A third-party library (for example react-query’s queryKey) needs a stable reference → `useMemo`

### React Compiler (future)

React Compiler will analyze components at compile time and insert optimizations equivalent to `useMemo / useCallback / memo`, so developers no longer write them by hand. It is still experimental; production projects still need to do it manually.

## Handwritten / Flowcharts

### Anti-pattern: memo fails

```jsx
const Child = React.memo(({ config }) => {
  console.log('Child render')
  return <div>{config.name}</div>
})

function Parent() {
  const [count, setCount] = useState(0)
  // ❌ each render creates a new object; memo’s shallow compare is always false
  return <Child config={{ name: 'test' }} />
}
```

### Correct pattern: stable references

```jsx
const Child = React.memo(({ config, onClick }) => {
  console.log('Child render')
  return <div onClick={onClick}>{config.name}</div>
})

function Parent() {
  const [count, setCount] = useState(0)
  // ✅ useMemo stabilizes the object reference
  const config = useMemo(() => ({ name: 'test' }), [])
  // ✅ useCallback stabilizes the function reference
  const onClick = useCallback(() => console.log('click'), [])
  return <Child config={config} onClick={onClick} />
}
```

## Oral Questions

### 1. Is more useMemo always better?

Answer template:

> No. useMemo itself has cost: every render must compare the deps array, and the cache uses memory. If the computation is cheap (for example `a + b`), useMemo’s overhead can be larger than just computing it.
>
> The right rule is: use it only when “the computation is expensive” or “you need a stable reference”. An expensive example is sorting/filtering a large array. A stable-reference example is an object prop passed to a memo child, or an object used as a useEffect dependency.
>
> React Compiler will handle these optimizations automatically in the future; handwritten memo is a transitional approach.

### 2. When does React.memo fail?

Answer template:

> Four common failure cases. First, props pass a new object reference (`{}`, `[]`, `() => {}`); every render is a new reference, so shallow compare is always false. Stabilize with useMemo/useCallback.
>
> Second, the parent passes children (`<Child><span/></Child>`); children are also props, and each render creates a new React element. Third, the component has its own useState / useContext (or other hooks) that trigger updates; memo cannot stop internal state changes. Fourth, a custom compare function is wrong (the second argument of `React.memo(Comp, areEqual)` has the wrong logic).

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. Essence of the trio (useMemo caches values / useCallback caches functions / memo caches rendering) (1.5 minutes)
2. When to use vs when not to + four memo-failure cases (2 minutes)
3. Where React Compiler is heading + why you may not need handwritten memo in the future (1.5 minutes)

Self-check after recording:

- Did you state that useCallback is equivalent to `useMemo(() => fn, deps)`.
- Did you state that memo shallow-compares and fails on new references.
- Did you state that more memo is not always better, because comparison has cost.
- Did you mention React Compiler.

## Today's Review

The 3 points that most need follow-up today:

1. How to use `React.memo`’s second argument `areEqual(prevProps, nextProps)`, and what to watch out for.
2. Combining `useCallback` with `useRef` for an “always latest” callback pattern.
3. React Compiler’s compile strategy: how it automatically finds values that need caching.
