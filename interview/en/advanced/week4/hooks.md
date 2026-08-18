### React Hooks Internals

In senior frontend interviews, Hooks are not just “function components can have state.” A stronger answer places them on React’s render pipeline:

`function component runs -> read the Hook linked list in call order -> useState/useReducer process the update queue -> produce this render’s state -> useEffect/useLayoutEffect mark side effects -> run side effects in the commit phase`

That pipeline explains most follow-ups: why Hooks cannot be called inside conditions, why you still read the old value after `setState`, why stale closures happen, why `useEffect` is not a simple lifecycle replacement, and why batching and concurrent features after React 18 change how you should think about Hooks.

#### 1. Hooks are not just “write fewer class components”

The immediate benefit of Hooks is that function components can hold state and run side effects. The deeper value is:

- Logic reuse moves from HOCs / render props to custom Hooks
- Related logic can be grouped by concern instead of being split across lifecycles
- Components get closer to the model “take props and state, return UI”
- They lay the groundwork for interruptible, replayable rendering under concurrent rendering

So do not only say “Hooks let function components use state.” A more accurate line is: **Hooks bind state, side effects, and reusable logic to a function component’s render process, and they require rendering to stay predictable.**

#### 2. Where Hook state lives

Every time a function component runs, local variables are created again, but Hook state cannot be thrown away.

React’s approach: attach Hook state to the Fiber node of the current component. A component with multiple Hooks forms a linked list in call order.

A simplified model:

```ts
type Hook = {
  memoizedState: unknown
  queue: UpdateQueue | null
  next: Hook | null
}

type Fiber = {
  memoizedState: Hook | null
}
```

For example:

```jsx
function Profile() {
  const [name, setName] = useState('Alice')
  const [age, setAge] = useState(18)
  const inputRef = useRef(null)

  return <div>{name} - {age}</div>
}
```

The corresponding Hook list can be thought of as:

```text
Fiber.memoizedState
  -> Hook(useState: name)
  -> Hook(useState: age)
  -> Hook(useRef: inputRef)
```

React does not identify Hooks by variable names. It finds the matching Hook node by **call order on every render**.

#### 3. Why Hooks cannot be called inside conditions

Because Hook state is matched by call order.

```jsx
function User({ enabled }) {
  const [name, setName] = useState('Alice')

  if (enabled) {
    const [age, setAge] = useState(18)
  }

  const [city, setCity] = useState('Shanghai')
}
```

On the first render with `enabled = true`, the Hook order is:

```text
name -> age -> city
```

On the next render with `enabled = false`, the Hook order becomes:

```text
name -> city
```

React then mistakes the previous `age` Hook state for `city`’s state. The rule “only call Hooks at the top level of a component” is not a style preference; it is required by React’s storage model.

You can put conditions *inside* a Hook:

```jsx
useEffect(() => {
  if (!enabled) return

  const controller = new AbortController()
  loadUser({ signal: controller.signal })

  return () => controller.abort()
}, [enabled])
```

#### 4. `useState`: state is not a variable that changes immediately

