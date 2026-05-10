# Day 19 代码分割 / Tree Shaking / 缓存 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 19 | 代码分割 / Tree Shaking | [构建工具](../advanced/week1/build-tools)、[按小时清单](../advanced/week1/hourly) |

## 今日目标

- 看完 webpack Code Splitting / Caching、Rollup tree shaking
- 输出 Tree Shaking 生效条件清单（ESM / sideEffects / 纯函数）
- 输出生产缓存策略答题稿：文件名 hash、HTTP 缓存头、CDN 层缓存

## 阅读卡点

- `sideEffects: false` 是一把双刃剑，错配置会导致 CSS 样式被 tree-shaken
- 动态 `import()` 默认拆 chunk，但要注意 magic comment 影响 chunk 名
- 长效缓存要解决“业务代码变更不影响 vendor hash”的问题

## 速记卡 / 知识点

<!-- 分割策略（路由级 / 组件级 / vendor 级）/ tree shaking 条件 / 缓存三层（浏览器 / CDN / 网关）-->

## 手写 / 流程图

```js
// 动态 import 的 3 种写法 + 对应 chunk 输出名
```

## 口述题

### 1. Tree Shaking 生效的前置条件是什么？

> 回答模板：

### 2. 生产环境的缓存与版本策略应该怎么设计？

> 回答模板：

## 5 分钟录音顺序

1. Tree Shaking 原理 + 常见失效场景（2 分钟）
2. 代码分割三级策略（1.5 分钟）
3. 缓存三层联动（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
