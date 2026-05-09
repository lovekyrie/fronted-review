### React Hooks 机制

高级前端面试里，Hooks 不是“函数组件里能写状态”这么简单。更好的回答方式是把它放进 React 的渲染链路里：

`函数组件执行 -> 按调用顺序读取 Hook 链表 -> useState/useReducer 处理更新队列 -> 生成本次 render 的状态 -> useEffect/useLayoutEffect 标记副作用 -> commit 阶段执行副作用`

这条链路能解释大部分追问：为什么 Hook 不能写在条件里、为什么 `setState` 后读到的还是旧值、为什么会有 stale closure、为什么 `useEffect` 不是生命周期的简单替代、为什么 React 18 以后批处理和并发能力会影响 Hook 的理解。

#### 1. Hooks 解决的不是“少写 class”

React 引入 Hooks 的直接收益是让函数组件拥有状态和副作用能力，但更深一层的价值是：

- 让逻辑复用从 HOC / render props 转向自定义 Hook
- 让相关逻辑可以按业务关注点组织，而不是按生命周期拆散
- 让组件更接近“输入 props 和 state，返回 UI”的模型
- 为并发渲染下的可中断、可重放渲染打基础

所以面试里不要只说“Hooks 让函数组件能用 state”。更准确的说法是：**Hooks 把状态、副作用和复用逻辑都绑定到函数组件的 render 过程上，同时要求组件渲染保持可预测。**

#### 2. Hook 存在哪里

函数组件每次执行都会重新创建局部变量，但 Hook 状态不能丢。

React 的做法是：把 Hook 状态挂在当前组件对应的 Fiber 节点上。一个组件里有多个 Hook，它们会按调用顺序形成链表。

可以简化理解成：

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

例如：

```jsx
function Profile() {
  const [name, setName] = useState('Alice')
  const [age, setAge] = useState(18)
  const inputRef = useRef(null)

  return <div>{name} - {age}</div>
}
```

对应的 Hook 链表可以理解成：

```text
Fiber.memoizedState
  -> Hook(useState: name)
  -> Hook(useState: age)
  -> Hook(useRef: inputRef)
```

React 并不是通过变量名识别 Hook，而是通过**每次渲染时的调用顺序**找到对应的 Hook 节点。

#### 3. 为什么 Hook 不能写在条件里

因为 Hook 状态靠调用顺序匹配。

```jsx
function User({ enabled }) {
  const [name, setName] = useState('Alice')

  if (enabled) {
    const [age, setAge] = useState(18)
  }

  const [city, setCity] = useState('Shanghai')
}
```

第一次 `enabled = true` 时，Hook 顺序是：

```text
name -> age -> city
```

下一次 `enabled = false` 时，Hook 顺序变成：

```text
name -> city
```

这会导致 React 把原来 `age` 的 Hook 状态误认为 `city` 的状态。规则“只在组件顶层调用 Hook”不是代码风格要求，而是 React 存储模型决定的。

可以在 Hook 内部写条件：

```jsx
useEffect(() => {
  if (!enabled) return

  const controller = new AbortController()
  loadUser({ signal: controller.signal })

  return () => controller.abort()
}, [enabled])
```

#### 4. `useState`：状态不是马上变的变量

`useState` 返回的是当前 render 的状态快照和一个派发更新的函数。

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

点击时 `console.log(count)` 仍然是当前 render 闭包里的旧值。`setCount` 做的是把更新放进队列，然后调度下一次 render，不会修改当前函数里的局部变量。

##### 4.1 更新队列

同一个 Hook 上会维护自己的更新队列。

```jsx
setCount(count + 1)
setCount(count + 1)
setCount(count + 1)
```

如果当前 render 里的 `count` 是 `0`，这三次放进去的都是“把状态设为 `1`”。

```jsx
setCount(c => c + 1)
setCount(c => c + 1)
setCount(c => c + 1)
```

