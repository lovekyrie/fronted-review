# Day 20 生产构建实战 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 20 | 生产构建 | [构建工具](../advanced/week1/build-tools)、[按小时清单](../advanced/week1/hourly) |

## 今日目标

- 看完 Vite Build / Env and Mode、webpack Caching
- 整理仓库现有 Vite 配置（`.vitepress` 或 其他项目），补注释说明每一项作用
- 写一张 Vite vs webpack 的**生产构建**对照表

## 阅读卡点

- `mode` 决定 `process.env.NODE_ENV`，但 Vite 额外有 `.env.[mode]` 的加载顺序
- source map 的 7 种类型要能讲出生产环境应该用哪种（`hidden-source-map` 最常见）
- 构建产物要同时考虑 **体积 / 请求数 / 缓存命中率** 三个维度

## 速记卡 / 知识点

<!-- env 加载顺序 / source map 类型 / 压缩策略 / 产物分析工具 (rollup-plugin-visualizer / webpack-bundle-analyzer) -->

## 手写 / 流程图

```js
// 典型生产构建 vite.config.ts 的关键字段：build.rollupOptions.output.manualChunks
```

## 口述题

### 1. 生产 source map 怎么处理？

> 回答模板：

### 2. 产物优化你会从哪 3 个维度入手？

> 回答模板：

## 5 分钟录音顺序

1. env / mode 模型（1 分钟）
2. 产物拆分 + chunk 策略（2 分钟）
3. source map + 产物分析（2 分钟）

## 今日复盘

1. 
2. 
3. 