`useState` returns a snapshot of state for the current render, plus a function that dispatches an update.

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
    console.log(count)
  }

  return <button onClick={handleClick}>{count}</button>
}
```

On click, `console.log(count)` is still the old value from the current render’s closure. `setCount` enqueues an update and schedules the next render; it does not mutate the local variable in the current function.

##### 4.1 Update queue

Each Hook maintains its own update queue.

```jsx
setCount(count + 1)
setCount(count + 1)
setCount(count + 1)
```

If `count` in the current render is `0`, all three updates mean “set state to `1`.”

```jsx
setCount(c => c + 1)
setCount(c => c + 1)
setCount(c => c + 1)
```

Functional updates enqueue “compute the next state from the previous state,” so the final result is `3`.

That is why, whenever the next state depends on the previous state, you should prefer functional updates.

##### 4.2 State snapshot

One React render sees a fixed snapshot.

```jsx
function handleClick() {
  setCount(count + 1)
  setTimeout(() => {
    console.log(count)
  }, 1000)
}
```

The `count` read inside the timer is also the `count` from the render that created this callback. That is not a React bug; it is JavaScript closures plus React’s render snapshot working together.

#### 5. Batching and state updates

React merges updates in the same batch to avoid unnecessary renders.

```jsx
function handleClick() {
  setCount(c => c + 1)
  setFlag(f => !f)
}
```

After React 18, automatic batching is not limited to React events. It also covers more async contexts such as `Promise`, `setTimeout`, and native events.

```jsx
setTimeout(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
})
```

These two updates are usually flushed as one render as well.

When you need to read DOM updates synchronously, you can use `flushSync`. It interrupts React’s scheduling optimizations, so use it only when you must stay tightly in sync with the browser or a third-party DOM API.

#### 6. `useEffect`: sync with external systems, not compute state

The job of `useEffect` is to keep a React component in sync with an external system.

External systems include:

- network requests
- DOM APIs
- timers
- event subscriptions
- localStorage
- third-party SDKs

It is a poor fit for deriving state.

```jsx
const [fullName, setFullName] = useState('')

useEffect(() => {
  setFullName(firstName + ' ' + lastName)
}, [firstName, lastName])
```

This kind of logic should be computed during render, or with `useMemo` when it is genuinely expensive.

```jsx
const fullName = `${firstName} ${lastName}`
```

In a senior interview you can put it this way: **an Effect is how you sync with the outside world after a render is committed, not the default way to organize data flow inside a component.**

#### 7. When Effects run

A React update can be roughly split into two phases:

1. render phase: compute the next UI tree; it can be interrupted, retried, or discarded
2. commit phase: commit changes to the host environment and run side effects

`useEffect` does not run during render. It runs asynchronously after commit.

```jsx
useEffect(() => {
  document.title = String(count)
}, [count])
```

That means:

- render must stay pure: no direct DOM writes or requests
- Effects only run after a successfully committed render
- under concurrent rendering, a discarded render will not run Effects

##### 7.1 When cleanup runs

An Effect’s cleanup function runs in two cases:

- when the component unmounts
- before the same Effect runs again

```jsx
useEffect(() => {
  const controller = new AbortController()

  fetch(`/api/users/${userId}`, {
    signal: controller.signal,
  })

  return () => {
    controller.abort()
  }
}, [userId])
```

When `userId` changes, React first cleans up the previous request, then runs the new Effect. That prevents a late response from an old request from overwriting newer state.

##### 7.2 Why Strict Mode makes Effects run twice

In development, React Strict Mode intentionally runs an extra setup -> cleanup -> setup cycle to surface incomplete cleanup.

Do not work around it with tricks that “make the Effect run only once.” The correct approach is to make the Effect safe to run repeatedly, with complete cleanup.

#### 8. `useLayoutEffect` and `useEffect`

`useEffect` runs after the browser paints, so it does not block painting.

`useLayoutEffect` runs synchronously after DOM mutations and before the browser paints, so it blocks painting.

There are few good reasons to use `useLayoutEffect`. Typical cases:

- reading layout information
- adjusting the DOM based on layout in the same frame
- avoiding a visible flash

```jsx
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect()
  setTooltipHeight(rect.height)
}, [])
```

For ordinary data fetching, subscriptions, logging, title updates, and similar work, prefer `useEffect`.

#### 9. Dependency arrays and stale closures

The dependency array is not a switch that “controls how many times this runs.” It declares which reactive values the Effect uses.

```jsx
useEffect(() => {
  socket.send(roomId)
}, [])
```

If `roomId` can change, missing it as a dependency makes the Effect forever use the `roomId` from the first render.

That is a stale closure: the callback captured variables from an old render.

##### 9.1 Common fixes

First, include the dependency:

```jsx
useEffect(() => {
  socket.send(roomId)
}, [roomId])
```

Second, use functional updates to depend less on old state:

```jsx
setCount(c => c + 1)
```

Third, put mutable values that should not retrigger the Effect into a `ref`:

```jsx
const latestHandlerRef = useRef(onMessage)