函数式更新放进去的是“基于上一个状态计算下一个状态”，所以最终结果是 `3`。

这也是为什么只要新状态依赖旧状态，就优先使用函数式更新。

##### 4.2 状态快照

React 的一次 render 看到的是一份固定快照。

```jsx
function handleClick() {
  setCount(count + 1)
  setTimeout(() => {
    console.log(count)
  }, 1000)
}
```

定时器里读到的 `count` 也是创建这个回调时那次 render 的 `count`。这不是 React 异常，而是 JavaScript 闭包和 React render 快照共同作用的结果。

#### 5. 批处理和状态更新

React 会把同一批更新合并，减少不必要的 render。

```jsx
function handleClick() {
  setCount(c => c + 1)
  setFlag(f => !f)
}
```

React 18 以后，自动批处理不只发生在 React 事件里，也覆盖 `Promise`、`setTimeout`、原生事件等更多异步场景。

```jsx
setTimeout(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
})
```

这两次更新通常也会合成一次 render。

需要同步拿到 DOM 更新结果时，可以用 `flushSync`，但它会打断 React 的调度优化，通常只在必须与浏览器或第三方 DOM API 强同步时使用。

#### 6. `useEffect`：同步外部系统，不是计算状态

`useEffect` 的定位是把 React 组件和外部系统同步。

外部系统包括：

- 网络请求
- DOM API
- 定时器
- 事件订阅
- localStorage
- 第三方 SDK

它不适合用来派生状态。

```jsx
const [fullName, setFullName] = useState('')

useEffect(() => {
  setFullName(firstName + ' ' + lastName)
}, [firstName, lastName])
```

这类逻辑应该直接在 render 中计算，或在确实昂贵时使用 `useMemo`。

```jsx
const fullName = `${firstName} ${lastName}`
```

高级面试里可以这样说：**Effect 是渲染结果提交后同步外部世界的手段，不是组件内部数据流的默认组织方式。**

#### 7. Effect 的执行时机

React 的更新可以粗略分成两个阶段：

1. render 阶段：计算下一棵 UI 树，可以被中断、重试、丢弃
2. commit 阶段：把变更提交到宿主环境，执行副作用

`useEffect` 不会在 render 阶段执行，而是在 commit 之后异步执行。

```jsx
useEffect(() => {
  document.title = String(count)
}, [count])
```

这意味着：

- render 必须保持纯净，不能直接操作 DOM 或发请求
- Effect 只会在提交成功的渲染后执行
- 并发渲染中，被丢弃的 render 不会执行 Effect

##### 7.1 cleanup 什么时候执行

Effect 的清理函数会在两类时机执行：

- 组件卸载时
- 下一次执行同一个 Effect 前

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

当 `userId` 变化时，React 会先清理上一次请求，再执行新的 Effect。这样可以避免旧请求晚返回后覆盖新状态。

##### 7.2 Strict Mode 为什么会让 Effect 执行两次

开发环境下，React Strict Mode 会有意执行一次额外的 setup -> cleanup -> setup，用来暴露不完整的清理逻辑。

所以不要用“让 Effect 只执行一次”的技巧绕过它。正确做法是让 Effect 可重复执行，并且清理完整。

#### 8. `useLayoutEffect` 和 `useEffect`

`useEffect` 在浏览器绘制后执行，不会阻塞绘制。

`useLayoutEffect` 在 DOM 变更后、浏览器绘制前同步执行，会阻塞绘制。

适合 `useLayoutEffect` 的场景很少，通常是：

- 读取布局信息
- 根据布局同步调整 DOM
- 避免用户看到闪烁

```jsx
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect()
  setTooltipHeight(rect.height)
}, [])
```

普通数据请求、订阅、日志、标题更新等，优先用 `useEffect`。

#### 9. 依赖数组和 stale closure

依赖数组不是“控制执行次数”的开关，而是声明 Effect 使用了哪些响应式值。

