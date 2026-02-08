### React 19 新特性

#### 1. useActionState
用于处理表单 Action，自动管理 pending 状态和返回的 state。

```jsx
import { useActionState } from 'react';

async function signupUser(prevState, formData) {
  const email = formData.get('email');
  if (email === 'error@example.com') {
    return { error: '注册失败' };
  }
  return { message: '注册成功' };
}

function SignupForm() {
  const [state, formAction] = useActionState(signupUser, null);

  return (
    <form action={formAction}>
      <input name="email" defaultValue={state?.email} />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      {state?.message && <p className="text-green-500">{state.message}</p>}
      <button type="submit">提交</button>
    </form>
  );
}
```

#### 2. useFormStatus
在表单子组件中获取表单的提交状态，无需通过 props 传递。

```jsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? '提交中...' : '提交'}
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

#### 3. useOptimistic（乐观更新）
在异步操作完成前先更新 UI，失败时自动回滚。

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
    addOptimisticMessage(text); // 立即更新 UI

    try {
      const sent = await sendMessage(text);
      setMessages(prev => [...prev, sent]); // 成功则更新真实状态
    } catch {
      // 失败时 useOptimistic 会自动回退到 messages
    }
  }

  return (
    <>
      {optimisticMessages.map(msg => (
        <div key={msg.id} className={msg.sending ? 'opacity-70' : ''}>
          {msg.text}
          {msg.sending && <span>发送中...</span>}
        </div>
      ))}
      <form action={formAction}>
        <input name="message" />
        <button type="submit">发送</button>
      </form>
    </>
  );
}
```

#### 4. use() API
在组件中直接读取 Promise 或 Context，配合 Suspense 使用。

```jsx
import { use, Suspense, useState } from 'react';

function UserList({ usersPromise }) {
  const users = use(usersPromise); // 会暂停直到 Promise resolve

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
      <button onClick={() => setUsersPromise(fetchUsers())}>加载</button>
      {usersPromise && (
        <Suspense fallback={<div>加载中...</div>}>
          <UserList usersPromise={usersPromise} />
        </Suspense>
      )}
    </>
  );
}
```

**注意**：`use()` 可在条件、循环中调用，但 Promise 在渲染期间应保持稳定（如放在 state 中）。

#### 5. Ref as Prop（不再需要 forwardRef）
React 19 中，函数组件可直接接收 `ref` 作为普通 prop。

```jsx
// 之前：需要 forwardRef
// const CustomInput = forwardRef((props, ref) => <input ref={ref} {...props} />);

// React 19：ref 作为普通 prop
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
      <CustomInput ref={inputRef} placeholder="点击按钮聚焦" />
      <button onClick={handleFocus}>聚焦</button>
    </>
  );
}
```
