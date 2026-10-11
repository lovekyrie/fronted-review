# Day 32 ref / reactive / computed / watch

## 今日目标

- 看完 Vue Computed / Watchers 文档
- 输出 4 个 API 的对照表：用法、响应边界、常见坑
- 手写最小版 `ref` + `computed`

## 按顺序阅读

1. [响应式原理](../advanced/week3/reactivity)
2. [Vue 3](../framework/vue/vue3)

## 实操与自测

**检查点**

- `ref` 是带 `.value` 的对象包装，解构会丢响应；`reactive` 解构也会丢响应，要 `toRefs`
- `computed` 的懒计算：只有被访问时才 run，且会缓存结果
- `watch` 的 `immediate / deep / flush` 三个选项各自解决什么问题

**先独立完成，再对照专题**

- 4 API 对照表 — [参考章节](../advanced/week3/reactivity#day-32-4-api-对照表)
- 响应丢失 3 种典型场景 — [参考章节](../advanced/week3/reactivity#day-32-响应丢失-3-种典型场景)
- 补充笔记 — [参考章节](../advanced/week3/reactivity#day-32-补充笔记)

**脱稿口述题**

- 1. `ref` 和 `reactive` 怎么选？
- 2. `computed` 和 `watch` 怎么选？

**录音练习**

1. 4 API 用法边界（2 分钟）
2. 响应丢失 3 种场景（1.5 分钟）
3. computed 懒计算 + 缓存（1.5 分钟）

## 复盘

1. 最容易被追问：`computed` 不是普通函数缓存，而是懒执行 effect + dirty 标记 + 对外暴露 `.value` 依赖。
2. 当前短板：`watchEffect` 的自动依赖只覆盖同步阶段，异步 `await` 后的依赖不能随便依赖隐式追踪。
3. 下一次补充：接到 Day33，把这些 API 放回 Vue 2 与 Vue 3 响应式架构差异里对比。