```jsx
useEffect(() => {
  socket.send(roomId)
}, [])
```

如果 `roomId` 会变化，这里漏依赖会让 Effect 永远使用初次 render 的 `roomId`。

这就是 stale closure：回调捕获的是旧 render 的变量。

##### 9.1 常见修复方式

第一，补齐依赖：

```jsx
useEffect(() => {
  socket.send(roomId)
}, [roomId])
```

第二，用函数式更新减少对旧状态的依赖：

```jsx
setCount(c => c + 1)
```

第三，把不需要触发 Effect 重跑的可变值放进 `ref`：

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

不要为了消除 lint 提示随意删依赖。高级面试里更好的回答是：**依赖数组描述闭包里的响应式读取，漏依赖本质上是让 Effect 使用旧快照。**

#### 10. `useMemo` 和 `useCallback`

`useMemo` 缓存计算结果，`useCallback` 缓存函数引用。

```jsx
const visibleItems = useMemo(() => {
  return items.filter(item => item.visible)
}, [items])

const handleSelect = useCallback((id) => {
  setSelectedId(id)
}, [])
```

它们不是默认性能优化按钮。使用它们通常要满足至少一个条件：

- 计算本身比较昂贵
- 结果作为 `React.memo` 子组件的 prop
- 依赖对象或函数引用稳定性避免下游重复执行
- 自定义 Hook 需要暴露稳定 API

如果父组件每次 render 都创建新对象、新函数，而子组件没有 memo，单独加 `useCallback` 通常没有收益。

##### 10.1 `useCallback` 的本质

下面两段近似等价：

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

所以 `useCallback` 不是让函数“不创建”，而是让 React 在依赖不变时返回上一次缓存的函数引用。

#### 11. `useRef`

`useRef` 返回一个稳定对象：

```jsx
const ref = useRef(initialValue)
```

它的特点是：

- `ref` 对象本身在多次 render 之间稳定
- 修改 `ref.current` 不会触发重新渲染
- 适合保存 DOM 节点、定时器 id、第三方实例、最新回调

```jsx
const timerRef = useRef(null)

useEffect(() => {
  timerRef.current = setInterval(tick, 1000)

  return () => {
    clearInterval(timerRef.current)
  }
}, [])
```

如果一个值会影响 UI，应该用 state。如果只是跨 render 保存可变值，又不希望触发 render，可以用 ref。

#### 12. `useReducer`

`useReducer` 适合复杂状态，不是 `useState` 的高级替代品。

适合场景：

- 状态分支多
- 多个字段经常一起变化
- 更新动作有明确业务语义
- 希望把状态迁移逻辑集中管理

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

它的优势不是少写代码，而是让状态变化从“随手 set 多个字段”变成“按动作驱动状态机”。

#### 13. `useContext`

`useContext` 解决跨层传值，但它不是全局状态管理的万能替代。

```jsx
const ThemeContext = createContext('light')

function Button() {
  const theme = useContext(ThemeContext)
  return <button className={theme}>Submit</button>
}
```

需要注意：

- Provider 的 `value` 引用变化，会让消费这个 Context 的组件重新渲染
- 高频变化状态不适合粗粒度塞进一个大 Context
- 可以拆分 Context，或用 selector 型状态库减少无关更新

```jsx
const value = useMemo(() => {
  return { user, logout }
}, [user, logout])
```

`useMemo` 可以稳定 Provider value，但前提是依赖本身也合理稳定。

#### 14. 自定义 Hook

自定义 Hook 的价值是复用状态逻辑，而不是复用 UI。

一个好的自定义 Hook 通常满足：

- 名称以 `use` 开头
- 内部可以调用其他 Hook
- 输入输出边界清晰
- 清理副作用完整
- 不隐藏过多业务分支

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

面试里可以补一句：自定义 Hook 不是新的状态容器，它只是把组件里可复用的 Hook 组合逻辑抽出来。

