# Day 18 webpack 核心概念

## 今日目标

- 看完 webpack Concepts / Code Splitting / Caching
- 画一张 webpack 构建链路图（entry → loader → module graph → chunk → asset）
- 写一个最小 webpack 配置能跑起来

## 按顺序阅读

1. [webpack](../advanced/week1/webpack)
2. [构建工具](../advanced/week1/build-tools)
3. [webpack vs Vite](../engineering/webpack-vs-vite)

## 实操与自测

**检查点**

- loader 处理**单个文件**的内容转换，plugin 作用于**整个构建生命周期**
- `SplitChunksPlugin` 的默认策略和手动配置要能说出区别
- 长效缓存的关键是 `contenthash` + 分离 runtime + 稳定模块 id

**先独立完成，再对照专题**

- webpack 5 大核心概念 — [参考章节](../advanced/week1/webpack#day-18-webpack-5-大核心概念)
- Loader 执行顺序 — [参考章节](../advanced/week1/webpack#day-18-loader-执行顺序)
- Plugin 生命周期 — [参考章节](../advanced/week1/webpack#day-18-plugin-生命周期)
- Chunk 类型 — [参考章节](../advanced/week1/webpack#day-18-chunk-类型)
- SplitChunksPlugin 默认策略 — [参考章节](../advanced/week1/webpack#day-18-splitchunksplugin-默认策略)
- 长效缓存策略 — [参考章节](../advanced/week1/webpack#day-18-长效缓存策略)
- webpack 构建链路 — [参考章节](../advanced/week1/webpack#day-18-webpack-构建链路)
- 最小 webpack 配置 — [参考章节](../advanced/week1/webpack#day-18-最小-webpack-配置)

**脱稿口述题**

- 1. loader 和 plugin 的本质区别？
- 2. 怎么设计能长效缓存的 chunk 策略？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 五大核心概念（Entry / Output / Loader / Plugin / Mode）（2 分钟）
2. 代码分割（SplitChunks）+ 长效缓存四步策略（2 分钟）
3. Loader 执行顺序（右到左）+ Plugin 生命周期钩子（1 分钟）

录完后自查：

- 是否说出 Loader 是文件级转换、Plugin 是构建级扩展。
- 是否说出 Loader 从右到左执行。
- 是否说出 contenthash + runtimeChunk + deterministic moduleIds。
- 是否说出 SplitChunksPlugin 的 cacheGroups 概念。

## 复盘

今天最需要回补的 3 个点：

1. webpack 的 Module Federation（模块联邦）在微前端中的应用。
2. `resolve.alias` 和 `externals` 的使用场景差异。
3. webpack 5 的持久缓存（`cache: { type: 'filesystem' }`）原理。
