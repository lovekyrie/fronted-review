# Day 41 Pinia / Vuex 状态管理 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 41 | Pinia / Vuex | [Vue 状态管理](../framework/vue/state-management) |

## 今日目标

- 看完 `/framework/vue/state-management`
- 输出 Pinia vs Vuex 对比表：API 形态、模块化、TypeScript 友好度、devtools
- 画一张状态分层图：local / global / server cache（React Query / SWR 思路）

## 阅读卡点

- Pinia 天然支持组合式 API，不再需要 mutations
- 大型应用的状态分层：组件内 state / 全局 store / 服务端状态缓存 / URL 状态
- 持久化要区分“同步 localStorage”还是“异步 IndexedDB”

## 速记卡 / 知识点

<!-- Pinia 两种 store 写法 / Vuex 五要素 / 状态分层 / 持久化方案 -->

## 手写 / 流程图

```ts
// defineStore 两种写法：Options / Setup
```

## 口述题

### 1. 为什么 Pinia 取代了 Vuex？

> 回答模板：

### 2. 状态分层怎么讲得像“架构设计”而不是“调库”？

> 回答模板：

## 5 分钟录音顺序

1. Pinia 设计要点（1.5 分钟）
2. Vuex 迁移常见坑（1.5 分钟）
3. 状态分层思路（2 分钟）

## 今日复盘

1. 
2. 
3. 
