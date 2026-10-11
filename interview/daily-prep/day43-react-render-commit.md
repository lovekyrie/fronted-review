# Day 43 React render / commit / batching

## 今日目标

- 看完 React 官方 Queueing State Updates + `/framework/react/hooks`
- 画一张 React 更新流程图：Trigger → Render（Reconciler）→ Commit
- 输出 React 18 自动批处理的答题稿

## 按顺序阅读

1. [并发机制](../advanced/week4/concurrency)
2. [React Hooks](../framework/react/hooks)

## 实操与自测

**检查点**

- Render 阶段可被中断 / 重试（Concurrent），Commit 阶段不可中断
- React 18 之前，batching 只在事件处理里生效；18 之后扩展到 Promise / setTimeout / 原生事件
- `flushSync` 用于“我必须立刻更新”的场景，是紧急出口

**先独立完成，再对照专题**

- Fiber 架构 — [参考章节](../advanced/week4/concurrency#day-43-fiber-架构)
- React 更新两阶段 — [参考章节](../advanced/week4/concurrency#day-43-react-更新两阶段)
- 自动批处理（React 18） — [参考章节](../advanced/week4/concurrency#day-43-自动批处理-react-18)
- Lanes 优先级模型 — [参考章节](../advanced/week4/concurrency#day-43-lanes-优先级模型)
- React 更新完整链路 — [参考章节](../advanced/week4/concurrency#day-43-react-更新完整链路)
- 批处理对比 — [参考章节](../advanced/week4/concurrency#day-43-批处理对比)

**脱稿口述题**

- 1. React 18 的自动批处理具体改了什么？
- 2. Render 阶段和 Commit 阶段的根本区别？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 更新两阶段（Render 可中断做 diff / Commit 不可中断操作 DOM）+ Commit 三子阶段（2 分钟）
2. React 18 自动批处理（对比 17 的四种场景 + flushSync 出口）（1.5 分钟）
3. Lanes 优先级（Sync > Input > Default > Idle）+ startTransition 的作用（1.5 分钟）

录完后自查：

- 是否说出 Render 可中断、Commit 不可中断。
- 是否说出 React 18 所有场景自动批处理。
- 是否说出 flushSync 的作用。
- 是否说出 Lanes 是优先级模型。

## 复盘

今天最需要回补的 3 个点：

1. Fiber 链表遍历顺序（beginWork 深度优先、completeWork 回溯）。
2. `useLayoutEffect` 和 `useEffect` 在 Commit 阶段的执行时机差异。
3. Concurrent 模式下 render 被中断后如何恢复（workInProgress tree）。
