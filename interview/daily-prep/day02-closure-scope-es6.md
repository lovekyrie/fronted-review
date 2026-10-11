# Day 2 闭包 / 作用域 / ES6

## 今日目标

- 看完 `/jscore/basic/scope-closure`、`/jscore/basic/es6`
- 输出一页《闭包与作用域》提纲：3 个应用场景 + 2 个泄漏风险场景
- 准备 2 道口述题，完成一次 5 分钟录音

## 按顺序阅读

1. [作用域闭包](../jscore/basic/scope-closure)
2. [闭包进阶](../jscore/advanced/closure)
3. [ES6](../jscore/basic/es6)

## 实操与自测

**检查点**

- 闭包不是“函数内部函数”，而是“函数 + 它访问到的外层变量环境”
- `let / const` 的 TDZ 要结合实际工程问题讲，不要只背定义
- 变量提升要区分 `var` 声明提升、`function` 声明整体提升、`let/const` 的暂时性死区
- ES Module 是“值的引用 (live binding)”，CommonJS 是“值的拷贝”，循环依赖时表现完全不同
- 箭头函数没有 `this / arguments / prototype`，不能 `new`，本质就是闭包语义的语法糖

**先独立完成，再对照专题**

- 作用域与作用域链 — [参考章节](../jscore/basic/scope-closure#day-2-作用域与作用域链)
- 变量声明对比 — [参考章节](../jscore/basic/scope-closure#day-2-变量声明对比)
- 闭包 — [参考章节](../jscore/basic/scope-closure#day-2-闭包)
- 执行上下文（简化版） — [参考章节](../jscore/basic/scope-closure#day-2-执行上下文-简化版)
- ES6 必背要点 — [参考章节](../jscore/basic/es6#day-2-es6-必背要点)
- ESM vs CommonJS — [参考章节](../jscore/basic/es6#day-2-esm-vs-commonjs)
- 闭包计数器（经典闭包） — [参考章节](../jscore/basic/scope-closure#day-2-闭包计数器-经典闭包)
- 循环 + 闭包陷阱与三种解法 — [参考章节](../jscore/basic/scope-closure#day-2-循环-闭包陷阱与三种解法)
- 闭包导致的内存泄漏流程图 — [参考章节](../jscore/basic/scope-closure#day-2-闭包导致的内存泄漏流程图)
- 简化版防抖（闭包应用） — [参考章节](../jscore/basic/scope-closure#day-2-简化版防抖-闭包应用)

**脱稿口述题**

- 1. 闭包是什么？为什么能访问外层变量？
- 2. `let / const / var` 差别如何讲得像工程问题？
- 3. ES Module 和 CommonJS 有什么区别？（备用）

**录音练习**

按这个顺序录，不要临场重新组织：

1. 闭包定义 + 词法作用域 + 执行上下文（2 分钟）。
2. 3 个应用场景：模块私有化、柯里化、防抖节流（2 分钟）。
3. 闭包泄漏风险 + `let / const / var` 工程差异（1 分钟）。

录完后自查：

- 是否说出“闭包 = 函数 + 外层变量环境”。
- 是否说出 TDZ 和 `var` 提升的区别。
- 是否说出 `for + var` 经典 bug 和 `let` 解法。
- 是否说出闭包不等于内存泄漏。

## 复盘

今天最需要回补的 3 个点：

1. 词法作用域 vs 动态作用域的本质区别，以及它如何决定闭包行为。
2. `let` 在 `for` 循环中每轮新建块作用域的底层实现（编译期会生成多个 `LexicalEnvironment`）。
3. ESM 的 live binding 在循环依赖场景下的表现，需要画图再讲一遍。
