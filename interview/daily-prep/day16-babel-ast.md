# Day 16 Babel：AST / preset / plugin

## 今日目标

- 看完 Babel 配置文档、Babel Parser
- 输出 Babel 三阶段流程图：parse → transform → generate
- 用一个真实的 preset-env 转换案例做 AST 解读

## 按顺序阅读

1. [构建工具](../advanced/week1/build-tools)
2. [webpack vs Vite](../engineering/webpack-vs-vite)

## 实操与自测

**检查点**

- `preset-env` + `core-js` 的组合只负责**语法降级**和**polyfill 注入**，两者职责不同
- Babel 不负责打包，只负责**单文件的语法改写**
- `@babel/runtime` 和 `@babel/plugin-transform-runtime` 解决重复注入辅助代码的问题

**先独立完成，再对照专题**

- Babel 三阶段 — [参考章节](../advanced/week1/build-tools#day-16-babel-三阶段)
- AST 核心节点 — [参考章节](../advanced/week1/build-tools#day-16-ast-核心节点)
- preset vs plugin — [参考章节](../advanced/week1/build-tools#day-16-preset-vs-plugin)
- preset-env 的三个关键配置 — [参考章节](../advanced/week1/build-tools#day-16-preset-env-的三个关键配置)
- preset-env vs core-js 职责 — [参考章节](../advanced/week1/build-tools#day-16-preset-env-vs-core-js-职责)
- @babel/plugin-transform-runtime — [参考章节](../advanced/week1/build-tools#day-16-babel-plugin-transform-runtime)
- Babel 完整流程 — [参考章节](../advanced/week1/build-tools#day-16-babel-完整流程)
- 简单 Babel 插件示例 — [参考章节](../advanced/week1/build-tools#day-16-简单-babel-插件示例)

**脱稿口述题**

- 1. `preset-env` 到底做了什么？和 `core-js` 什么关系？
- 2. 为什么要用 `@babel/plugin-transform-runtime`？

**录音练习**

按这个顺序录，不要临场重新组织：

1. Babel 三阶段（parse → transform → generate）+ AST 概念（1.5 分钟）
2. preset-env 三个关键配置 + 与 core-js 的职责分工（2 分钟）
3. transform-runtime 解决的问题 + Babel 和 bundler 的职责分界（1.5 分钟）

录完后自查：

- 是否说出 Babel 只做单文件语法改写，不负责打包。
- 是否说出 preset-env 管语法、core-js 管 API。
- 是否说出 `useBuiltIns: "usage"` 的按需注入机制。
- 是否说出 transform-runtime 解决辅助函数重复的问题。

## 复盘

今天最需要回补的 3 个点：

1. AST Explorer 实际操作，能快速定位节点类型。
2. plugin 和 preset 的执行顺序规则（plugin 左到右，preset 右到左）。
3. `useBuiltIns: "entry"` vs `"usage"` 的包体积差异和适用场景。
