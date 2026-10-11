# Day 15 ESM vs CommonJS vs UMD

## 今日目标

- 看完 `/advanced/week1/modules`、MDN Modules
- 输出模块规范对照表：导入导出语法 / 加载时机 / 循环依赖行为 / 打包产物差异
- 能讲清“Node 环境里为什么 require 和 import 行为不同”

## 按顺序阅读

1. [模块化](../advanced/week1/modules)
2. [webpack vs Vite](../engineering/webpack-vs-vite)

## 实操与自测

**检查点**

- ESM 是**静态分析**，CJS 是**动态执行**；这是 tree-shaking 能否生效的根本原因
- ESM 的“值是绑定”，CJS 的“值是拷贝”，在循环依赖时表现不同
- Node 16+ 的 `.mjs` / `"type": "module"` 带来的 interop 问题

**先独立完成，再对照专题**

- 模块规范对照表 — [参考章节](../advanced/week1/modules#day-15-模块规范对照表)
- ESM 核心特性 — [参考章节](../advanced/week1/modules#day-15-esm-核心特性)
- CJS 核心特性 — [参考章节](../advanced/week1/modules#day-15-cjs-核心特性)
- Node.js 中的 interop — [参考章节](../advanced/week1/modules#day-15-node-js-中的-interop)
- ESM live binding 演示 — [参考章节](../advanced/week1/modules#day-15-esm-live-binding-演示)
- 循环依赖行为对比 — [参考章节](../advanced/week1/modules#day-15-循环依赖行为对比)

**脱稿口述题**

- 1. 为什么 ESM 能做 tree-shaking 而 CJS 不行？
- 2. ESM 和 CJS 循环依赖的行为差别是什么？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 模块规范演进（全局 → IIFE → AMD → CJS → ESM）（1 分钟）
2. ESM vs CJS 核心差异（静态/动态、live binding/值拷贝、tree-shaking）（2 分钟）
3. Node.js interop + 循环依赖行为差异（2 分钟）

录完后自查：

- 是否说出 ESM 是静态分析、CJS 是运行时执行。
- 是否说出 live binding 和值拷贝的区别。
- 是否说出 tree-shaking 需要静态结构的原因。
- 是否说出 Node.js 中 `.mjs` / `"type": "module"` 的作用。

## 复盘

今天最需要回补的 3 个点：

1. `import.meta` 的用途（`import.meta.url`、`import.meta.env`）。
2. `export default` 和 `export` 的区别在打包时的表现。
3. 动态 `import()` 的代码分割原理和加载策略。
