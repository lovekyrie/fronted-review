### React Concurrency

In senior frontend interviews, React concurrency is not "React turned on multithreading", and it is not "the page will definitely be faster". A more accurate understanding is:

**React can split an update into interruptible, resumable, and discardable units of work, and decide what to process first based on priority.**

You can place it in this pipeline:

`setState produces an update -> mark the update lane -> scheduler schedules by priority -> the render phase interruptibly builds the workInProgress tree -> the commit phase submits in one shot -> effects run`

This pipeline explains most follow-up questions: why concurrent rendering is not parallel rendering, why render must be pure, what problem `startTransition` solves, why Suspense can work with concurrency, and how automatic batching in React 18 relates to concurrency.

#### 1. What problem does concurrency actually solve

The problem with traditional synchronous rendering is: once rendering a large component tree starts, the main thread is occupied by React, and user input, clicks, and animations may be blocked in the meantime.

Concurrent rendering is about **responsiveness**:

- user input should be responded to first
- heavy updates such as filtering a large list or switching routes can yield
- low-priority rendering can be interrupted and continued when the browser is idle
- stale intermediate results can be discarded instead of being committed to the page

So the goal is not to make every computation smaller. It is to give React the ability to arrange the order of work.

#### 2. Concurrency is not multithreading

JavaScript still mainly runs on the browser main thread. React concurrency is cooperative scheduling, not parallel CPU computation.

More precisely:

- React splits rendering work into many Fiber units
- after processing a stretch of work, it checks whether it should yield the main thread
- if a higher-priority task comes in, the current low-priority render can be paused
- later it can continue, or discard the old result and render again

That is why you should not say in interviews that "React concurrency uses multithreading to improve performance". You should say: **React concurrency makes rendering interruptible, able to yield, and schedulable by priority.**

#### 3. Why Fiber is the foundation of concurrency

When React used to render a component tree recursively, it was hard to pause halfway.

You can think of a Fiber as the component node and unit of work that React maintains itself. Each Fiber stores:

- component type
- props / state
- child, sibling, and parent pointers
- side-effect flags
- update priority
- alternate pointing to the corresponding node on the current tree or the work tree

Because Fiber turns the recursive call stack into a data structure that can be saved and resumed, React can:

- do some work
- pause
- resume
- abort
- start over

#### 4. The render phase and the commit phase

A React update can be split into two phases.

##### 4.1 Render phase

The render phase is responsible for computing the next UI tree.

Characteristics:

- can be interrupted
- can be retried
- can be discarded
- should not have side effects

Function component execution, Hook computation, and diff mainly happen in this phase.

```jsx
function UserCard({ user }) {
  return <div>{user.name}</div>
}
```

A component function may run multiple times during concurrent rendering, and some of those results may never be committed. So the render phase must stay pure.

##### 4.2 Commit phase

The commit phase is responsible for actually submitting the result to the host environment.

Characteristics:

- cannot be interrupted
- mutates the DOM
- runs layout effects
- schedules passive effects

So side effects should go in `useEffect` / `useLayoutEffect`, not directly in the component function body.

```jsx
function Page() {
  useEffect(() => {
    document.title = 'Page'
  }, [])

  return <main>Page</main>
}
```

#### 5. Priority and lanes

Internally, React 18 uses lanes to express update priority. You can think of a lane as "which priority lane this update belongs to".

Common update priorities can be understood roughly as:

- user input and clicks: high priority
- ordinary state updates: default priority
- transition updates: lower priority
- idle work: even lower priority

```jsx
setInputValue(value) // high priority: the input must respond immediately

startTransition(() => {
  setFilteredList(filter(items, value)) // low priority: can be deferred
})
```

The point is not to memorize specific lane names. It is to understand: **React stamps different updates with different priorities, and the scheduler decides which updates are processed first based on priority.**

#### 6. What problem does `startTransition` solve

`startTransition` is used to mark "non-urgent updates that can be delayed".

A typical scenario is an input box driving a large list:

```jsx
import { startTransition, useState } from 'react'

function SearchPage({ items }) {
  const [keyword, setKeyword] = useState('')
  const [query, setQuery] = useState('')

  function handleChange(event) {
    const value = event.target.value

    setKeyword(value)

    startTransition(() => {
      setQuery(value)
    })
  }

  const visibleItems = items.filter(item => item.name.includes(query))

  return (
    <>
      <input value={keyword} onChange={handleChange} />
      <ItemList items={visibleItems} />
    </>
  )
}
```

