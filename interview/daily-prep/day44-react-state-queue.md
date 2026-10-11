# Day 44 React state queue 与函数式更新

## 今日目标

- 看完 React useState / Queueing State Updates
- 做 3 道输出题（连续 `setCount(count + 1)` × 3 vs `setCount(c => c + 1)` × 3）
- 输出 stale state / stale closure 的典型案例 + 修复方式

## 按顺序阅读

1. [Week 4 Hooks](../advanced/week4/hooks)
2. [React Hooks](../framework/react/hooks)

## 实操与自测

**检查点**

- `setState` 只是把更新入队，本次 render 内 state 不变
- 直接值更新会用**本次 render 快照**的 state，函数式更新用**队列累积**的 state
- 函数式更新天然能解决“连点 3 次按钮只加 1”的老问题

**先独立完成，再对照专题**

- state 更新模型 — [参考章节](../advanced/week4/hooks#day-44-state-更新模型)
- 直接值 vs 函数式更新 — [参考章节](../advanced/week4/hooks#day-44-直接值-vs-函数式更新)
- 队列处理规则 — [参考章节](../advanced/week4/hooks#day-44-队列处理规则)
- stale closure 典型场景 — [参考章节](../advanced/week4/hooks#day-44-stale-closure-典型场景)
- 3 道经典输出题 — [参考章节](../advanced/week4/hooks#day-44-3-道经典输出题)

**脱稿口述题**

- 1. 为什么连续调 3 次 setState 只加了 1？
- 2. 什么是 stale closure？怎么修？

**录音练习**

按这个顺序录，不要临场重新组织：

1. state 入队模型 + 快照心智模型（1.5 分钟）
2. 直接值 vs 函数式 + 3 道输出题（2 分钟）
3. stale closure 场景 + 三种修法（1.5 分钟）

录完后自查：

- 是否说出 state 在一次 render 内是快照。
- 是否说出直接值用快照、函数式用队列累积值。
- 是否说出 stale closure 的典型场景和修复方式。
- 是否能口算混合题的结果。

## 复盘

今天最需要回补的 3 个点：

1. `useReducer` 的更新队列和 `useState` 的关系（useState 底层就是 useReducer）。
2. `useEffectEvent`（React 19）如何隔离不想触发的值。
3. 对象 state 的不可变更新模式（为什么必须展开新对象）。
