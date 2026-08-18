# Day 2 闭包 / 作用域 / ES6 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 2 | 闭包 / 作用域 / ES6 | [作用域闭包](../jscore/basic/scope-closure)、[闭包进阶](../jscore/advanced/closure)、[ES6](../jscore/basic/es6) |

## 今日目标

- 看完 `/jscore/basic/scope-closure`、`/jscore/basic/es6`
- 输出一页《闭包与作用域》提纲：3 个应用场景 + 2 个泄漏风险场景
- 准备 2 道口述题，完成一次 5 分钟录音

## 阅读卡点

- 闭包不是“函数内部函数”，而是“函数 + 它访问到的外层变量环境”
- `let / const` 的 TDZ 要结合实际工程问题讲，不要只背定义
- 变量提升要区分 `var` 声明提升、`function` 声明整体提升、`let/const` 的暂时性死区
- ES Module 是“值的引用 (live binding)”，CommonJS 是“值的拷贝”，循环依赖时表现完全不同
- 箭头函数没有 `this / arguments / prototype`，不能 `new`，本质就是闭包语义的语法糖

## 速记卡 / 知识点

### 作用域与作用域链

JavaScript 是**词法作用域**（静态作用域），作用域在函数定义时就确定了，与调用位置无关。

三类作用域：

- 全局作用域：贯穿整个程序生命周期。
- 函数作用域：`function` 创建，外部不可见。
- 块级作用域：`let / const / class` 在 `{}` 内创建。

作用域链查找：

```text
当前作用域
  -> 外层函数作用域
  -> ...
  -> 全局作用域
  -> 找不到则 ReferenceError
```

### 变量声明对比

| 维度 | `var` | `let` | `const` |
|------|-------|-------|---------|
| 作用域 | 函数 | 块 | 块 |
| 提升 | 提升并初始化为 `undefined` | 提升但有 TDZ | 提升但有 TDZ |
| 重复声明 | 允许 | 不允许 | 不允许 |
| 重新赋值 | 允许 | 允许 | 引用不可变 |
| 全局声明挂到 `window` | 是 | 否 | 否 |

### 闭包

定义：**闭包 = 函数 + 它定义时能访问的外层变量环境**。

产生原因：词法作用域 + 内部函数被外部长期引用，导致外层变量无法被 GC 回收。

常见应用：

- 数据私有化（模块模式）。
- 柯里化、偏函数。
- 防抖、节流、缓存（memoize）。
- 循环中保留每轮的索引。

泄漏风险：

- 闭包持有 DOM 引用 + 监听器未解绑。
- `setTimeout / setInterval` 长期持有大对象。
- 循环引用没有手动 `= null`。

### 执行上下文（简化版）

- 创建阶段：确定 `this`、创建变量环境（VariableEnvironment）和词法环境（LexicalEnvironment）。
- 执行阶段：逐行执行、赋值。
- 调用栈：函数调用入栈，返回出栈。

### ES6 必背要点

- `let / const` + 块级作用域 + TDZ。
- 箭头函数：无独立 `this / arguments / prototype`，不能 `new`。
- 解构赋值 + 默认值。
- `Promise`：状态不可逆 `pending -> fulfilled / rejected`。
- `class`：原型继承的语法糖，方法默认在 `prototype` 上、不可枚举。
- ES Module：静态分析、值引用、`import` 提升、默认严格模式。
- `Set / Map / WeakMap / WeakSet`：去重、键不限类型、弱引用避免泄漏。

### ESM vs CommonJS

| 维度 | CommonJS | ES Module |
|------|----------|-----------|
| 加载时机 | 运行时 | 编译时静态分析 |
| 导出 | 值的拷贝 | 值的引用（live binding） |
| 顶层 `this` | `module.exports` | `undefined` |
| 异步 | 同步 | 支持顶层 `await` |
| Tree-shaking | 不友好 | 友好 |

## 手写 / 流程图

### 闭包计数器（经典闭包）

```js
function createCounter() {
  let count = 0
  return {
    inc: () => ++count,
    dec: () => --count,
    get: () => count,
  }
}

const counter = createCounter()
counter.inc()
counter.inc()
counter.get() // 2
```

### 循环 + 闭包陷阱与三种解法

