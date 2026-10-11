# Day 20 生产构建实战

## 今日目标

- 看完 Vite Build / Env and Mode、webpack Caching
- 整理仓库现有 Vite 配置（`.vitepress` 或 其他项目），补注释说明每一项作用
- 写一张 Vite vs webpack 的**生产构建**对照表

## 按顺序阅读

1. [构建工具](../advanced/week1/build-tools)
2. [按小时清单](../advanced/week1/hourly)

## 实操与自测

**检查点**

- `mode` 决定 `process.env.NODE_ENV`，但 Vite 额外有 `.env.[mode]` 的加载顺序
- source map 的 7 种类型要能讲出生产环境应该用哪种（`hidden-source-map` 最常见）
- 构建产物要同时考虑 **体积 / 请求数 / 缓存命中率** 三个维度

**先独立完成，再对照专题**

- 知识补充 — [参考章节](../advanced/week1/build-tools#day-20-知识补充)
- 动手示例 — [参考章节](../advanced/week1/build-tools#day-20-动手示例)

**脱稿口述题**

- 1. 生产 source map 怎么处理？
- 2. 产物优化你会从哪 3 个维度入手？

**录音练习**

1. env / mode 模型（1 分钟）
2. 产物拆分 + chunk 策略（2 分钟）
3. source map + 产物分析（2 分钟）

## 复盘

1. 最容易被追问：Vite 开发快不等于生产不用打包，生产阶段仍要面对 Rollup 的拆包、hash、压缩和 source map 策略。
2. 当前短板：manualChunks 不能只机械拆 `vendor`，要结合首屏路径、依赖体积、缓存稳定性和请求数权衡。
3. 下一次补充：找一个真实项目产物，用 analyzer 标出首屏大 chunk、重复依赖和可延迟加载模块。