useEffect(() => {
  latestHandlerRef.current = onMessage
}, [onMessage])

useEffect(() => {
  return subscribe((message) => {
    latestHandlerRef.current(message)
  })
}, [])
```

Do not delete dependencies just to silence the linter. A stronger senior-interview answer is: **the dependency array describes the reactive reads inside the closure; missing a dependency means the Effect keeps using an old snapshot.**

#### 10. `useMemo` and `useCallback`

`useMemo` caches a computed value. `useCallback` caches a function identity.

```jsx
const visibleItems = useMemo(() => {
  return items.filter(item => item.visible)
}, [items])

const handleSelect = useCallback((id) => {
  setSelectedId(id)
}, [])
```

They are not default performance buttons. You usually want at least one of these:

- the computation itself is expensive
- the result is a prop of a `React.memo` child
- a stable object or function identity avoids extra work downstream
- a custom Hook needs to expose a stable API

If the parent creates a new object or function on every render and the child is not memoized, adding `useCallback` by itself usually has no payoff.

##### 10.1 What `useCallback` actually is

These two snippets are roughly equivalent:

```jsx
const handleClick = useCallback(() => {
  setCount(c => c + 1)
}, [])
```

```jsx
const handleClick = useMemo(() => {
  return () => setCount(c => c + 1)
}, [])
```

So `useCallback` does not mean “do not create the function.” It means React returns the previously cached function identity when the dependencies have not changed.

#### 11. `useRef`

`useRef` returns a stable object:

```jsx
const ref = useRef(initialValue)
```

Its properties:

- the `ref` object itself is stable across renders
- mutating `ref.current` does not trigger a re-render
- it is a good place for DOM nodes, timer ids, third-party instances, and the latest callback

```jsx
const timerRef = useRef(null)

useEffect(() => {
  timerRef.current = setInterval(tick, 1000)

  return () => {
    clearInterval(timerRef.current)
  }
}, [])
```

If a value affects the UI, use state. If you only need to keep a mutable value across renders without triggering render, use a ref.

#### 12. `useReducer`

`useReducer` fits complex state. It is not a “more advanced” replacement for `useState`.

Good fits:

- many state branches
- several fields that often change together
- updates that have clear business meaning
- you want state-transition logic in one place

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'request':
      return { status: 'loading', data: null, error: null }
    case 'success':
      return { status: 'success', data: action.data, error: null }
    case 'error':
      return { status: 'error', data: null, error: action.error }
    default:
      return state
  }
}
```

The win is not fewer lines of code. It is turning “set several fields by hand” into “drive a state machine with actions.”

#### 13. `useContext`

`useContext` solves passing values across layers. It is not a universal replacement for global state management.

```jsx
const ThemeContext = createContext('light')

function Button() {
  const theme = useContext(ThemeContext)
  return <button className={theme}>Submit</button>
}
```

Watch out for:

- a new `value` identity on the Provider re-renders every consumer of that Context
- high-frequency state does not belong in one coarse, oversized Context
- you can split Contexts, or use a selector-style store to skip unrelated updates

```jsx
const value = useMemo(() => {
  return { user, logout }
}, [user, logout])
```

`useMemo` can stabilize a Provider value, but only if the dependencies themselves are reasonably stable.

#### 14. Custom Hooks

The value of a custom Hook is reusing stateful logic, not reusing UI.

A good custom Hook usually:

- has a name that starts with `use`
- can call other Hooks inside
- has a clear input/output boundary
- cleans up side effects completely
- does not hide too many business branches

