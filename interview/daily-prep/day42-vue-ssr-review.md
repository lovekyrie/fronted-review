# Day 42 Vue SSR / Nuxt + Vue 专题追问

## 今日目标

- 看完 Vue SSR、Nuxt 官方概念
- 输出 Vue SSR 答题稿：双端同构、hydrate、序列化、环境差异
- 汇总 Day 29–41，形成《Vue 方向 20 题答题本》

## 按顺序阅读

1. [SSR/SSG](../advanced/ssr-ssg)
2. [Week 3 路线图](../advanced/week3/roadmap)
3. [Vue 性能优化](../framework/vue/performance-optimization)

## 实操与自测

**检查点**

- SSR 的痛点：双端 API 差异（`window / document` 不能随便用）、状态序列化、请求合并
- `hydrate` 失败的典型原因：服务端和客户端 HTML 不一致（时间戳、随机数、条件渲染）
- Nuxt 3 的 `useAsyncData / useFetch` 帮你做了请求去重和状态复用

**先独立完成，再对照专题**

- SSR / SSG / CSR 对比
- Vue SSR 流程
- Hydrate 机制
- Hydration 失败常见原因
- Nuxt 3 关键 API
- SSR 完整链路
- 环境差异处理

**脱稿口述题**

- 1. SSR / SSG / CSR 怎么选？
- 2. Hydrate 失败有哪些坑？

**模拟流程与评分**

### SSR / SSG / CSR 对比

| 模式 | 渲染时机 | 首屏 | SEO | 服务器成本 | 适用场景 |
|------|----------|------|-----|-----------|----------|
| CSR | 浏览器 | 慢 | 差 | 低 | 管理后台、SPA |
| SSR | 每次请求 | 快 | 好 | 高 | 动态内容、电商 |
| SSG | 构建时 | 快 | 好 | 最低 | 博客、文档、营销页 |

### Vue SSR 流程

```text
1. 浏览器请求 → Node 服务器
2. 服务端: createSSRApp() → 注入路由/Pinia → renderToString(app)
3. 序列化状态: window.__INITIAL_STATE__ = JSON.stringify(piniaState)
4. 返回完整 HTML（含 state + 应用 HTML）
5. 客户端: createSSRApp() → hydrateApp → 复用服务端 DOM → 绑定事件
```

### Hydrate 机制

- 客户端不重新创建 DOM，而是**复用**服务端渲染的 HTML。
- 逐个对比 VNode 和真实 DOM，如果一致则只绑定事件。
- **不一致**时 hydration mismatch，开发模式报警告，生产模式可能导致页面行为异常。

### Hydration 失败常见原因

- 服务端和客户端渲染结果不同（时间戳、`Math.random()`、`Date.now()`）。
- 使用了仅客户端 API（`window`、`document`）导致服务端渲染不同。
- 异步数据未在服务端获取完就渲染。
- `v-if` 依赖客户端状态导致两端 HTML 结构不同。

### Nuxt 3 关键 API

| API | 作用 |
|-----|------|
| `useFetch` | 自动去重 + 状态序列化的数据获取 |
| `useAsyncData` | 自定义 key 的异步数据获取 |
| `useState` | SSR 安全的共享状态 |
| `definePageMeta` | 页面级配置（layout、middleware） |

### SSR 完整链路

```text
浏览器 GET /about
  → Node server 接收请求
  → createSSRApp() + router.push('/about') + await router.isReady()
  → 执行 setup / onServerPrefetch 获取数据
  → renderToString(app) → HTML 字符串
  → 注入 <script>window.__INITIAL_STATE__=...</script>
  → 返回完整 HTML
  → 浏览器渲染 HTML（用户立即看到内容）
  → 加载 JS → createSSRApp() → hydrate
  → 复用 DOM + 绑定事件 → 页面可交互
```

### 环境差异处理

[参考代码](../advanced/ssr-ssg#day-42-practice-code)

**录音练习**

1. 响应式（Proxy / track-trigger / 依赖收集三层结构）（2 分钟）
2. 编译优化（Patch Flag / Block Tree / 静态提升）（2 分钟）
3. 渲染 + diff（renderer / children diff 三阶段 / LIS）（1.5 分钟）
4. 组件调度（setupRenderEffect / shouldUpdateComponent / nextTick）（1 分钟）
5. 生态（Router 三模式 + 守卫 / Pinia 状态分层 / SSR hydrate）（1.5 分钟）

## 复盘

Vue 方向最容易被击穿的 3 题：

1. "Patch Flag 和 Block Tree 具体怎么优化 diff？"——需要画出对比图，说清 dynamicChildren。
2. "Vue 3 的 diff 和 React 的 diff 有什么区别？"——LIS vs 单向遍历 + Fiber。
3. "SSR hydrate 失败怎么排查？"——需要说出具体场景和解决方案，不能泛泛而谈。

本周新增的 3 个"为什么"：

1. 为什么 Vue 3 编译优化能让 diff 从 O(n) 降到 O(动态节点数)？
2. 为什么 Pinia 不需要 mutations？（响应式系统已经追踪了变化）
3. 为什么 SSR 的 hydrate 不重建 DOM 而是复用？（避免首屏闪烁 + 减少 DOM 操作）
