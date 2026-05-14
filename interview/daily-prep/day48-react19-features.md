# Day 48 React 19 新特性 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 48 | React 19 | [React 19 新特性](../framework/react/react19-features) |

## 今日目标

- 看完 React 19 官方 What's New + useOptimistic / useActionState / Actions
- 输出 React 19 新特性速记卡：Actions / useOptimistic / useActionState / use / ref as prop
- 思考这些新特性如何改变你现有项目的写法

## 阅读卡点

- Actions 打通了表单提交、异步请求、状态更新、乐观 UI 的一条龙
- `useOptimistic` 是**临时状态**，服务端失败会回滚
- `use` 可以在 render 里直接读 Promise / Context，是 RSC 的基础

## 速记卡 / 知识点

### React 19 新 API 清单

| API | 作用 | 替代 |
|-----|------|------|
| `useActionState` | 管理 action 的 pending/error/result | 手写 loading + try-catch |
| `useOptimistic` | 乐观更新 + 自动回滚 | 手写 optimistic + rollback |
| `use` | render 内读 Promise / Context | `useContext` / await + setState |
| `useFormStatus` | 获取父级 `<form>` 的提交状态 | props drilling |
| `ref` as prop | 函数组件直接接收 ref 作为 prop | `forwardRef` |
| `<form action>` | form 原生支持异步 action | onSubmit + preventDefault |

### Actions 概念

Action = 可以异步的函数，配合 `<form action={fn}>` 或 `startTransition`：
- 自动管理 pending 状态
- 自动处理错误（配合 Error Boundary）
- 支持 `useOptimistic` 做乐观 UI
- 支持 `useFormStatus` 获取提交状态

### useActionState

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

### useOptimistic

```jsx
const [optimisticMessages, addOptimistic] = useOptimistic(
  messages,
  (currentMessages, newMessage) => [...currentMessages, newMessage]
)
```

- `addOptimistic` 立即更新 UI（乐观值）。
- action 成功后用真实数据覆盖；失败则自动回滚到 `messages`。

### use

```jsx
function UserProfile({ userPromise }) {
  const user = use(userPromise)  // 在 render 中直接读 Promise
  return <div>{user.name}</div>
}
// 外层需要 <Suspense> 包裹
```

- 可以在条件语句中调用（不像其他 hooks）。
- 也可以读 Context：`const theme = use(ThemeContext)`。

### ref as prop（去 forwardRef）

```jsx
// React 19: 直接在 props 里接收 ref
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
// 不再需要 forwardRef 包裹
```

## 手写 / 流程图

### 表单 + useActionState + useOptimistic 完整示例

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

## 口述题

### 1. Actions 解决了什么以前很麻烦的事？

回答模板：

> 以前处理一个表单提交需要手动管理很多状态：loading（useState）、error（try-catch + setState）、乐观更新（手写 optimistic + rollback）、竞态（useRef 标记）。代码分散在 useState + useEffect + 事件处理函数里，很容易出 bug。
>
> Actions 把这些打包成一个原语：`<form action={asyncFn}>` 自动管理 pending、自动处理错误（配合 Error Boundary）、配合 `useOptimistic` 做乐观 UI、配合 `useActionState` 追踪结果。代码从"散装状态管理"变成了"声明式 action"，心智负担大大降低。

### 2. useOptimistic 和普通乐观更新手写有什么不同？

回答模板：

> 手写乐观更新需要自己处理三个状态：先设乐观值、成功后替换为真实值、失败后回滚到原始值。容易漏处理失败回滚，也容易出现状态不一致。
>
> `useOptimistic` 自动管理这个流程：你调用 `addOptimistic(value)` 时 UI 立即更新为乐观值。当 action 完成后（不管成功失败），React 自动用 `messages`（真实数据源）覆盖乐观值。如果 action 失败，真实数据没变，乐观值自然被"回滚"。开发者不需要手动管理回滚逻辑。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. React 19 新 API 总览（6 个关键变化快速过一遍）（1 分钟）
2. Actions + useActionState（表单提交场景 + isPending + 错误处理）（2 分钟）
3. useOptimistic + use（乐观更新自动回滚 + render 内读 Promise）（2 分钟）

录完后自查：

- 是否说出 Actions 自动管理 pending / error / optimistic。
- 是否说出 useOptimistic 自动回滚。
- 是否说出 `use` 可以在条件语句中调用。
- 是否说出 ref as prop 去掉了 forwardRef。

## 今日复盘

今天最需要回补的 3 个点：

1. `useFormStatus` 的使用场景和限制（只能在 form 的子组件中使用）。
2. `use` 读 Promise 时 Suspense 的交互（如何避免瀑布流请求）。
3. React 19 和 Server Actions 的关系（`"use server"` 标记的函数如何和 Actions 配合）。
