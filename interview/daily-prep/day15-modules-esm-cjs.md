# Day 15 ESM vs CommonJS vs UMD 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 15 | 模块化 | [模块化](../advanced/week1/modules)、[webpack vs Vite](../engineering/webpack-vs-vite) |

## 今日目标

- 看完 `/advanced/week1/modules`、MDN Modules
- 输出模块规范对照表：导入导出语法 / 加载时机 / 循环依赖行为 / 打包产物差异
- 能讲清“Node 环境里为什么 require 和 import 行为不同”

## 阅读卡点

- ESM 是**静态分析**，CJS 是**动态执行**；这是 tree-shaking 能否生效的根本原因
- ESM 的“值是绑定”，CJS 的“值是拷贝”，在循环依赖时表现不同
- Node 16+ 的 `.mjs` / `"type": "module"` 带来的 interop 问题

## 速记卡 / 知识点

### 模块规范对照表

| 维度 | ESM | CommonJS | UMD |
|------|-----|----------|-----|
| 语法 | `import / export` | `require / module.exports` | IIFE 包裹 |
| 加载时机 | 编译时静态分析 | 运行时动态执行 | 运行时 |
| 值绑定 | live binding（引用） | 值拷贝 | 取决于内部实现 |
| 循环依赖 | 能拿到最新值 | 拿到的是执行到那一刻的快照 | — |
| tree-shaking | ✅ 支持 | ❌ 不支持 | ❌ |
| 浏览器原生 | ✅ `<script type="module">` | ❌ 需要打包 | ❌ 需要打包 |

### ESM 核心特性

- **静态结构**：`import / export` 必须在顶层，不能放在 if 里。这让打包工具能在编译时分析依赖图。
- **live binding**：导入的是绑定（引用），导出模块修改值后，导入方能看到最新值。
- **严格模式**：ESM 默认严格模式，不需要 `"use strict"`。
- **异步加载**：`import()` 动态导入返回 Promise。

### CJS 核心特性

- **动态执行**：`require()` 可以出现在任何地方，支持条件导入。
- **值拷贝**：`module.exports` 导出的是值的拷贝，导出后修改不影响导入方。
- **同步加载**：适合 Node.js 服务端，不适合浏览器。
- **缓存机制**：`require` 第一次执行后缓存结果，后续直接返回缓存。

### Node.js 中的 interop

- `.mjs` 文件强制 ESM，`.cjs` 文件强制 CJS。
- `package.json` 中 `"type": "module"` 让 `.js` 默认走 ESM。
- ESM 可以 `import` CJS 模块（取 `module.exports` 作为默认导出）。
- CJS 不能直接 `require` ESM 模块（需要用 `import()` 动态导入）。

## 手写 / 流程图

### ESM live binding 演示

```js
// counter.mjs
export let count = 0
export function increment() { count++ }

// main.mjs
import { count, increment } from './counter.mjs'
console.log(count)   // 0
increment()
console.log(count)   // 1  ← live binding，能看到最新值

// 如果是 CJS，第二次 console.log 仍然是 0（值拷贝）
```

### 循环依赖行为对比

```js
// === CJS 循环依赖 ===
// a.js
exports.loaded = false
const b = require('./b.js')  // 执行 b.js
console.log('b.loaded:', b.loaded)  // true
exports.loaded = true

// b.js
const a = require('./a.js')  // 拿到 a 的部分导出（loaded = false）
console.log('a.loaded:', a.loaded)  // false ← 值拷贝快照
exports.loaded = true

// === ESM 循环依赖 ===
// a.mjs
import { loaded as bLoaded } from './b.mjs'
export let loaded = false
console.log('b.loaded:', bLoaded)  // true（live binding）
loaded = true
```

## 口述题

### 1. 为什么 ESM 能做 tree-shaking 而 CJS 不行？

回答模板：

> tree-shaking 的前提是打包工具能在编译时确定哪些导出没被使用。ESM 的 `import / export` 是静态语法，必须写在顶层，打包工具可以在不执行代码的情况下分析出完整的依赖图和导出使用情况，进而删除未使用的导出。
>
> CJS 的 `require()` 是运行时函数调用，可以出现在 if、循环甚至变量拼接里（如 `require('./' + name)`），打包工具无法在编译时确定到底会加载什么，所以无法安全地移除代码。

### 2. ESM 和 CJS 循环依赖的行为差别是什么？

回答模板：

> CJS 循环依赖时，`require` 返回的是**当前已执行部分的快照**（值拷贝）。如果 A require B，B 又 require A，B 拿到的 A 只有 require 之前已赋值的属性，后续 A 的修改 B 看不到。
>
> ESM 循环依赖时，`import` 拿到的是 **live binding**（引用绑定）。虽然在 A 的 `export` 语句执行前变量处于 TDZ（暂时性死区），但一旦赋值，B 就能看到最新值。所以 ESM 对循环依赖的支持更好，但要注意 TDZ 报错的风险。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 模块规范演进（全局 → IIFE → AMD → CJS → ESM）（1 分钟）
2. ESM vs CJS 核心差异（静态/动态、live binding/值拷贝、tree-shaking）（2 分钟）
3. Node.js interop + 循环依赖行为差异（2 分钟）

录完后自查：

- 是否说出 ESM 是静态分析、CJS 是运行时执行。
- 是否说出 live binding 和值拷贝的区别。
- 是否说出 tree-shaking 需要静态结构的原因。
- 是否说出 Node.js 中 `.mjs` / `"type": "module"` 的作用。

## 今日复盘

今天最需要回补的 3 个点：

1. `import.meta` 的用途（`import.meta.url`、`import.meta.env`）。
2. `export default` 和 `export` 的区别在打包时的表现。
3. 动态 `import()` 的代码分割原理和加载策略。
