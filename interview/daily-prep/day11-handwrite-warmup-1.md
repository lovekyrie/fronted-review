# Day 11 手写保温 1（call / bind / new / instanceof） 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 11 | 手写 1（call/bind/new/instanceof） | [call](../handwrite/call)、[bind](../handwrite/bind)、[new](../handwrite/new)、[instanceof](../handwrite/instanceof) |

## 今日目标

- 看完 `/handwrite/call`、`bind`、`new`、`instanceof`
- 输出 4 道手写题的「步骤模板」
- 输出一页《手写题答题顺序》：先讲思路 → 再落代码 → 最后补边界

## 阅读卡点

- `call` 的本质是“把函数挂到对象上调用”，注意用 `Symbol` 防冲突
- `bind` 遇到 `new` 调用要忽略绑定对象，`this instanceof boundFn` 判断
- `new` 四步：创对象 → 接原型 → 执行构造 → 返回对象/新实例
- `instanceof` 本质是遍历 `__proto__` 找 `prototype`

## 速记卡 / 知识点

### 4 题步骤对比

| 题目 | 核心步骤 | 关键边界 |
|------|----------|----------|
| `call` | 把函数挂到目标对象上调用 | `thisArg == null` 用 `globalThis`；用 `Symbol` 防属性冲突 |
| `bind` | 返回新函数，预置参数 | 遇 `new` 调用时忽略绑定对象（`this instanceof` 判断）|
| `new` | 创对象 → 接原型 → 执行构造 → 返回 | 构造函数返回对象则用返回值，否则用新实例 |
| `instanceof` | 遍历 `__proto__` 找 `prototype` | 处理 `null` 终止；基本类型直接返回 `false` |

### 手写答题顺序

```text
1. 先讲思路（一句话说清核心原理）
2. 落代码（边写边解释每一步）
3. 补边界（null 处理、Symbol 防冲突、new 兼容等）
```

## 手写 / 流程图

### myCall

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

### myBind

```js
Function.prototype.myBind = function (thisArg, ...preset) {
  const originFn = this
  const boundFn = function (...args) {
    // new 调用时 this 是 boundFn 的实例，忽略绑定对象
    return originFn.apply(
      this instanceof boundFn ? this : thisArg,
      [...preset, ...args]
    )
  }
  // 继承原函数原型
  if (originFn.prototype) {
    boundFn.prototype = Object.create(originFn.prototype)
  }
  return boundFn
}
```

### myNew

```js
function myNew(Ctor, ...args) {
  // 1. 创建新对象，原型指向构造函数 prototype
  const obj = Object.create(Ctor.prototype)
  // 2. 执行构造函数，绑定 this
  const result = Ctor.apply(obj, args)
  // 3. 构造函数返回对象则用返回值，否则用新实例
  return result !== null && typeof result === 'object' ? result : obj
}
```

### myInstanceof

```js
function myInstanceof(obj, Ctor) {
  if (obj == null || typeof obj !== 'object' && typeof obj !== 'function') {
    return false
  }
  let proto = Object.getPrototypeOf(obj)
  while (proto !== null) {
    if (proto === Ctor.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}
```

## 口述题

### 1. `call / bind / new` 的本质分别是什么？

回答模板：

> `call` 的本质是"临时把函数挂到目标对象上调用"：通过 `context[Symbol] = fn` 让 this 隐式绑定到 context，调用后删除。`apply` 原理相同，只是参数用数组传。
>
> `bind` 的本质是"返回一个新函数，预置了 this 和部分参数"（柯里化思路）。关键边界是：当 bind 返回的函数被 `new` 调用时，要忽略绑定的 this，让 this 指向新实例。判断方法是 `this instanceof boundFn`。
>
> `new` 的本质是 4 步：创建空对象 → 把对象的 `__proto__` 指向构造函数的 `prototype` → 用这个对象做 this 执行构造函数 → 如果构造函数返回了一个对象就用它，否则返回新创建的实例。

### 2. `instanceof` 的底层判断逻辑是什么？

回答模板：

> `instanceof` 的本质是沿着对象的原型链（`__proto__`）向上遍历，看能不能找到构造函数的 `prototype`。找到就返回 `true`，遍历到 `null`（原型链顶端）就返回 `false`。
>
> 注意：基本类型（如 `'hello' instanceof String`）直接返回 `false`，因为基本类型没有原型链。`Symbol.hasInstance` 可以自定义 `instanceof` 行为。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. call 的核心（挂到对象上调用）+ bind 与 new 的兼容（2 分钟）
2. new 四步 + 返回值判断逻辑（1.5 分钟）
3. instanceof 原型链遍历 + 基本类型边界（1.5 分钟）

录完后自查：

- 是否说出 `Symbol` 防属性冲突。
- 是否说出 bind 遇 new 要忽略绑定对象。
- 是否说出 new 的"构造函数返回对象则用返回值"。
- 是否说出 instanceof 对基本类型直接返回 false。

## 今日复盘

今天最需要回补的 3 个点：

1. `bind` 返回的函数需要继承原函数的 `prototype`，否则 `new` 出来的实例原型链断裂。
2. `myNew` 中 `result` 判断需要排除 `null`（typeof null === 'object'）。
3. `Symbol.hasInstance` 自定义 instanceof 行为的用法和场景。