```jsx
function useUser(userId) {
  const [state, setState] = useState({
    status: 'idle',
    data: null,
    error: null,
  })

  useEffect(() => {
    if (!userId) return

    const controller = new AbortController()

    setState({ status: 'loading', data: null, error: null })

    fetch(`/api/users/${userId}`, {
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(data => {
        setState({ status: 'success', data, error: null })
      })
      .catch(error => {
        if (error.name === 'AbortError') return
        setState({ status: 'error', data: null, error })
      })

    return () => {
      controller.abort()
    }
  }, [userId])

  return state
}
```

In an interview you can add: a custom Hook is not a new state container; it only extracts reusable Hook composition from a component.

#### 15. How Hooks relate to concurrent rendering

React concurrent rendering requires the render phase to be interruptible, retryable, and discardable.

That in turn requires:

- component functions stay pure
- no side effects during render
- Hook call order stays stable
- Effect cleanup is complete
- state updates are expressed as a queue, not as mutations of the current value

This code, for example, is unsafe:

```jsx
function User() {
  localStorage.setItem('visited', '1')
  return <div>User</div>
}
```

If render is retried, that side effect may run more than once. Put it in an Effect:

```jsx
useEffect(() => {
  localStorage.setItem('visited', '1')
}, [])
```

So Hook rules are not isolated rules. They are tied to React’s scheduler, Fiber architecture, and concurrent capabilities.

#### 16. Common senior follow-ups

##### 16.1 Why must Hooks be called in a fixed order

Because Hook state lives on the Fiber’s Hook linked list. React matches this render’s Hooks to the previous render’s Hooks by call order. Conditional calls break that order and misalign state.

##### 16.2 Why can’t I read the new value right after `setState`

`setState` enqueues an update and schedules the next render. It does not mutate variables in the current render’s closure. The state in the current function is a snapshot of this render.

##### 16.3 Why functional updates avoid lost consecutive updates

A functional update receives the state computed by the previous step in the queue, not the old state captured by the closure. That is the right tool when the next state depends on the previous state.

##### 16.4 How does `useEffect` relate to lifecycles

There is no simple one-to-one mapping. `useEffect` is closer to “sync with an external system after commit.” It can simulate mount, update, and unmount, but the mental model should move from lifecycles to data dependencies and Effect cleanup.

##### 16.5 Why does `useEffect` get stale closures

The Effect callback captures variables from a particular render. If the dependency array omits a reactive value, later changes will not recreate the Effect, and the callback keeps using the old snapshot.

##### 16.6 Should I use `useMemo` / `useCallback` everywhere

No. They have their own dependency-comparison and cache-maintenance cost. Use them when the computation is expensive, you need a stable identity, you are pairing with `React.memo`, or downstream work depends on referential stability.

##### 16.7 How to choose between `useRef` and `useState`

Data that affects the UI uses `useState`. Values that must persist across renders but should not trigger rendering use `useRef`.

##### 16.8 Is Strict Mode double-invoking a bug

No. In development, React deliberately runs extra setup and cleanup to find incomplete side-effect cleanup. Production does not repeat the same extra cycle.

#### 17. Interview answer template

If the interviewer asks about “how Hooks work,” answer in this order:

1. Hook state lives on the Fiber of the function component; each Hook forms a linked list in call order
2. React matches Hooks across renders by a stable call order, so Hooks cannot be called inside conditions, loops, or ordinary functions
3. Updates from `useState` / `useReducer` go into that Hook’s update queue; React computes the new state on the next render
4. State is a snapshot of one render; `setState` does not change values in the current closure, which is why stale closures happen
5. `useEffect` runs after commit to sync with external systems; cleanup runs on unmount or before the next Effect run
6. The dependency array describes the reactive values captured by the Effect; missing a dependency causes an old closure, and deleting dependencies is not a real optimization
7. `useMemo` / `useCallback` cache identities and computations; they are not default performance tools. `useRef` stores mutable values that should not trigger render
8. Hook rules are connected to concurrent rendering: render must stay pure, interruptible, and retryable; side effects belong in Effects after commit

That answer moves from usage into Fiber, the state queue, the Effect commit phase, and the concurrent model.
