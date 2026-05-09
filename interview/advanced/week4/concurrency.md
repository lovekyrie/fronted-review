### React 并发机制

高级前端面试里，React 并发不是“React 开了多线程”，也不是“页面一定更快”。更准确的理解是：

**React 可以把一次更新拆成可中断、可恢复、可丢弃的工作单元，并根据优先级决定先处理什么。**

可以把它放进这条链路里理解：

`setState 产生 update -> 标记 update lane -> scheduler 按优先级调度 -> render 阶段可中断地构建 workInProgress tree -> commit 阶段一次性提交 -> effects 执行`

这条链路能解释大部分追问：为什么 concurrent rendering 不等于并行渲染、为什么 render 必须纯净、`startTransition` 解决什么问题、Suspense 为什么能和并发配合、React 18 自动批处理和并发是什么关系。

#### 1. 并发到底解决什么问题

传统同步渲染的问题是：一旦开始渲染一棵大组件树，主线程会被 React 占住，期间用户输入、点击、动画都可能被阻塞。

并发渲染要解决的是**响应性**问题：

- 用户输入应该优先响应
- 大列表过滤、路由切换这类重更新可以让路
- 低优先级渲染可以被打断，等浏览器空闲时继续
- 过期的中间结果可以丢弃，不必提交到页面

所以它的目标不是让每次计算更少，而是让 React 有能力安排工作顺序。

#### 2. 并发不是多线程

JavaScript 仍然主要运行在浏览器主线程上。React 的并发是协作式调度，不是 CPU 并行计算。

更准确地说：

- React 把渲染工作拆成很多 Fiber 单元
- 每处理一段工作，就检查是否应该让出主线程
- 如果有更高优先级任务进来，可以暂停当前低优先级渲染
- 稍后再继续，或者直接丢弃旧结果重新渲染

这就是为什么面试里不要说“React 并发用多线程提高性能”。应该说：**React 并发让渲染过程可中断、可让步、可按优先级调度。**

#### 3. Fiber 为什么是并发的基础

React 早期递归渲染一棵组件树时，很难中途暂停。

Fiber 可以理解成 React 自己维护的组件节点和工作单元。每个 Fiber 里保存：

- 组件类型
- props / state
- 子节点、兄弟节点、父节点指针
- 副作用标记
- 更新优先级
- alternate 指向当前树或工作树的另一份节点

因为 Fiber 把递归调用栈变成了可保存、可恢复的数据结构，React 才能做到：

- 做一部分 work
- 暂停
- 恢复
- 放弃
- 重新开始

#### 4. render 阶段和 commit 阶段

React 更新可以分成两个阶段。

##### 4.1 render 阶段

render 阶段负责计算下一棵 UI 树。

特点：

- 可以被中断
- 可以被重试
- 可以被丢弃
- 不应该有副作用

函数组件执行、Hook 计算、diff 主要发生在这个阶段。

```jsx
function UserCard({ user }) {
  return <div>{user.name}</div>
}
```

组件函数可能在并发渲染中执行多次，但其中某次结果不一定会被提交。所以 render 阶段必须保持纯净。

##### 4.2 commit 阶段

commit 阶段负责把结果真正提交到宿主环境。

特点：

- 不可中断
- 会修改 DOM
- 会执行 layout effect
- 会安排 passive effect

所以副作用应该放到 `useEffect` / `useLayoutEffect`，而不是直接写在组件函数体里。

```jsx
function Page() {
  useEffect(() => {
    document.title = 'Page'
  }, [])

  return <main>Page</main>
}
```

#### 5. 优先级和 lanes

React 18 内部使用 lanes 表达更新优先级。可以把 lane 理解成“这次更新属于哪条优先级车道”。

常见更新优先级可以粗略理解为：

- 用户输入、点击：高优先级
- 普通状态更新：默认优先级
- transition 更新：较低优先级
- 空闲任务：更低优先级

```jsx
setInputValue(value) // 高优先级，输入框要马上响应

startTransition(() => {
  setFilteredList(filter(items, value)) // 低优先级，可以延后
})
```

