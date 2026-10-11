# Day 41 Pinia / Vuex 状态管理

## 今日目标

- 看完 `/framework/vue/state-management`
- 输出 Pinia vs Vuex 对比表：API 形态、模块化、TypeScript 友好度、devtools
- 画一张状态分层图：local / global / server cache（React Query / SWR 思路）

## 按顺序阅读

1. [Vue 状态管理](../framework/vue/state-management)

## 实操与自测

**检查点**

- Pinia 天然支持组合式 API，不再需要 mutations
- 大型应用的状态分层：组件内 state / 全局 store / 服务端状态缓存 / URL 状态
- 持久化要区分“同步 localStorage”还是“异步 IndexedDB”

**先独立完成，再对照专题**

- Pinia vs Vuex 对比 — [参考章节](../framework/vue/state-management#day-41-pinia-vs-vuex-对比)
- Pinia 两种 store 写法 — [参考章节](../framework/vue/state-management#day-41-pinia-两种-store-写法)
- 状态分层架构 — [参考章节](../framework/vue/state-management#day-41-状态分层架构)
- 持久化方案 — [参考章节](../framework/vue/state-management#day-41-持久化方案)
- Pinia 核心原理简示 — [参考章节](../framework/vue/state-management#day-41-pinia-核心原理简示)
- Vuex 数据流 — [参考章节](../framework/vue/state-management#day-41-vuex-数据流)

**脱稿口述题**

- 1. 为什么 Pinia 取代了 Vuex？
- 2. 状态分层怎么讲得像"架构设计"而不是"调库"？

**录音练习**

按这个顺序录，不要临场重新组织：

1. Pinia 三大优势（去 mutations / TS 友好 / 模块化）（1.5 分钟）
2. 两种 store 写法 + Vuex 迁移要点（1.5 分钟）
3. 状态分层五层架构（组件/全局/服务端缓存/URL/持久化）（2 分钟）

录完后自查：

- 是否说出 Pinia 去掉 mutations 的原因。
- 是否说出 Setup Store 的写法和优势。
- 是否说出状态分层至少 4 层。
- 是否说出持久化方案（localStorage vs IndexedDB）。

## 复盘

今天最需要回补的 3 个点：

1. `storeToRefs` 的用途（解构 store 时保持响应性）。
2. Pinia 插件系统（如何写自定义插件做日志、持久化等）。
3. 服务端状态 vs 客户端状态的边界划分在实际项目中的应用。
