# Day 42 Vue SSR / Nuxt + Vue 专题追问 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 42 | SSR + Vue 复盘 | [SSR/SSG](../advanced/ssr-ssg)、[Week 3 路线图](../advanced/week3/roadmap)、[Vue 性能优化](../framework/vue/performance-optimization) |

## 今日目标

- 看完 Vue SSR、Nuxt 官方概念
- 输出 Vue SSR 答题稿：双端同构、hydrate、序列化、环境差异
- 汇总 Day 29–41，形成《Vue 方向 20 题答题本》

## 阅读卡点

- SSR 的痛点：双端 API 差异（`window / document` 不能随便用）、状态序列化、请求合并
- `hydrate` 失败的典型原因：服务端和客户端 HTML 不一致（时间戳、随机数、条件渲染）
- Nuxt 3 的 `useAsyncData / useFetch` 帮你做了请求去重和状态复用

## 速记卡 / 知识点

<!-- SSR 流程 / hydrate 机制 / Nuxt 关键 API / SEO + 首屏收益 -->

## 手写 / 流程图

```text
请求 → 服务端 createApp → renderToString → 注入 state → HTML → 客户端 hydrate
```

## 口述题

### 1. SSR / SSG / CSR 怎么选？

> 回答模板：

### 2. Hydrate 失败有哪些坑？

> 回答模板：

## 8 分钟录音顺序（Vue 专题总结）

1. 响应式（2 分钟）
2. 编译优化（2 分钟）
3. 渲染 + diff（1.5 分钟）
4. 组件调度（1 分钟）
5. 生态：Router / Pinia / SSR（1.5 分钟）

## 今日复盘

Vue 方向最容易被击穿的 3 题：

1. 
2. 
3. 

本周新增的 3 个“为什么”：

1. 
2. 
3. 