重点不在于背具体 lane 名称，而是理解：**React 会给不同更新打上不同优先级，调度器根据优先级决定哪些更新先被处理。**

#### 6. `startTransition` 解决什么问题

`startTransition` 用来标记“可以延迟的非紧急更新”。

典型场景是输入框联动大列表：

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

这里可以拆成两类更新：

- `keyword`：输入框受控值，必须及时更新
- `query`：驱动大列表过滤，可以稍后更新

如果列表渲染很重，React 可以优先保证输入流畅，再处理列表更新。

#### 7. `useTransition`

`useTransition` 是 `startTransition` 的 Hook 版本，它还能告诉你当前 transition 是否 pending。

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
      {isPending && <span>切换中...</span>}
      <TabPanel tab={tab} />
    </>
  )
}
```

适合场景：

- 路由或 tab 切换
- 大列表过滤
- 搜索结果更新
- 图表或复杂组件更新

不适合把所有更新都包进去。用户直接输入、按钮即时反馈、表单受控值这类紧急更新，不应该被 transition 降优先级。

#### 8. `useDeferredValue`

`useDeferredValue` 用来延迟使用某个值。

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

它和 `useTransition` 的区别可以这样理解：

- `useTransition`：在产生更新时标记低优先级
- `useDeferredValue`：在消费某个值时延迟它的传播

当你能控制状态更新的位置时，用 `useTransition`。当值来自 props、外部状态或不方便包住更新来源时，可以考虑 `useDeferredValue`。

#### 9. Suspense 和并发

Suspense 的核心不是“显示 loading”，而是让组件在渲染期间声明：**我现在还不能完成这次渲染，需要等待某个异步资源。**

```jsx
<Suspense fallback={<Spinner />}>
  <UserProfile />
</Suspense>
```

在并发渲染中，Suspense 可以和 transition 配合：

- 紧急更新优先提交
- 低优先级更新如果 suspend，可以继续显示旧 UI
- 等数据准备好后再提交新 UI

这能避免很多“整个页面突然变 loading”的体验问题。

#### 10. 自动批处理

React 18 以后，自动批处理范围扩大。

```jsx
fetch('/api/user').then(() => {
  setUser(user)
  setLoading(false)
})
```

这两个更新通常会合成一次 render。

自动批处理和并发不是一回事：

- 批处理解决的是“多个更新合成一次 render”
- 并发解决的是“render 工作如何按优先级调度、打断和恢复”

它们共同目标都是减少不必要阻塞，提高交互响应性。

#### 11. `flushSync`

有些场景需要立刻提交 DOM，例如调用第三方 DOM API 前必须保证 DOM 已更新。

```jsx
import { flushSync } from 'react-dom'

flushSync(() => {
  setOpen(true)
})

