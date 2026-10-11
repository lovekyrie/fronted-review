# Day 47 useTransition / useDeferredValue 与并发机制

## 今日目标

- 看完 React useTransition、useDeferredValue、Suspense
- 输出并发渲染答题稿：Lanes / 可中断 Render / 优先级
- 找一个真实场景举例：搜索框大量结果渲染，保持输入流畅

## 按顺序阅读

1. [并发机制](../advanced/week4/concurrency)

## 实操与自测

**检查点**

- `useTransition` 把一次 update 标记为**非紧急**，让浏览器优先处理紧急任务（输入）
- `useDeferredValue` 不改动触发方，而是**延迟消费方**；两者互补
- 并发不是多线程，是单线程下的**可中断调度**

**先独立完成，再对照专题**

- 并发渲染核心概念 — [参考章节](../advanced/week4/concurrency#day-47-并发渲染核心概念)
- useTransition — [参考章节](../advanced/week4/concurrency#day-47-usetransition)
- useDeferredValue — [参考章节](../advanced/week4/concurrency#day-47-usedeferredvalue)
- 选型指南 — [参考章节](../advanced/week4/concurrency#day-47-选型指南)
- Suspense 协同 — [参考章节](../advanced/week4/concurrency#day-47-suspense-协同)
- 搜索框完整示例 — [参考章节](../advanced/week4/concurrency#day-47-搜索框完整示例)
- 并发调度流程 — [参考章节](../advanced/week4/concurrency#day-47-并发调度流程)

**脱稿口述题**

- 1. useTransition 和 useDeferredValue 怎么选？
- 2. React 并发不是多线程，那它"并发"在哪？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 并发渲染含义（单线程可中断调度 + Lanes 优先级）（1.5 分钟）
2. useTransition 搜索框场景 + isPending（2 分钟）
3. useDeferredValue 场景 + Suspense 协同保持旧 UI（1.5 分钟）

录完后自查：

- 是否说出并发不是多线程而是可中断调度。
- 是否说出 startTransition 标记低优先级。
- 是否说出 useTransition 控制触发方、useDeferredValue 控制消费方。
- 是否说出 Suspense + Transition 保持旧 UI 不闪 fallback。

## 复盘

今天最需要回补的 3 个点：

1. `startTransition` 和 `useDeferredValue` 在源码层面的 Lane 分配差异。
2. Suspense 在并发模式下的"reveal"策略（何时显示 fallback vs 保持旧 UI）。
3. `useOptimistic` 和 Transition 的配合模式。
