---
title: Week 1 按小时执行清单
description: 第 1 周构建链路专项的按小时执行计划
---

# Week 1 按小时执行清单

## 本周目标

用一周时间把“构建工具”从提纲式记忆升级成可以稳定回答追问的工程链路。周末验收时，你需要能完整讲清：

- 为什么 Vite 开发阶段通常更快
- webpack 的 loader、plugin、chunk 分别在解决什么问题
- tree-shaking 为什么依赖 ESM
- Babel、bundler、runtime、polyfill 的边界在哪里
- 生产构建中的拆包、缓存、source map 应该怎样设计

## 规则

- 每个学习块结束后，立即输出 3-5 句自己的总结
- 每天最后 15 分钟必须写当天复盘
- 不允许只看文档不留产出
- 所有新内容优先回填到仓库中的 Markdown 文件

## Day 1

### 总时长

`2 小时`

### 00:00-00:20

通读 [build-tools.md](../engineering/week1-build-tools) 和 [modules.md](../jscore/advanced/week1-modules)，把你已经会说的点与说不深的点分开。

### 00:20-00:50

阅读 Vite 官方概览与 Why Vite：

- https://vite.dev/guide/
- https://vite.dev/guide/why.html

输出 1 段总结：`Vite 解决了什么问题，它快在什么地方`

### 00:50-01:20

阅读 webpack Concepts：

- https://webpack.js.org/concepts/

输出 1 段总结：`webpack 的核心抽象到底是什么`

### 01:20-01:45

自己手写一张总链路图，最少包含这些节点：

- `ESM / CJS`
- `Babel`
- `dev server`
- `dependency graph`
- `bundle / chunk`
- `cache / deploy artifact`

### 01:45-02:00

写当天复盘，回答两个问题：

- 今天最容易混淆的 2 个概念是什么
- 如果被问“Vite 和 webpack 的差异”，你现在会卡在哪

## Day 2

### 总时长

`2 小时`

### 00:00-00:25

阅读 MDN 模块文档：

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export

写 1 份 `ESM vs CommonJS` 对照表。

### 00:25-00:55

阅读 Babel 文档：

- https://babeljs.io/docs/config-files
- https://babeljs.io/docs/babel-preset-env

输出 1 段总结：`Babel 负责什么，不负责什么`

### 00:55-01:25

阅读动态导入与 `import.meta`：

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta

同时整理自己的答案：

- 为什么 tree-shaking 依赖 ESM
- 为什么动态 `import()` 会形成拆包入口

### 01:25-01:45

补写到 [modules.md](../jscore/advanced/week1-modules) 的提纲草稿，至少列出 5 个小节标题。

### 01:45-02:00

复盘口述 5 分钟，题目：`Babel、模块系统、tree-shaking 的关系`

## Day 3

### 总时长

`2 小时`

### 00:00-00:25

阅读 Vite Features：

- https://vite.dev/guide/features.html

列出 Vite 在开发态的核心能力点。

### 00:25-00:55

阅读依赖预构建：

- https://vite.dev/guide/dep-pre-bundling

重点记录：

- 为什么需要 pre-bundling
- 为什么和 CommonJS 兼容有关
- 为什么和浏览器请求数量有关

### 00:55-01:20

阅读环境变量：

- https://vite.dev/guide/env-and-mode

写 1 段总结：`import.meta.env` 的边界和常见误区

### 01:20-01:45

整理 “为什么 Vite 快” 的标准答案，限制在 `180-250 字`，要求必须包含：

- native ESM
- 按需请求
- 依赖预构建
- HMR

### 01:45-02:00

当天复盘，检查自己的答案里有没有停留在“更快”而没解释“为什么更快”。

## Day 4

### 总时长

`2 小时`

### 00:00-00:25

阅读 webpack Getting Started 与 Concepts：

- https://webpack.js.org/guides/getting-started/
- https://webpack.js.org/concepts/

### 00:25-00:50

单独拆解 webpack 的四个核心词：

- entry
- dependency graph
- loader
- plugin

每个词用 2 句话解释，不要抄官方原句。

### 00:50-01:20

整理 “webpack 本质在做什么” 的标准答案，要求包含：

- 从入口构建依赖图
- 把非 JS 资源也纳入构建流程
- 通过插件扩展构建生命周期

### 01:20-01:45

写 1 份 `Vite dev vs webpack dev` 对照表，至少覆盖：

- 模块处理方式
- 首次启动
- 页面请求路径
- HMR 粒度
- 生产构建依赖

### 01:45-02:00

当天复盘，回答：`为什么不能只用“Vite 比 webpack 新”来解释差异`

## Day 5

### 总时长

`2 小时`

### 00:00-00:25

阅读 Vite Build：

- https://vite.dev/guide/build

记录 Vite 生产构建依赖的打包器、产物和可配置点。

### 00:25-00:55

阅读 webpack Code Splitting：

- https://webpack.js.org/guides/code-splitting/

写 1 段总结：`为什么动态 import 是拆包的天然入口`

### 00:55-01:20

阅读 webpack Caching：

- https://webpack.js.org/guides/caching/

重点整理：

- `contenthash`
- runtime chunk
- vendor chunk

### 01:20-01:45

写 8 个生产构建追问题目，建议包含：

- 为什么要拆 vendor
- 为什么缓存会失效
- source map 为什么要谨慎处理
- 为什么有时 tree-shaking 不生效

### 01:45-02:00

当天复盘，检查是否已经能把“拆包”和“缓存”放到同一条链路里解释。

## Day 6

### 总时长

`2 小时`

### 00:00-00:30

重新审视 [build-tools.md](../engineering/week1-build-tools) 的问题，列出必须重写的部分。

### 00:30-01:20

重写文档结构，建议固定为这 5 段：

1. 构建链路总览
2. Vite 开发态原理
3. webpack 构建核心
4. 生产优化与缓存策略
5. 高频追问

### 01:20-01:45

同步补 [modules.md](../jscore/advanced/week1-modules) 中和 ESM、tree-shaking 有关的部分。

### 01:45-02:00

当天复盘，记下你还讲不顺的 3 个点，留给 Day 7 模拟面试。

## Day 7

### 总时长

`1.5-2 小时`

### 00:00-00:20

快速回看本周所有自己的总结和问题清单。

### 00:20-01:10

做一轮模拟面试，至少回答下面 8 题：

1. 为什么 Vite 开发阶段通常比 webpack 快
2. Vite 的开发阶段和构建阶段分别在做什么
3. webpack 的 loader 和 plugin 边界是什么
4. tree-shaking 为什么依赖 ESM
5. Babel 和 bundler 的职责为什么不能混为一谈
6. 动态 `import()` 为什么常常意味着拆包
7. `contenthash`、runtime chunk、vendor chunk 分别解决什么问题
8. source map 为什么在生产环境既重要又敏感

### 01:10-01:30

复盘模拟面试，把每道题的问题归类成以下三类之一：

- 概念不清
- 链路不完整
- 缺工程例子

### 01:30-02:00

输出本周总结，至少包含：

- 我现在能稳定讲清的 3 条链路
- 我下周要继续补的 3 个点
- 哪些内容已经回填到了仓库

## 本周验收标准

达到以下标准，才算 Week 1 完成：

- 你可以用自己的话解释 Vite 的依赖预构建
- 你能解释为什么 ESM 更适合 tree-shaking
- 你能把 Babel、webpack、Vite 放在同一条工程链路里说明职责
- 你已经把核心内容沉淀回仓库，而不是只停在笔记软件里
