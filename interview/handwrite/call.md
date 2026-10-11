# Function.prototype.call 原理

```javascript
// 手写实现call
// eslint-disable-next-line no-extend-native
Function.prototype.selfCall = function (context, ...arg) {
  const func = this
  context = context || window || globalThis
  if (typeof func !== 'function')
    throw new TypeError('this is not a function')
  const caller = Symbol('caller') // 防止重名
  context[caller] = func
  const res = context[caller](...arg)
  delete context[caller]
  return res
}
// 原理就是将函数作为传入的上下文参数（context）的属性执行，这里为了防止属性冲突使用了 ES6 的 Symbol 类型

const User = {
  count: 1,
  getCount() {
    return this.count
  },
}

console.log(User.getCount.selfCall(User))
```

## 每日练习参考

### Day 11：4 题步骤对比

| 题目 | 核心步骤 | 关键边界 |
|------|----------|----------|
| `call` | 把函数挂到目标对象上调用 | `thisArg == null` 用 `globalThis`；用 `Symbol` 防属性冲突 |
| `bind` | 返回新函数，预置参数 | 遇 `new` 调用时忽略绑定对象（`this instanceof` 判断）|
| `new` | 创对象 → 接原型 → 执行构造 → 返回 | 构造函数返回对象则用返回值，否则用新实例 |
| `instanceof` | 遍历 `__proto__` 找 `prototype` | 处理 `null` 终止；基本类型直接返回 `false` |

### Day 11：手写答题顺序

```text
1. 先讲思路（一句话说清核心原理）
2. 落代码（边写边解释每一步）
3. 补边界（null 处理、Symbol 防冲突、new 兼容等）
```

### Day 11：myCall

```js
Function.prototype.myCall = function (thisArg, ...args) {
  const context = thisArg == null ? globalThis : Object(thisArg)
  const fnKey = Symbol('fn')
  context[fnKey] = this
  const result = context[fnKey](...args)
  delete context[fnKey]
  return result
}
```

## Day 7 practice code

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
