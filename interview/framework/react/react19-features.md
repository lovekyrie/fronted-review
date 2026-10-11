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

## 每日练习参考

### Day 48：React 19 新 API 清单

| API | 作用 | 替代 |
|-----|------|------|
| `useActionState` | 管理 action 的 pending/error/result | 手写 loading + try-catch |
| `useOptimistic` | 乐观更新 + 自动回滚 | 手写 optimistic + rollback |
| `use` | render 内读 Promise / Context | `useContext` / await + setState |
| `useFormStatus` | 获取父级 `<form>` 的提交状态 | props drilling |
| `ref` as prop | 函数组件直接接收 ref 作为 prop | `forwardRef` |
| `<form action>` | form 原生支持异步 action | onSubmit + preventDefault |

### Day 48：Actions 概念

Action = 可以异步的函数，配合 `<form action={fn}>` 或 `startTransition`：
- 自动管理 pending 状态
- 自动处理错误（配合 Error Boundary）
- 支持 `useOptimistic` 做乐观 UI
- 支持 `useFormStatus` 获取提交状态

### Day 48：useActionState

```jsx
const [state, formAction, isPending] = useActionState(
  async (prevState, formData) => {
    const result = await submitForm(formData)
    return result  // 成为下一次的 prevState
  },
  initialState
)
```

- 替代以前的 `useState + useEffect + try-catch` 模式。
- `isPending` 自动追踪异步状态。
- 支持 SSR（服务端也能执行 action）。

### Day 48：useOptimistic

```jsx
const [optimisticMessages, addOptimistic] = useOptimistic(
  messages,
  (currentMessages, newMessage) => [...currentMessages, newMessage]
)
```

- `addOptimistic` 立即更新 UI（乐观值）。
- action 成功后用真实数据覆盖；失败则自动回滚到 `messages`。

### Day 48：use

```jsx
function UserProfile({ userPromise }) {
  const user = use(userPromise)  // 在 render 中直接读 Promise
  return <div>{user.name}</div>
}
// 外层需要 <Suspense> 包裹
```

- 可以在条件语句中调用（不像其他 hooks）。
- 也可以读 Context：`const theme = use(ThemeContext)`。

### Day 48：ref as prop（去 forwardRef）

```jsx
// React 19: 直接在 props 里接收 ref
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
// 不再需要 forwardRef 包裹
```

### Day 48：表单 + useActionState + useOptimistic 完整示例

```jsx
function TodoForm({ todos, addTodo }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { text: newTodo, pending: true }]
  )

  const [error, formAction, isPending] = useActionState(
    async (prevError, formData) => {
      const text = formData.get('text')
      addOptimistic(text)  // 立即显示
      try {
        await addTodo(text)  // 服务端请求
        return null
      } catch (e) {
        return e.message  // 失败回滚 + 显示错误
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
