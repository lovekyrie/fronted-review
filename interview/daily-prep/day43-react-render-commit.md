# Day 43 React render / commit / batching 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 43 | render/commit | [并发机制](../advanced/week4/concurrency)、[React Hooks](../framework/react/hooks) |

## 今日目标

- 看完 React 官方 Queueing State Updates + `/framework/react/hooks`
- 画一张 React 更新流程图：Trigger → Render（Reconciler）→ Commit
- 输出 React 18 自动批处理的答题稿

## 阅读卡点

- Render 阶段可被中断 / 重试（Concurrent），Commit 阶段不可中断
- React 18 之前，batching 只在事件处理里生效；18 之后扩展到 Promise / setTimeout / 原生事件
- `flushSync` 用于“我必须立刻更新”的场景，是紧急出口

## 速记卡 / 知识点

### Fiber 架构

- Fiber 是 React 的工作单元，每个组件对应一个 Fiber 节点。
- Fiber 树是链表结构：`child` / `sibling` / `return`（parent）。
- 核心价值：让 render 阶段可以**中断 / 恢复 / 复用**。

### React 更新两阶段

| 阶段 | 作用 | 可中断 | 涉及 |
|------|------|--------|------|
| **Render** | 遍历 Fiber 树，调用组件函数，计算新 VNode，diff 标记变更（effectTag） | ✅ 可中断 | `beginWork` / `completeWork` |
| **Commit** | 把变更同步到真实 DOM | ❌ 不可中断 | `BeforeMutation` / `Mutation` / `Layout` |

Commit 三个子阶段：
- **BeforeMutation**：`getSnapshotBeforeUpdate`、调度 `useEffect`。
- **Mutation**：实际 DOM 操作（增删改）。
- **Layout**：`useLayoutEffect` / `componentDidMount` / `componentDidUpdate`。

### 自动批处理（React 18）

| 场景 | React 17 | React 18 |
|------|----------|----------|
| 事件处理函数 | ✅ 批处理 | ✅ 批处理 |
| Promise.then | ❌ 不批处理 | ✅ 批处理 |
| setTimeout | ❌ 不批处理 | ✅ 批处理 |
| 原生事件 | ❌ 不批处理 | ✅ 批处理 |

React 18 用 `createRoot` 启用，所有场景自动批处理。`flushSync` 可以跳出批处理。

### Lanes 优先级模型

```text
SyncLane（同步）> InputContinuousLane（连续输入）> DefaultLane（默认）> IdleLane（空闲）
```

- 每个更新带一个 lane，调度器根据 lane 决定执行优先级。
- `startTransition` 把更新标记为低优先级（TransitionLane），可被高优先级中断。

## 手写 / 流程图

### React 更新完整链路

```text
setState(newValue)
  → 创建 Update 对象，挂到 Fiber.updateQueue
  → scheduleUpdateOnFiber(fiber, lane)
  → ensureRootIsScheduled → 根据 lane 选择调度方式
    → Sync: 微任务调度
    → Concurrent: MessageChannel / scheduler
  → Render 阶段:
    → workLoopSync / workLoopConcurrent
    → beginWork: 调用组件函数，diff children，标记 effectTag
    → completeWork: 收集 effect 链表
  → Commit 阶段:
    → BeforeMutation: 调度 useEffect
    → Mutation: DOM 操作
    → Layout: useLayoutEffect 同步执行
```

### 批处理对比

```jsx
function handleClick() {
  setCount(1)  // 不立即 re-render
  setFlag(true) // 不立即 re-render
  // 事件结束后统一 re-render 一次
}

// React 17 中 setTimeout 不批处理：
setTimeout(() => {
  setCount(1)  // re-render
  setFlag(true) // re-render  → 共 2 次
}, 0)

// React 18 自动批处理：只 1 次 re-render
```

## 口述题

### 1. React 18 的自动批处理具体改了什么？

回答模板：

> React 17 及之前，批处理只在 React 事件处理函数里生效。在 Promise.then、setTimeout、原生事件里多次 setState 会触发多次 re-render。React 18 通过 `createRoot` 启用新的并发模式后，所有场景都自动批处理，多次 setState 只触发一次 re-render。
>
> 原理是 React 18 改变了调度机制：不再依赖 React 事件系统的上下文标记，而是在微任务边界统一 flush 更新队列。如果某些场景确实需要立即更新（如操作后马上读 DOM），可以用 `flushSync` 强制同步。

### 2. Render 阶段和 Commit 阶段的根本区别？

回答模板：

> Render 阶段是"计算"阶段：遍历 Fiber 树，调用组件函数，diff 出哪些节点需要增删改，但不碰真实 DOM。它的关键特性是**可中断**——在 Concurrent 模式下，如果有更高优先级的更新进来，可以暂停当前 render，先处理高优先级的。
>
> Commit 阶段是"执行"阶段：把 render 阶段标记的变更同步到真实 DOM。这个阶段**不可中断**，因为 DOM 操作必须连续完成，否则用户会看到中间状态。Commit 分三个子阶段：BeforeMutation（快照）、Mutation（实际 DOM 操作）、Layout（同步 effect）。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 更新两阶段（Render 可中断做 diff / Commit 不可中断操作 DOM）+ Commit 三子阶段（2 分钟）
2. React 18 自动批处理（对比 17 的四种场景 + flushSync 出口）（1.5 分钟）
3. Lanes 优先级（Sync > Input > Default > Idle）+ startTransition 的作用（1.5 分钟）

录完后自查：

- 是否说出 Render 可中断、Commit 不可中断。
- 是否说出 React 18 所有场景自动批处理。
- 是否说出 flushSync 的作用。
- 是否说出 Lanes 是优先级模型。

## 今日复盘

今天最需要回补的 3 个点：

1. Fiber 链表遍历顺序（beginWork 深度优先、completeWork 回溯）。
2. `useLayoutEffect` 和 `useEffect` 在 Commit 阶段的执行时机差异。
3. Concurrent 模式下 render 被中断后如何恢复（workInProgress tree）。
