# Day 38 手写 mini-vue reactivity

## 今日目标

- 在仓库 `hand-write/` 下新建一个 mini-vue-reactivity 目录（或更新 `vue-book/reactive-system`）
- 实现 `reactive / ref / effect / computed / watch` 五件套
- 写 3 个测试用例：基础响应 / 嵌套 effect / computed 缓存

## 按顺序阅读

1. [响应式原理](../advanced/week3/reactivity)
2. [Vue 3](../framework/vue/vue3)

## 实操与自测

**检查点**

- 必须实现 `effectStack` 才能处理嵌套 effect
- `cleanup` 是优化点，每次 run 前先把自己从 deps 里清掉，再重新收集
- `computed` 用 `dirty` 标志 + 惰性求值，必须让访问者能收到它的 trigger

**先独立完成，再对照专题**

- 依赖收集数据结构 — [参考章节](../advanced/week3/reactivity#day-38-依赖收集数据结构)
- 五件套关系图 — [参考章节](../advanced/week3/reactivity#day-38-五件套关系图)
- 实现要点 — [参考章节](../advanced/week3/reactivity#day-38-实现要点)
- reactive + effect + computed 核心实现 — [参考章节](../advanced/week3/reactivity#day-38-reactive-effect-computed-核心实现)

**脱稿口述题**

- 1. 你手写 mini-vue 时踩过哪些坑？
- 2. 嵌套 effect 为什么需要栈？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 五件套关系图 + 数据结构（WeakMap → Map → Set）（2 分钟）
2. 三个踩坑点（嵌套 effect / cleanup / computed dirty）（2 分钟）
3. 和 Vue 源码的差距（调度优先级 / 批量更新 / ref unwrap）（1 分钟）

录完后自查：

- 是否说出 WeakMap → Map → Set 的三层结构。
- 是否说出 effectStack 解决嵌套问题。
- 是否说出 cleanup 解决条件分支的过期依赖。
- 是否说出 computed 的 dirty + scheduler 机制。

## 复盘

今天最需要回补的 3 个点：

1. `ref` 的自动 unwrap 在 reactive 内部的处理逻辑。
2. `watch` 的 `immediate / flush: 'post'` 实现差异。
3. 源码中 `triggerEffects` 的排序逻辑（computed effect 优先执行）。
