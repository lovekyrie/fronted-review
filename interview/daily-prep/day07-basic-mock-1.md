# Day 7 基础第一次模拟面 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 7 | 基础模拟面 1 | [14 天冲刺](../sprint-14-days)、[高频 50 题](../high-frequency-50) |

## 今日目标

- 回看 Day 1–6 薄弱点
- 做一次 60 分钟自模拟（JS / 浏览器 / 网络）
- 输出 10 个“基础卡壳问题清单”，分类为 `不会 / 会但不熟 / 表达差`

## 阅读卡点

- 模拟面要严格限时，不允许回看文档
- 每题答完立刻打分：**流畅 / 卡顿 / 答错**，只记短语不写长句

## 速记卡 / 知识点

### 模拟题清单（Day 1–6 高频题，限时 60 分钟）

| # | 题目 | 考察点 | 自评 |
|---|------|--------|------|
| 1 | `typeof null` 为什么是 `"object"`？ | 数据类型 | |
| 2 | `this` 绑定优先级是什么？ | this 规则 | |
| 3 | `new` 一个构造函数的 4 个步骤？ | 原型链 | |
| 4 | 闭包是什么？什么场景会导致泄漏？ | 闭包 | |
| 5 | `let / const / var` 工程差异？ | 作用域 | |
| 6 | `for + var` 为什么输出全是最后一个值？ | 闭包+作用域 | |
| 7 | 事件循环执行顺序题（给代码判输出） | 异步 | |
| 8 | Promise 值穿透是什么？ | Promise | |
| 9 | `await` 后面的代码是同步还是异步？ | async/await | |
| 10 | V8 新生代/老生代 GC 策略？ | 内存管理 | |
| 11 | 强缓存和协商缓存怎么搭配？ | HTTP缓存 | |
| 12 | 预检请求什么时候触发？ | CORS | |

自评标准：✅ 流畅 / ⚠️ 卡顿 / ❌ 答错

## 手写 / 流程图

### 白板手写题参考

```js
// 题目 1：手写 call
Function.prototype.myCall = function (thisArg, ...args) {
  const context = thisArg == null ? globalThis : Object(thisArg)
  const fnKey = Symbol('fn')
  context[fnKey] = this
  const result = context[fnKey](...args)
  delete context[fnKey]
  return result
}

// 题目 2：手写防抖
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
```

## 口述题

### 1. 模拟题 A：this 绑定优先级

> 回答回顾参考：先讲四种绑定（默认 / 隐式 / 显式 / new），再讲优先级 `new > 显式 > 隐式 > 默认`，最后补充箭头函数没有自己的 this。

### 2. 模拟题 B：闭包与内存泄漏

> 回答回顾参考：先定义闭包（函数 + 外层变量环境），再讲 3 个应用场景（私有化、柯里化、防抖），最后讲泄漏（未解绑监听器、长期 setInterval），强调闭包 ≠ 泄漏。

## 5 分钟录音顺序

1. 挑最不熟的一题完整作答（2 分钟）
2. 按正确结构重新讲一次（2 分钟）
3. 标注两次差异，找出表达薄弱点（1 分钟）

## 今日复盘

卡壳问题 Top 3：

1. 事件循环执行顺序题容易遗漏 rAF 的位置。
2. `bind` 遇到 `new` 时忽略绑定对象的原因表述不清。
3. 缓存字段优先级容易搞混 ETag 和 Last-Modified 的对应关系。

分类汇总：

- 不会（需重学）：V8 增量标记细节
- 会但不熟（需再练）：事件循环输出题快速判断
- 表达差（需重组结构）：this 优先级讲述顺序
