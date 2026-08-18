# Day 48 React 19 New Features Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 48 | React 19 | [React 19 Features](../framework/react/react19-features) |

## Today's Goals

- Finish React 19 official What’s New + useOptimistic / useActionState / Actions
- Produce a React 19 cheat sheet: Actions / useOptimistic / useActionState / use / ref as prop
- Think about how these features would change how you write in existing projects

## Reading Checkpoints

- Actions connect form submit, async requests, state updates, and optimistic UI into one pipeline
- `useOptimistic` is **temporary state**; it rolls back if the server fails
- `use` can read a Promise / Context directly in render; it is a foundation for RSC

## Cheat Sheet / Knowledge Points

### React 19 new API checklist

| API | Purpose | Replaces |
|-----|------|------|
| `useActionState` | Manage an action’s pending/error/result | Handwritten loading + try-catch |
| `useOptimistic` | Optimistic update + automatic rollback | Handwritten optimistic + rollback |
| `use` | Read a Promise / Context in render | `useContext` / await + setState |
| `useFormStatus` | Read the parent `<form>`’s submit status | props drilling |
| `ref` as prop | Function components receive ref as a prop | `forwardRef` |
| `<form action>` | Native form support for async actions | onSubmit + preventDefault |

### Actions concept

An Action is a function that can be async, used with `<form action={fn}>` or `startTransition`:
- Automatically manages pending state
- Automatically handles errors (with Error Boundary)
- Supports `useOptimistic` for optimistic UI
- Supports `useFormStatus` to read submit status

### useActionState

```jsx
const [state, formAction, isPending] = useActionState(
  async (prevState, formData) => {
    const result = await submitForm(formData)
    return result  // becomes the next prevState
  },
  initialState
)
```

- Replaces the old `useState + useEffect + try-catch` pattern.
- `isPending` automatically tracks the async status.
- Supports SSR (the action can also run on the server).

### useOptimistic

```jsx
const [optimisticMessages, addOptimistic] = useOptimistic(
  messages,
  (currentMessages, newMessage) => [...currentMessages, newMessage]
)
```

- `addOptimistic` updates the UI immediately (optimistic value).
- After the action succeeds, real data overwrites it; on failure it automatically rolls back to `messages`.

### use

```jsx
function UserProfile({ userPromise }) {
  const user = use(userPromise)  // read the Promise directly in render
  return <div>{user.name}</div>
}
// The outer layer needs a <Suspense> wrapper
```

- Can be called inside conditionals (unlike other hooks).
- Can also read Context: `const theme = use(ThemeContext)`.

### ref as prop (no more forwardRef)

```jsx
// React 19: receive ref directly in props
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
// No longer needs a forwardRef wrapper
```

## Handwritten / Flowcharts

### Full form + useActionState + useOptimistic example

```jsx
function TodoForm({ todos, addTodo }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { text: newTodo, pending: true }]
  )

  const [error, formAction, isPending] = useActionState(
    async (prevError, formData) => {
      const text = formData.get('text')
      addOptimistic(text)  // show immediately
      try {
        await addTodo(text)  // server request
        return null
      } catch (e) {
        return e.message  // fail → rollback + show error
      }
    },
    null
  )

  return (
    <>
      <ul>
        {optimisticTodos.map((t, i) => (
          <li key={i} style={{ opacity: t.pending ? 0.5 : 1 }}>{t.text}</li>
        ))}
      </ul>
      <form action={formAction}>
        <input name="text" />
        <button disabled={isPending}>
          {isPending ? 'Adding...' : 'Add'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  )
}
```

## Oral Questions

### 1. What previously painful problems do Actions solve?

Answer template:

> Previously, handling a form submit meant manually managing many pieces of state: loading (useState), error (try-catch + setState), optimistic updates (handwritten optimistic + rollback), races (a useRef flag). The code was scattered across useState + useEffect + event handlers, and bugs were easy.
>
> Actions pack this into one primitive: `<form action={asyncFn}>` automatically manages pending, automatically handles errors (with Error Boundary), works with `useOptimistic` for optimistic UI, and with `useActionState` to track the result. Code goes from “scattered state management” to a “declarative action”, and the mental load drops a lot.

### 2. How is useOptimistic different from handwritten optimistic updates?

Answer template:

> Handwritten optimistic updates require you to manage three states yourself: set the optimistic value first, replace it with the real value on success, roll back to the original on failure. It is easy to miss the failure rollback, and easy to get inconsistent state.
>
> `useOptimistic` manages this flow automatically: when you call `addOptimistic(value)`, the UI immediately shows the optimistic value. After the action finishes (success or failure), React automatically overwrites the optimistic value with `messages` (the real source of truth). If the action failed, the real data never changed, so the optimistic value is naturally “rolled back”. Developers do not need to manage rollback logic by hand.

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. React 19 new API overview (quickly cover the 6 key changes) (1 minute)
2. Actions + useActionState (form-submit scenario + isPending + error handling) (2 minutes)
3. useOptimistic + use (automatic optimistic rollback + reading a Promise in render) (2 minutes)

Self-check after recording:

- Did you state that Actions automatically manage pending / error / optimistic.
- Did you state that useOptimistic rolls back automatically.
- Did you state that `use` can be called inside conditionals.
- Did you state that ref as prop removes forwardRef.

## Today's Review

The 3 points that most need follow-up today:

1. When to use `useFormStatus` and its limits (only inside a form’s child components).
2. How `use` interacts with Suspense when reading a Promise (how to avoid waterfall requests).
3. How React 19 relates to Server Actions (how functions marked `"use server"` work with Actions).