dialogRef.current.focus()
```

`flushSync` 会强制 React 同步刷新更新，破坏调度和批处理收益，所以应该少用。

面试里可以说：**它是逃生口，不是常规状态更新方式。**

#### 12. 并发下的副作用约束

并发渲染下，render 阶段可能被重试或丢弃。

下面写法不安全：

```jsx
function Product({ id }) {
  reportView(id)

  return <div>{id}</div>
}
```

如果 render 被重试，埋点可能重复发送；如果 render 被丢弃，埋点可能对应一个从未显示过的 UI。

正确做法：

```jsx
function Product({ id }) {
  useEffect(() => {
    reportView(id)
  }, [id])

  return <div>{id}</div>
}
```

并发机制要求组件函数是纯计算：同样输入返回同样 UI，不直接影响外部世界。

#### 13. tearing 和 `useSyncExternalStore`

并发渲染还有一个重要问题：外部 store 可能在渲染过程中变化，导致不同组件读到不一致状态，这类问题通常叫 tearing。

React 提供 `useSyncExternalStore` 让外部状态库以并发安全的方式接入 React。

```jsx
function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )
}
```

它要求：

- `subscribe` 负责订阅外部变化
- `getSnapshot` 返回当前快照
- 快照不变时要保持引用稳定

这也是为什么 Redux、Zustand 等状态库在 React 18 后都需要关注并发安全。

#### 14. 并发和性能优化的边界

并发不是替代所有性能优化的银弹。

它能改善：

- 输入和重渲染互相阻塞
- 大更新导致交互卡顿
- 异步切换时 loading 闪烁
- 不同优先级更新混在一起

它不能替代：

- 减少无意义 render
- 虚拟列表
- 代码分割
- 数据缓存
- 图片和资源优化
- 算法复杂度优化

如果一次列表渲染本身要处理十万条数据，transition 只能让它更会“让路”，不能让十万条计算凭空消失。

#### 15. React 19 相关能力

React 19 的很多能力也要放在并发和异步 UI 的背景下理解。

##### 15.1 `useActionState`

`useActionState` 让表单 action 的 pending、返回状态和提交逻辑更集中。

它解决的是异步提交状态管理问题，不是替代所有表单库。

##### 15.2 `useOptimistic`

`useOptimistic` 用来做乐观更新。

它适合消息发送、点赞、收藏这类“先展示结果，失败再回退”的交互。

这和并发模型关系密切：UI 可以先进入一个临时状态，而真实异步结果回来后再确认或回滚。

##### 15.3 `use`

`use` 可以在组件里读取 Promise 或 Context，并和 Suspense 配合。

关键点是：它不是随便在客户端组件里发请求的万能 API。Promise 应该保持稳定，否则会造成重复 suspend 或重复请求。

#### 16. 常见高级追问

##### 16.1 React 并发是不是多线程

不是。它是主线程上的协作式调度。React 把渲染拆成 Fiber 工作单元，并在合适时机让出主线程。

##### 16.2 并发渲染为什么要求 render 纯净

因为 render 阶段可能被中断、重试或丢弃。如果在 render 里执行副作用，就可能出现重复请求、重复埋点、操作了未提交 UI 等问题。

##### 16.3 `startTransition` 和普通 `setState` 有什么区别

普通 `setState` 默认按当前上下文优先级调度。`startTransition` 里的更新会被标记为非紧急更新，可以被更高优先级更新打断。

##### 16.4 `useTransition` 和 `useDeferredValue` 怎么选

能控制更新来源时，用 `useTransition` 标记低优先级更新。不能控制来源，或想延迟消费某个值时，用 `useDeferredValue`。

##### 16.5 Suspense 只是 loading 组件吗

不是。Suspense 是异步渲染边界。它让 React 知道某个子树暂时不能完成渲染，并决定展示 fallback、保留旧 UI 或等待新 UI。

##### 16.6 自动批处理和并发有什么区别

自动批处理是把多个状态更新合并成一次 render。并发是让 render 可以按优先级调度、暂停、恢复和丢弃。两者相关，但不是一回事。

##### 16.7 为什么外部状态库要关注 `useSyncExternalStore`

因为并发渲染下外部 store 可能在渲染过程中变化，导致不同组件读到不同快照。`useSyncExternalStore` 提供了并发安全的订阅协议。

#### 17. 面试回答模板

如果面试官问“React 并发机制”，可以按这个顺序回答：

1. React 并发不是多线程，而是基于 Fiber 的协作式调度
2. Fiber 把组件树拆成可保存、可恢复的工作单元，render 阶段可以被中断、重试、丢弃
3. React 会给更新分配不同优先级，内部用 lanes 表达这些优先级
4. 高优先级更新比如输入要优先响应，低优先级更新可以用 `startTransition` / `useTransition` 标记
5. `useDeferredValue` 是延迟消费某个值，适合不方便控制更新来源的场景
6. Suspense 是异步渲染边界，能和 transition 配合避免页面频繁进入全局 loading
7. render 阶段必须纯净，副作用放到 commit 后的 Effect 中
8. 自动批处理减少 render 次数，并发调度决定 render 工作如何让路和恢复
9. 对外部 store，要用 `useSyncExternalStore` 这类协议保证并发安全

这样回答能把 Fiber、scheduler、lanes、transition、Suspense 和 Effect 约束串成一条完整链路。
