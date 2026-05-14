# Day 47 useTransition / useDeferredValue 与并发机制 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 47 | 并发 | [并发机制](../advanced/week4/concurrency) |

## 今日目标

- 看完 React useTransition、useDeferredValue、Suspense
- 输出并发渲染答题稿：Lanes / 可中断 Render / 优先级
- 找一个真实场景举例：搜索框大量结果渲染，保持输入流畅

## 阅读卡点

- `useTransition` 把一次 update 标记为**非紧急**，让浏览器优先处理紧急任务（输入）
- `useDeferredValue` 不改动触发方，而是**延迟消费方**；两者互补
- 并发不是多线程，是单线程下的**可中断调度**

## 速记卡 / 知识点

### 并发渲染核心概念

- **不是多线程**，是单线程下的**可中断调度**。
- 高优先级更新（用户输入）可以中断低优先级更新（列表渲染）。
- 中断后低优先级更新不会丢失，会在空闲时恢复。

### useTransition

```jsx
const [isPending, startTransition] = useTransition()

function handleChange(e) {
  // 紧急更新：输入框立即响应
  setInput(e.target.value)
  // 非紧急更新：结果列表可以延后
  startTransition(() => {
    setSearchResults(filterData(e.target.value))
  })
}
```

- `startTransition` 内的 setState 被标记为 TransitionLane（低优先级）。
- `isPending` 为 true 时可以显示加载指示器。
- 如果用户继续输入，之前的 transition 渲染会被中断。

### useDeferredValue

```jsx
const deferredQuery = useDeferredValue(query)
// deferredQuery 会"延后"更新，保证当前帧优先处理紧急更新
```

- 和 `useTransition` 的区别：`useTransition` 在**触发方**标记低优先级，`useDeferredValue` 在**消费方**延迟使用值。
- 适合无法控制 setState 触发方的场景（如 props 传入的值）。

### 选型指南

| 场景 | 选择 |
|------|------|
| 你控制 setState | `useTransition` |
| 值来自 props/外部 | `useDeferredValue` |
| 需要 loading 状态 | `useTransition`（有 `isPending`） |

### Suspense 协同

```jsx
<Suspense fallback={<Loading />}>
  <SearchResults query={deferredQuery} />
</Suspense>
```

- Transition + Suspense：低优先级渲染触发 suspend 时，显示旧 UI 而不是 fallback。
- 用户体验更好：输入框流畅，旧结果保持可见直到新结果就绪。

## 手写 / 流程图

### 搜索框完整示例

```jsx
function SearchPage() {
  const [input, setInput] = useState('')
  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState([])

  function handleChange(e) {
    setInput(e.target.value)  // 紧急：输入框立即响应
    startTransition(() => {
      // 非紧急：大量数据过滤
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

### 并发调度流程

```text
用户输入 'a'
  → SyncLane: setInput('a') → 立即 render 输入框
  → TransitionLane: setResults(filter) → 开始 render 列表
用户继续输入 'ab'（列表还在渲染中）
  → SyncLane: setInput('ab') → 中断列表 render → 立即 render 输入框
  → TransitionLane: setResults(filter('ab')) → 丢弃之前的 render，重新开始
最终：输入框始终流畅，列表只渲染最终结果
```

## 口述题

### 1. useTransition 和 useDeferredValue 怎么选？

回答模板：

> 取决于你能否控制 setState 的调用。如果你能控制触发更新的地方（比如事件处理函数里），用 `useTransition`，把非紧急的 setState 包在 `startTransition` 里。它还提供 `isPending` 做 loading 状态。
>
> 如果你控制不了 setState（比如值是从 props 传入的，或者来自第三方库），用 `useDeferredValue`，在消费端延迟使用值。本质是一样的——都是把更新标记为低优先级，让紧急更新优先处理。

### 2. React 并发不是多线程，那它"并发"在哪？

回答模板：

> React 的并发是**调度层面的**，不是操作系统线程级的。它在单线程里实现了"可中断的渲染"。具体来说：Render 阶段的工作被拆成小任务（每个 Fiber 节点是一个工作单元），每处理完一个 Fiber 就检查是否有更高优先级的任务。如果有，就暂停当前渲染，先处理高优先级任务，空闲时再恢复。
>
> 这就像操作系统的时间片轮转：虽然只有一个 CPU（JS 线程），但通过快速切换让用户感觉多个任务"同时"在进行。高优先级（用户输入）始终不被阻塞，低优先级（大列表渲染）利用空闲时间完成。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 并发渲染含义（单线程可中断调度 + Lanes 优先级）（1.5 分钟）
2. useTransition 搜索框场景 + isPending（2 分钟）
3. useDeferredValue 场景 + Suspense 协同保持旧 UI（1.5 分钟）

录完后自查：

- 是否说出并发不是多线程而是可中断调度。
- 是否说出 startTransition 标记低优先级。
- 是否说出 useTransition 控制触发方、useDeferredValue 控制消费方。
- 是否说出 Suspense + Transition 保持旧 UI 不闪 fallback。

## 今日复盘

今天最需要回补的 3 个点：

1. `startTransition` 和 `useDeferredValue` 在源码层面的 Lane 分配差异。
2. Suspense 在并发模式下的"reveal"策略（何时显示 fallback vs 保持旧 UI）。
3. `useOptimistic` 和 Transition 的配合模式。