This can be split into two kinds of updates:

- `keyword`: the controlled value of the input, which must update promptly
- `query`: drives large-list filtering, and can update later

If list rendering is heavy, React can prioritize keeping input smooth, then process the list update.

#### 7. `useTransition`

`useTransition` is the Hook version of `startTransition`. It can also tell you whether the current transition is pending.

```jsx
import { useTransition, useState } from 'react'

function TabContainer() {
  const [tab, setTab] = useState('home')
  const [isPending, startTransition] = useTransition()

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab)
    })
  }

  return (
    <>
      <button onClick={() => selectTab('home')}>Home</button>
      <button onClick={() => selectTab('posts')}>Posts</button>
      {isPending && <span>Switching...</span>}
      <TabPanel tab={tab} />
    </>
  )
}
```

Good fits:

- route or tab switching
- large-list filtering
- search result updates
- chart or complex component updates

It is not a good idea to wrap every update in it. Urgent updates such as direct user input, immediate button feedback, and controlled form values should not be deprioritized by a transition.

#### 8. `useDeferredValue`

`useDeferredValue` is used to delay using a value.

```jsx
function SearchPage({ items }) {
  const [keyword, setKeyword] = useState('')
  const deferredKeyword = useDeferredValue(keyword)

  const visibleItems = items.filter(item =>
    item.name.includes(deferredKeyword)
  )

  return (
    <>
      <input value={keyword} onChange={e => setKeyword(e.target.value)} />
      <ItemList items={visibleItems} />
    </>
  )
}
```

You can understand the difference from `useTransition` like this:

- `useTransition`: mark low priority when producing an update
- `useDeferredValue`: delay propagation when consuming a value

When you can control where the state update happens, use `useTransition`. When the value comes from props, external state, or a source that is inconvenient to wrap, consider `useDeferredValue`.

#### 9. Suspense and concurrency

The core of Suspense is not "showing loading". It lets a component declare during rendering: **I cannot finish this render yet; I need to wait for some async resource.**

```jsx
<Suspense fallback={<Spinner />}>
  <UserProfile />
</Suspense>
```

In concurrent rendering, Suspense can work with transitions:

- urgent updates are committed first
- if a low-priority update suspends, the old UI can keep showing
- the new UI is committed after the data is ready

This avoids many "the whole page suddenly becomes loading" UX problems.

#### 10. Automatic batching

After React 18, the scope of automatic batching expanded.

```jsx
fetch('/api/user').then(() => {
  setUser(user)
  setLoading(false)
})
```

These two updates are usually coalesced into one render.

Automatic batching and concurrency are not the same thing:

- batching solves "combine multiple updates into one render"
- concurrency solves "how render work is scheduled, interrupted, and resumed by priority"

Their shared goal is to reduce unnecessary blocking and improve interaction responsiveness.

#### 11. `flushSync`

Some scenarios need the DOM committed immediately, for example when a third-party DOM API must run only after the DOM has already updated.

```jsx
import { flushSync } from 'react-dom'

flushSync(() => {
  setOpen(true)
})

dialogRef.current.focus()
```

`flushSync` forces React to flush updates synchronously and breaks the benefits of scheduling and batching, so it should be used sparingly.

In interviews you can say: **it is an escape hatch, not the regular way to update state.**

#### 12. Side-effect constraints under concurrency

Under concurrent rendering, the render phase may be retried or discarded.

The following is unsafe:

```jsx
function Product({ id }) {
  reportView(id)

  return <div>{id}</div>
}
```

If render is retried, the analytics event may be sent twice. If render is discarded, the event may correspond to a UI that was never shown.

The correct approach:

```jsx
function Product({ id }) {
  useEffect(() => {
    reportView(id)
  }, [id])

  return <div>{id}</div>
}
```

Concurrency requires component functions to be pure computation: the same input returns the same UI, without directly affecting the outside world.

#### 13. Tearing and `useSyncExternalStore`

Concurrent rendering has another important problem: an external store may change during rendering, causing different components to read inconsistent state. This kind of problem is usually called tearing.

React provides `useSyncExternalStore` so external state libraries can plug into React in a concurrency-safe way.