```js
// 问题：var 没有块级作用域，3 个回调共享同一个 i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0) // 3 3 3
}

// 解法1：let（每轮新建块作用域）
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0) // 0 1 2
}

// 解法2：IIFE 显式建立闭包
for (var i = 0; i < 3; i++) {
  ;(function (j) {
    setTimeout(() => console.log(j), 0)
  })(i)
}
```

### 闭包导致的内存泄漏流程图

```text
createLeak() 执行
  -> 创建大对象 bigData (10MB)
  -> 返回内部函数 fn
  -> 外部 fn = createLeak()

createLeak 执行结束
  -> 但 fn 仍然引用闭包作用域
  -> 闭包作用域引用 bigData
  -> GC 无法回收 bigData

解除：fn = null
  -> 闭包失去引用
  -> bigData 可被回收
```

### 简化版防抖（闭包应用）

```js
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
```

## 口述题

### 1. 闭包是什么？为什么能访问外层变量？

回答模板：

> 闭包是一个函数加上它定义时能访问到的外层变量环境的组合。它能访问外层变量，本质是因为 JavaScript 是词法作用域，函数的作用域在定义时就确定了。
>
> 当一个内部函数被外部长期引用，比如作为返回值返回，或者挂到回调、定时器上，外层函数虽然执行结束，但它的变量环境因为还被内部函数引用，所以不会被 GC 回收，这就形成了闭包。
>
> 闭包的常见应用有数据私有化、柯里化、防抖节流、缓存等。代价是变量常驻内存，所以要强调一点：闭包不等于内存泄漏，只有当这些变量已经不再需要、却仍因闭包持有而无法回收时，才算泄漏，常见场景比如未解绑的 DOM 监听器和长期 `setInterval`。

### 2. `let / const / var` 差别如何讲得像工程问题？

回答模板：

> 三者主要差别在作用域、提升和重复声明。`var` 是函数作用域，会被提升并初始化为 `undefined`，允许重复声明，全局声明还会挂到 `window`，容易污染全局。`let` 和 `const` 是块级作用域，虽然也提升，但有暂时性死区，在声明执行前访问会直接报错；`const` 还要求声明时初始化，且引用地址不可变。
>
> 工程上的实际影响有几个：第一，`for` 循环里用 `var` 声明计数器，循环结束后变量仍能被访问，加上闭包就会出现“最后只输出最后一个值”的经典 bug，用 `let` 就天然每轮一个块作用域；第二，`var` 会污染全局 `window`，多脚本协作时容易冲突；第三，`const` 能强约束“引用不变”，让代码意图更清晰，配合 ESLint 的 `prefer-const` 还能强制团队风格统一。
>
> 我自己的工程默认是：默认 `const`，需要重新赋值才用 `let`，禁用 `var`。

### 3. ES Module 和 CommonJS 有什么区别？（备用）

回答模板：

> 主要差别在加载时机、导出语义和静态性。CommonJS 是运行时同步加载，导出的是值的拷贝，所以模块内部后续修改外部看不到。ES Module 是编译时静态分析，导入的是值的引用（live binding），模块内部更新，外部能感知到。
>
> 静态分析这点很关键，它让 ESM 支持 tree-shaking，构建工具可以在打包时把没用到的导出删掉，体积更小。另外 ESM 顶层 `this` 是 `undefined`、默认严格模式、支持顶层 `await`，这些都是 CommonJS 没有的。
>
> 循环依赖时差别也明显：CJS 拿到的是“当时已经导出的部分”，ESM 因为是引用，能在后续访问到完整值。所以现代工程默认用 ESM，仅在需要 Node 旧生态兼容时才用 CJS。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 闭包定义 + 词法作用域 + 执行上下文（2 分钟）。
2. 3 个应用场景：模块私有化、柯里化、防抖节流（2 分钟）。
3. 闭包泄漏风险 + `let / const / var` 工程差异（1 分钟）。

录完后自查：

- 是否说出“闭包 = 函数 + 外层变量环境”。
- 是否说出 TDZ 和 `var` 提升的区别。
- 是否说出 `for + var` 经典 bug 和 `let` 解法。
- 是否说出闭包不等于内存泄漏。

## 今日复盘

今天最需要回补的 3 个点：

1. 词法作用域 vs 动态作用域的本质区别，以及它如何决定闭包行为。
2. `let` 在 `for` 循环中每轮新建块作用域的底层实现（编译期会生成多个 `LexicalEnvironment`）。
3. ESM 的 live binding 在循环依赖场景下的表现，需要画图再讲一遍。