#### 15. Hooks 和并发渲染的关系

React 并发渲染要求 render 阶段可中断、可重试、可丢弃。

这会反过来要求：

- 组件函数保持纯净
- render 阶段不要执行副作用
- Hook 调用顺序稳定
- Effect 清理完整
- 状态更新用队列表达，而不是直接修改当前值

例如下面代码是不安全的：

```jsx
function User() {
  localStorage.setItem('visited', '1')
  return <div>User</div>
}
```

如果 render 被重试，这个副作用可能执行多次。正确做法是放进 Effect：

```jsx
useEffect(() => {
  localStorage.setItem('visited', '1')
}, [])
```

所以 Hooks 规则不是孤立规则，它们和 React 的调度模型、Fiber 架构、并发能力是连在一起的。

#### 16. 常见高级追问

##### 16.1 为什么 Hook 必须按固定顺序调用

因为 Hook 状态存储在 Fiber 的 Hook 链表上，React 通过调用顺序匹配本次 render 和上次 render 的 Hook。条件调用会破坏顺序，导致状态错位。

##### 16.2 `setState` 后为什么拿不到新值

`setState` 是入队更新并调度下一次 render，不会修改当前 render 闭包里的变量。当前函数里的 state 是这次 render 的快照。

##### 16.3 为什么函数式更新能避免连续更新丢失

函数式更新接收队列中上一步计算后的状态，而不是闭包里捕获的旧状态，所以适合“新状态依赖旧状态”的场景。

##### 16.4 `useEffect` 和生命周期是什么关系

不能简单一一对应。`useEffect` 更像“提交后同步外部系统”。它可以模拟挂载、更新、卸载，但思维模型应该从生命周期切到数据依赖和副作用清理。

##### 16.5 `useEffect` 为什么会出现 stale closure

Effect 回调捕获的是某次 render 的变量。如果依赖数组漏掉响应式值，后续变化不会触发 Effect 重新创建，回调就会继续使用旧快照。

##### 16.6 `useMemo` / `useCallback` 是否应该到处用

不应该。它们本身也有依赖比较和缓存维护成本。只有计算昂贵、需要稳定引用、配合 `React.memo` 或下游依赖引用稳定性时才值得使用。

##### 16.7 `useRef` 和 `useState` 怎么选

影响 UI 的数据用 `useState`。需要跨 render 保存，但变化不需要触发渲染的值用 `useRef`。

##### 16.8 Strict Mode 双执行是不是 bug

不是。开发环境下 React 故意额外执行 setup 和 cleanup，用来发现副作用清理不完整的问题。生产环境不会以同样方式重复执行。

#### 17. 面试回答模板

如果面试官问“Hooks 原理”，可以按这个顺序回答：

1. Hooks 的状态存储在函数组件对应的 Fiber 上，每个 Hook 按调用顺序形成链表
2. React 通过稳定调用顺序在多次 render 之间匹配 Hook，所以 Hook 不能写在条件、循环、普通函数里
3. `useState` / `useReducer` 的更新会进入 Hook 自己的 update queue，React 在下一次 render 中计算新状态
4. state 是一次 render 的快照，`setState` 不会修改当前闭包里的值，所以会有 stale closure
5. `useEffect` 在 commit 后执行，用来同步外部系统；cleanup 会在卸载或下一次 effect 执行前运行
6. 依赖数组描述 Effect 捕获的响应式值，漏依赖会导致旧闭包，乱删依赖不是正确优化
7. `useMemo` / `useCallback` 是引用和计算缓存，不是默认性能优化；`useRef` 用来保存不触发 render 的可变值
8. Hooks 的规则和 React 并发渲染有关：render 必须纯净、可中断、可重试，副作用只能放到提交后的 Effect 阶段

这样回答能从用法推进到 Fiber、状态队列、Effect 提交阶段和并发模型。
