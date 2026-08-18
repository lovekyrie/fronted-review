# Day 1 JS 基础执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 1 | 数据类型 / this / 原型链 | [数据类型](../jscore/basic/data-type)、[This 关键字](../jscore/basic/this)、[原型链](../jscore/basic/prototype) |

## 今日目标

- 看完 `数据类型 / this / 原型链` 三块基础。
- 输出一页《JS 基础速记卡》。
- 写出 `call / bind` 的手写步骤。
- 准备 3 道口述题，完成一次 5 分钟录音。

## 阅读卡点

- `data-type`：引用类型传参容易误说成“按引用传递”，准确说法是“按值传递，传的是引用地址的副本”。
- `this`：先判断是不是箭头函数，再判断调用方式；`new` 绑定优先级高于 `bind`。
- `prototype`：`prototype` 属于构造函数，`__proto__` 属于实例对象；属性查找沿 `__proto__` 继续向上。

## JS 基础速记卡

### 数据类型

JavaScript 有 7 种基本类型：

- `string`
- `number`
- `boolean`
- `null`
- `undefined`
- `symbol`
- `bigint`

引用类型统一属于对象体系，常见有：

- `Object`
- `Array`
- `Function`
- `Date`
- `RegExp`

判断方式：

- `typeof`：适合判断基本类型和函数，但 `typeof null === "object"` 是历史遗留问题。
- `instanceof`：判断构造函数的 `prototype` 是否出现在实例原型链上，不适合判断基本类型。
- `Object.prototype.toString.call(value)`：更适合做精确类型判断。

数组判断优先用：

```js
Array.isArray(value)
```

### this

`this` 的指向由调用方式决定，不由函数定义位置决定。

常见绑定规则：

1. 默认绑定：普通函数独立调用，非严格模式指向全局对象，严格模式为 `undefined`。
2. 隐式绑定：作为对象方法调用，`this` 指向调用它的对象。
3. 显式绑定：通过 `call / apply / bind` 指定 `this`。
4. `new` 绑定：构造函数调用时，`this` 指向新创建的实例。

优先级：

```text
new 绑定 > 显式绑定 > 隐式绑定 > 默认绑定
```

箭头函数没有自己的 `this`，它捕获定义时外层作用域的 `this`，不能通过 `call / apply / bind` 改变。

### 原型链

核心关系：

```js
instance.__proto__ === Constructor.prototype
Constructor.prototype.constructor === Constructor
```

属性查找过程：

```text
对象自身
  -> 对象.__proto__
  -> 构造函数.prototype
  -> Object.prototype
  -> null
```

`new` 的过程：

1. 创建一个新对象。
2. 将新对象的原型连接到构造函数的 `prototype`。
3. 用新对象作为 `this` 执行构造函数。
4. 如果构造函数返回对象，则返回该对象；否则返回新对象。

## call 手写步骤

本质：立即调用函数，并显式指定函数执行时的 `this`。

步骤：

1. 判断调用者必须是函数。
2. 处理 `thisArg`，为空时指向全局对象。
3. 用 `Symbol` 生成临时属性，避免覆盖原对象属性。
4. 把当前函数临时挂到 `thisArg` 上。
5. 通过 `thisArg[fn](...args)` 调用函数。
6. 删除临时属性。
7. 返回函数执行结果。

```js
Function.prototype.myCall = function (thisArg, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('caller must be a function')
  }

  const context = thisArg == null ? globalThis : Object(thisArg)
  const fnKey = Symbol('fn')

  context[fnKey] = this
  const result = context[fnKey](...args)
  delete context[fnKey]

  return result
}
```

## bind 手写步骤

本质：不立即调用函数，而是返回一个绑定好 `this` 和部分参数的新函数。

步骤：

1. 判断调用者必须是函数。
2. 保存原函数、绑定对象和预置参数。
3. 返回一个新函数。
4. 普通调用时，使用绑定对象作为 `this`。
5. `new` 调用时，忽略绑定对象，让 `this` 指向新实例。
6. 合并预置参数和调用参数。
7. 维护原型关系，保证 `new boundFn()` 时能访问原函数原型上的方法。

```js
Function.prototype.myBind = function (thisArg, ...presetArgs) {
  if (typeof this !== 'function') {
    throw new TypeError('caller must be a function')
  }

  const originalFn = this

  function boundFn(...laterArgs) {
    const isNewCall = this instanceof boundFn
    const context = isNewCall ? this : thisArg

    return originalFn.apply(context, [...presetArgs, ...laterArgs])
  }

  boundFn.prototype = Object.create(originalFn.prototype)

  return boundFn
}
```

## 口述题

### 1. this 绑定优先级是什么？

回答模板：

> `this` 的指向主要由函数调用方式决定。常见有四种绑定：默认绑定、隐式绑定、显式绑定和 `new` 绑定。
>
> 默认绑定是函数独立调用，非严格模式下指向全局对象，严格模式下是 `undefined`。隐式绑定是作为对象方法调用，`this` 指向调用它的对象。显式绑定是通过 `call / apply / bind` 指定 `this`。`new` 绑定是构造函数调用，`this` 指向新创建的实例。
>
> 优先级是：`new` 绑定高于显式绑定，显式绑定高于隐式绑定，隐式绑定高于默认绑定。还有一个特殊点是箭头函数没有自己的 `this`，它捕获定义时外层作用域的 `this`，所以不能被 `call / apply / bind` 改变。

### 2. 原型链查找与 new 过程怎么讲？

回答模板：

> JavaScript 通过原型链实现属性共享和继承。每个实例对象都有隐式原型 `__proto__`，它指向构造函数的 `prototype`。当访问一个属性时，引擎会先查找对象自身，如果没有，再沿着 `__proto__` 向上找，直到 `Object.prototype`，最后到 `null`。
>
> `new` 的过程可以拆成四步：第一，创建一个新对象；第二，把新对象的原型连接到构造函数的 `prototype`；第三，用这个新对象作为 `this` 执行构造函数；第四，如果构造函数返回对象，就返回这个对象，否则返回新创建的对象。

### 3. call / bind 的本质分别是什么？

回答模板：

> `call` 和 `bind` 都是为了解决函数调用时 `this` 指向的问题。
>
> `call` 的特点是立即执行函数，并显式指定这次调用的 `this`。它的手写核心是把函数临时挂到目标对象上，通过对象方法调用的方式让 `this` 指向目标对象，执行完再删除临时属性。
>
> `bind` 的特点是不立即执行，而是返回一个新函数。这个新函数保存了原函数、绑定对象和预置参数。普通调用时使用绑定对象作为 `this`，但如果返回的新函数被 `new` 调用，`this` 应该指向新实例，不能继续使用原来绑定的对象。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 先讲 `this` 四种绑定和优先级，控制在 2 分钟。
2. 再讲原型链查找和 `new` 过程，控制在 2 分钟。
3. 最后讲 `call / bind` 区别，控制在 1 分钟。

录完后自查：

- 是否说出 `new > 显式 > 隐式 > 默认`。
- 是否说出箭头函数不能改 `this`。
- 是否说出 `instance.__proto__ === Constructor.prototype`。
- 是否说出 `call` 立即执行、`bind` 返回函数。

## 今日复盘

今天最需要回补的 3 个点：

1. `typeof / instanceof / Object.prototype.toString.call` 的适用边界。
2. `bind` 遇到 `new` 调用时为什么要忽略绑定对象。
3. `prototype / __proto__ / constructor` 三者关系需要画图再讲一遍。