```jsx
function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )
}
```

It requires:

- `subscribe` is responsible for subscribing to external changes
- `getSnapshot` returns the current snapshot
- when the snapshot has not changed, its reference should stay stable

This is also why state libraries such as Redux and Zustand need to care about concurrency safety after React 18.

#### 14. The boundary between concurrency and performance optimization

Concurrency is not a silver bullet that replaces all performance work.

It can improve:

- input and re-renders blocking each other
- large updates causing interaction jank
- loading flicker during async switches
- updates of different priorities mixed together

It cannot replace:

- reducing meaningless renders
- virtual lists
- code splitting
- data caching
- image and asset optimization
- algorithm complexity optimization

If a list render itself has to process a hundred thousand items, a transition can only make it better at "yielding". It cannot make a hundred thousand computations disappear.

#### 15. Related React 19 capabilities

Many React 19 capabilities should also be understood against the background of concurrency and async UI.

##### 15.1 `useActionState`

`useActionState` makes pending state, returned state, and submit logic for form actions more centralized.

It solves async submit state management. It does not replace every form library.

##### 15.2 `useOptimistic`

`useOptimistic` is used for optimistic updates.

It fits interactions such as sending a message, liking, or bookmarking: "show the result first, roll back on failure".

This is closely related to the concurrency model: the UI can first enter a temporary state, then confirm or roll back after the real async result comes back.

##### 15.3 `use`

`use` can read a Promise or Context inside a component, and works with Suspense.

The key point: it is not a universal API for firing requests anywhere in a client component. The Promise should stay stable, or you will get repeated suspends or repeated requests.

#### 16. Common senior follow-up questions

##### 16.1 Is React concurrency multithreading

No. It is cooperative scheduling on the main thread. React splits rendering into Fiber units of work and yields the main thread at the right time.

##### 16.2 Why concurrent rendering requires render to be pure

Because the render phase may be interrupted, retried, or discarded. If you run side effects in render, you may get duplicate requests, duplicate analytics, or operations on UI that was never committed.

##### 16.3 What is the difference between `startTransition` and ordinary `setState`

Ordinary `setState` is scheduled at the current context's default priority. Updates inside `startTransition` are marked as non-urgent and can be interrupted by higher-priority updates.

##### 16.4 How to choose between `useTransition` and `useDeferredValue`

When you can control the source of the update, use `useTransition` to mark a low-priority update. When you cannot control the source, or you want to delay consuming a value, use `useDeferredValue`.

##### 16.5 Is Suspense just a loading component

No. Suspense is an async rendering boundary. It lets React know that some subtree cannot finish rendering for now, and decide whether to show a fallback, keep the old UI, or wait for the new UI.

##### 16.6 What is the difference between automatic batching and concurrency

Automatic batching merges multiple state updates into one render. Concurrency lets render work be scheduled, paused, resumed, and discarded by priority. They are related, but not the same thing.

##### 16.7 Why external state libraries need to care about `useSyncExternalStore`

Because under concurrent rendering an external store may change during render, causing different components to read different snapshots. `useSyncExternalStore` provides a concurrency-safe subscription protocol.

#### 17. Interview answer template

If the interviewer asks about "React concurrency", you can answer in this order:

1. React concurrency is not multithreading; it is Fiber-based cooperative scheduling
2. Fiber splits the component tree into units of work that can be saved and resumed; the render phase can be interrupted, retried, and discarded
3. React assigns different priorities to updates, and internally uses lanes to express those priorities
4. High-priority updates such as input should be responded to first; low-priority updates can be marked with `startTransition` / `useTransition`
5. `useDeferredValue` delays consuming a value, and fits cases where you cannot conveniently control the update source
6. Suspense is an async rendering boundary; together with transitions it can avoid the page frequently entering global loading
7. The render phase must be pure; side effects go in Effects after commit
8. Automatic batching reduces render count; concurrent scheduling decides how render work yields and resumes
9. For external stores, use a protocol such as `useSyncExternalStore` to stay concurrency-safe

This kind of answer strings Fiber, the scheduler, lanes, transitions, Suspense, and Effect constraints into one complete pipeline.

## Daily practice reference

### Day 43: Fiber architecture

- Fiber is React’s unit of work; each component corresponds to a Fiber node.
- The Fiber tree is a linked structure: `child` / `sibling` / `return` (parent).
- Core value: the render phase can be **interrupted / resumed / reused**.

