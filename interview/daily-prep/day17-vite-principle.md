# Day 17 Vite 原理

## 今日目标

- 看完 Vite Guide / Why Vite / Features / Dependency Pre-Bundling
- 画一张 Vite dev server 工作流程图
- 写 Vite vs webpack 对照表（上半部分：开发阶段）

## 按顺序阅读

1. [Vite](../advanced/week1/vite)
2. [构建工具](../advanced/week1/build-tools)
3. [Week 1 路线图](../advanced/week1/roadmap)
4. [webpack vs Vite](../engineering/webpack-vs-vite)

## 实操与自测

**检查点**

- Vite 开发阶段不打包，利用浏览器原生 ESM，这是“冷启动快”的根因
- 预构建（esbuild）解决两件事：CJS → ESM 转换 + 合并多文件减少请求
- HMR：Vite 只让受影响模块失效，而 webpack 需要重新 bundle 受影响的 chunk

**先独立完成，再对照专题**

- Vite 开发阶段原理 — [参考章节](../advanced/week1/vite#day-17-vite-开发阶段原理)
- 预构建（Dependency Pre-Bundling） — [参考章节](../advanced/week1/vite#day-17-预构建-dependency-pre-bundling)
- HMR 对比 — [参考章节](../advanced/week1/vite#day-17-hmr-对比)
- 生产构建 — [参考章节](../advanced/week1/vite#day-17-生产构建)
- Vite vs webpack 对照 — [参考章节](../advanced/week1/vite#day-17-vite-vs-webpack-对照)
- Vite Dev Server 完整流程 — [参考章节](../advanced/week1/vite#day-17-vite-dev-server-完整流程)
- Vite 插件 API 简示 — [参考章节](../advanced/week1/vite#day-17-vite-插件-api-简示)

**脱稿口述题**

- 1. 为什么 Vite 开发阶段通常比 webpack 更快？
- 2. Vite 生产构建为什么不用 esbuild 而用 Rollup？

**录音练习**

按这个顺序录，不要临场重新组织：

1. Vite 设计哲学（不打包源码 + 原生 ESM + 按需编译）（1.5 分钟）
2. 预构建（esbuild 做 CJS→ESM + 合并请求）+ HMR 模块级更新（2 分钟）
3. 和 webpack 对比（启动、HMR、生产构建）+ 为什么生产用 Rollup（1.5 分钟）

录完后自查：

- 是否说出 Vite 冷启动快的根因是不打包源码。
- 是否说出预构建解决的两个问题。
- 是否说出 HMR 的模块级更新 vs webpack 的 chunk 级。
- 是否说出生产用 Rollup 的原因。

## 复盘

今天最需要回补的 3 个点：

1. Vite 插件 API 和 Rollup 插件 API 的兼容性和差异（`configureServer` 等 Vite 独有钩子）。
2. `optimizeDeps` 配置的使用场景（手动指定需要预构建的依赖）。
3. Vite 的 SSR 支持和 `vite-node` 的原理。
