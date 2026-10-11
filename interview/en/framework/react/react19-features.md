### React 19 Features

#### 1. useActionState
Used with form Actions. It automatically tracks pending status and the returned state.

```jsx
import { useActionState } from 'react';

async function signupUser(prevState, formData) {
  const email = formData.get('email');
  if (email === 'error@example.com') {
    return { error: 'Sign-up failed' };
  }
  return { message: 'Sign-up succeeded' };
}

function SignupForm() {
  const [state, formAction] = useActionState(signupUser, null);

  return (
    <form action={formAction}>
      <input name="email" defaultValue={state?.email} />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      {state?.message && <p className="text-green-500">{state.message}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### 2. useFormStatus
Read the form's submit status from a child component without passing it through props.

```jsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

function Form() {
  return (
    <form action={formAction}>
      <input name="email" />
      <SubmitButton />
    </form>
  );
}
```

#### 3. useOptimistic (optimistic updates)
Update the UI before the async work finishes, and roll back automatically on failure.

```jsx
import { useOptimistic, useState } from 'react';

function MessageList() {
  const [messages, setMessages] = useState([{ id: '1', text: 'Hello' }]);

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { id: Date.now(), text: newMessage, sending: true }]
  );

  async function formAction(formData) {
    const text = formData.get('message');
    addOptimisticMessage(text); // Update the UI immediately

    try {
      const sent = await sendMessage(text);
      setMessages(prev => [...prev, sent]); // On success, update the real state
    } catch {
      // On failure, useOptimistic rolls back to messages
    }
  }

  return (
    <>
      {optimisticMessages.map(msg => (
        <div key={msg.id} className={msg.sending ? 'opacity-70' : ''}>
          {msg.text}
          {msg.sending && <span>Sending...</span>}
        </div>
      ))}
      <form action={formAction}>
        <input name="message" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
```

#### 4. use() API
Read a Promise or Context directly in a component, typically with Suspense.

```jsx
import { use, Suspense, useState } from 'react';

function UserList({ usersPromise }) {
  const users = use(usersPromise); // Suspends until the Promise resolves

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

function UserListContainer() {
  const [usersPromise, setUsersPromise] = useState(null);

  return (
    <>
      <button onClick={() => setUsersPromise(fetchUsers())}>Load</button>
      {usersPromise && (
        <Suspense fallback={<div>Loading...</div>}>
          <UserList usersPromise={usersPromise} />
        </Suspense>
      )}
    </>
  );
}
```

**Note**: `use()` can be called inside conditions and loops, but the Promise should stay stable during render (for example, keep it in state).

#### 5. Ref as Prop (forwardRef is no longer needed)
In React 19, function components can receive `ref` as a regular prop.

```jsx
// Before: forwardRef was required
// const CustomInput = forwardRef((props, ref) => <input ref={ref} {...props} />);

// React 19: ref is a regular prop
function CustomInput({ placeholder, ref }) {
  return <input ref={ref} placeholder={placeholder} />;
}

function FocusDemo() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <CustomInput ref={inputRef} placeholder="Click the button to focus" />
      <button onClick={handleFocus}>Focus</button>
    </>
  );
}
```

## Daily practice reference

### Day 48: React 19 new API checklist

| API | Purpose | Replaces |
|-----|------|------|
| `useActionState` | Manage an action’s pending/error/result | Handwritten loading + try-catch |
| `useOptimistic` | Optimistic update + automatic rollback | Handwritten optimistic + rollback |
| `use` | Read a Promise / Context in render | `useContext` / await + setState |
| `useFormStatus` | Read the parent `<form>`’s submit status | props drilling |
| `ref` as prop | Function components receive ref as a prop | `forwardRef` |
| `<form action>` | Native form support for async actions | onSubmit + preventDefault |

### Day 48: Actions concept

An Action is a function that can be async, used with `<form action={fn}>` or `startTransition`:
- Automatically manages pending state
- Automatically handles errors (with Error Boundary)
- Supports `useOptimistic` for optimistic UI
- Supports `useFormStatus` to read submit status

### Day 48: useActionState

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

### Day 48: useOptimistic

```jsx
const [optimisticMessages, addOptimistic] = useOptimistic(
  messages,
  (currentMessages, newMessage) => [...currentMessages, newMessage]
)
```

- `addOptimistic` updates the UI immediately (optimistic value).
- After the action succeeds, real data overwrites it; on failure it automatically rolls back to `messages`.

### Day 48: use

```jsx
function UserProfile({ userPromise }) {
  const user = use(userPromise)  // read the Promise directly in render
  return <div>{user.name}</div>
}
// The outer layer needs a <Suspense> wrapper
```

- Can be called inside conditionals (unlike other hooks).
- Can also read Context: `const theme = use(ThemeContext)`.

### Day 48: ref as prop (no more forwardRef)

```jsx
// React 19: receive ref directly in props
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
// No longer needs a forwardRef wrapper
```

### Day 48: Full form + useActionState + useOptimistic example

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

## Day 49 practice code

```jsx
// actions.ts
'use server'
export async function createTodo(formData: FormData) {
  const text = formData.get('text')
  await db.todos.create({ text })
  revalidatePath('/todos')
}

// TodoForm.tsx
'use client'
import { createTodo } from './actions'

export function TodoForm() {
  return (
    <form action={createTodo}>
      <input name="text" />
      <button type="submit">Add</button>
    </form>
  )
}
```
