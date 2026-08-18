# Day 44 React State Queue and Functional Updates Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 44 | state queue | [Week 4 Hooks](../advanced/week4/hooks), [React Hooks](../framework/react/hooks) |

## Today's Goals

- Finish React useState / Queueing State Updates
- Do 3 output questions (three consecutive `setCount(count + 1)` vs three `setCount(c => c + 1)`)
- Produce typical stale state / stale closure cases + how to fix them

## Reading Checkpoints

- `setState` only enqueues an update; state does not change inside the current render
- A direct-value update uses the state **snapshot of this render**; a functional update uses **queue-accumulated** state
- Functional updates naturally fix the old “click the button 3 times and it only increments by 1” problem

## Cheat Sheet / Knowledge Points

### State update model

```text
setState(value) → create Update { action: value } → enqueue on fiber.updateQueue
                                                   ↓
                                         unchanged this render; the next render processes the queue
```

- React state in one render is a **snapshot**: no matter how many times you call setState, the state you read is this render’s value.
- Updates are processed in batch on the next render.

### Direct value vs functional updates

```jsx
// Direct value: uses this render’s snapshot
setCount(count + 1) // count = 0 → enqueue 1
setCount(count + 1) // count = 0 → enqueue 1
setCount(count + 1) // count = 0 → enqueue 1
// Result: count = 1 (the last one overwrites the previous)

// Functional: uses the queue-accumulated value
setCount(c => c + 1) // 0 → 1
setCount(c => c + 1) // 1 → 2
setCount(c => c + 1) // 2 → 3
// Result: count = 3
```

### Queue processing rules

```text
Walk updateQueue:
  if (update.action is a function) → newState = action(prevState)
  if (update.action is a value)   → newState = action
```

### Typical stale closure scenario

```jsx
function Timer() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      console.log(count)    // always 0! the closure captured count from the initial render
      setCount(count + 1)   // always sets 1
    }, 1000)
    return () => clearInterval(id)
  }, [])  // empty deps → effect runs only once → the closure is locked to the initial value
}
```

How to fix it:
1. **Functional update**: `setCount(c => c + 1)` (most common)
2. **Add a dependency**: `[count]`, but the timer is cleared and recreated each time
3. **useRef**: store the latest value in a ref, read `ref.current` inside the effect

## Handwritten / Flowcharts

### 3 classic output questions

```jsx
// Q1: direct value × 3
function App() {
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount(count + 1) // 0 + 1 = 1
    setCount(count + 1) // 0 + 1 = 1
    setCount(count + 1) // 0 + 1 = 1
  }
  return <button onClick={handleClick}>{count}</button>
  // after click, count = 1
}

// Q2: functional × 3
function App() {
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount(c => c + 1) // 0 → 1
    setCount(c => c + 1) // 1 → 2
    setCount(c => c + 1) // 2 → 3
  }
  return <button onClick={handleClick}>{count}</button>
  // after click, count = 3
}

// Q3: mixed
function App() {
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount(count + 5)  // enqueue value 5
    setCount(c => c + 1) // 5 → 6
    setCount(42)         // enqueue value 42 (overwrites)
  }
  return <button onClick={handleClick}>{count}</button>
  // after click, count = 42
}
```

## Oral Questions

### 1. Why does calling setState 3 times in a row only increment by 1?

Answer template:

> Because React state in one render is a snapshot. When you write `setCount(count + 1)` three times, all three reads of `count` are this render’s value (for example 0), so all three are `setCount(0 + 1)`, enqueueing three values of 1, and the last one wins as 1.
>
> The fix is a functional update `setCount(c => c + 1)`. Functional updates do not read the snapshot; they take the result of the previous update as the argument. Three calls become `0→1→2→3`, which accumulates correctly.
>
> The root reason is React’s “snapshot mental model”: each render has an independent state snapshot, and the event handler’s closure captures that snapshot.

### 2. What is a stale closure? How do you fix it?

Answer template:

> A stale closure means the closure captured an old render snapshot; later state updates, but the value inside the closure does not. The most typical case is a `useEffect` with `[]` empty deps: callbacks inside the effect always read the initial state.
>
> Three fixes. First, a functional update `setCount(c => c + 1)`, which does not depend on `count` in the closure. Second, put state in the dependency array so the effect is recreated when state changes. Third, store the latest value in `useRef`; `ref.current` is not limited by the closure. In real projects, prefer functional updates — they are the cleanest.

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. State enqueue model + snapshot mental model (1.5 minutes)
2. Direct value vs functional + 3 output questions (2 minutes)
3. Stale closure scenarios + three fixes (1.5 minutes)

Self-check after recording:

- Did you state that state in one render is a snapshot.
- Did you state that direct values use the snapshot and functional updates use the queue-accumulated value.
- Did you state a typical stale closure scenario and how to fix it.
- Can you compute the mixed question’s result out loud.

## Today's Review

The 3 points that most need follow-up today:

1. How `useReducer`’s update queue relates to `useState` (`useState` is `useReducer` underneath).
2. How `useEffectEvent` (React 19) isolates values you do not want to retrigger.
3. Immutable update patterns for object state (why you must spread a new object).
