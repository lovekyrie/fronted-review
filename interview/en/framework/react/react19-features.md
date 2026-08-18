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