### Day 43: React’s two update phases

| Phase | Role | Interruptible | Involves |
|------|------|--------|------|
| **Render** | Walk the Fiber tree, call component functions, compute new VNodes, diff and mark changes (effectTag) | ✅ interruptible | `beginWork` / `completeWork` |
| **Commit** | Sync changes to the real DOM | ❌ not interruptible | `BeforeMutation` / `Mutation` / `Layout` |

Commit has three sub-phases:
- **BeforeMutation**: `getSnapshotBeforeUpdate`, schedule `useEffect`.
- **Mutation**: actual DOM operations (insert / delete / update).
- **Layout**: `useLayoutEffect` / `componentDidMount` / `componentDidUpdate`.

### Day 43: Automatic batching (React 18)

| Scenario | React 17 | React 18 |
|------|----------|----------|
| Event handlers | ✅ batched | ✅ batched |
| Promise.then | ❌ not batched | ✅ batched |
| setTimeout | ❌ not batched | ✅ batched |
| Native events | ❌ not batched | ✅ batched |

React 18 enables this with `createRoot`; all scenarios are batched automatically. `flushSync` can opt out of batching.

### Day 43: Lanes priority model

```text
SyncLane (sync) > InputContinuousLane (continuous input) > DefaultLane (default) > IdleLane (idle)
```

- Each update carries a lane; the scheduler picks execution priority from the lane.
- `startTransition` marks an update as low priority (TransitionLane); it can be interrupted by higher priority.

### Day 43: Full React update pipeline

```text
setState(newValue)
  → create an Update object, attach it to Fiber.updateQueue
  → scheduleUpdateOnFiber(fiber, lane)
  → ensureRootIsScheduled → pick a scheduling method based on lane
    → Sync: schedule as a microtask
    → Concurrent: MessageChannel / scheduler
  → Render phase:
    → workLoopSync / workLoopConcurrent
    → beginWork: call the component function, diff children, mark effectTag
    → completeWork: collect the effect list
  → Commit phase:
    → BeforeMutation: schedule useEffect
    → Mutation: DOM operations
    → Layout: useLayoutEffect runs synchronously
```

### Day 43: Batching comparison

```jsx
function handleClick() {
  setCount(1)  // does not re-render immediately
  setFlag(true) // does not re-render immediately
  // one unified re-render after the event ends
}

// React 17: setTimeout is not batched:
setTimeout(() => {
  setCount(1)  // re-render
  setFlag(true) // re-render  → 2 times in total
}, 0)

// React 18 automatic batching: only 1 re-render
```

### Day 47: Core concurrent-rendering ideas

- **Not multithreading**; it is **interruptible scheduling** on a single thread.
- High-priority updates (user input) can interrupt low-priority updates (list rendering).
- Interrupted low-priority work is not lost; it resumes when idle.

### Day 47: useTransition

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

### Day 47: useDeferredValue

```jsx
const deferredQuery = useDeferredValue(query)
// deferredQuery “lags” the update so the current frame can prioritize urgent work
```

- Difference from `useTransition`: `useTransition` marks low priority on the **trigger**; `useDeferredValue` delays using the value on the **consumer**.
- Fits cases where you cannot control who calls setState (for example a value from props).

### Day 47: How to choose

| Scenario | Choose |
|------|------|
| You control setState | `useTransition` |
| The value comes from props/outside | `useDeferredValue` |
| You need a loading state | `useTransition` (has `isPending`) |

### Day 47: Working with Suspense

```jsx
<Suspense fallback={<Loading />}>
  <SearchResults query={deferredQuery} />
</Suspense>
```

- Transition + Suspense: when a low-priority render suspends, show the old UI instead of the fallback.
- Better UX: the input stays smooth, and old results stay visible until new results are ready.

### Day 47: Full search-box example

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

### Day 47: Concurrent scheduling flow

```text
User types 'a'
  → SyncLane: setInput('a') → immediately render the input
  → TransitionLane: setResults(filter) → start rendering the list
User keeps typing 'ab' (the list is still rendering)
  → SyncLane: setInput('ab') → interrupt list render → immediately render the input
  → TransitionLane: setResults(filter('ab')) → discard the previous render and start over
Result: the input stays smooth; the list only renders the final result
```
