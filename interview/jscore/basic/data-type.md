---
title: 数据类型与类型系统
description: JavaScript 基本类型、引用类型、类型判断与转换的高频追问与深层原理
---

### 基本类型 (primitive type)
在 JavaScript 中，**基本类型**是直接存储在栈（Stack）中的简单数据段。它们是不可变的，直接按值访问。

```js
// 7种基本类型
const str = 'hello' // String
const num = 42 // Number
const bool = true // Boolean
const n = null // Null
let u // Undefined
const sym = Symbol('1') // Symbol
const big = 42n // BigInt
```

### 引用类型 (reference type)
**引用类型**存储在堆（Heap）内存中。变量实际存储的是指向堆内存地址的**指针**，这个指针本身存储在栈中。
常见的引用类型包括 `Object`、`Array`、`Function` 等。

```js
// 对象类型
const obj = {} // Object
const arr = [] // Array
function func() {} // Function
const date = new Date() // Date
```

### 函数参数传递
JavaScript 中所有函数的参数都是**按值传递**的。
- 对于**基本类型**，传递的是值的副本。
- 对于**引用类型**，传递的是**指针的副本**（即内存地址的拷贝）。这意味着在函数内部修改对象的属性会影响外部对象，但重新给参数赋值（指向新对象）不会影响外部变量。

```js
const person = {
  name: 'Nicholas',
  age: 20,
}

// obj指传入一个引用 (相当于与指向person堆内存地址的栈内存的副本)
function setName(obj) {
  obj = {} // 将传入的引用指向另外的值 (这里开辟了新的堆地址，所以与原来的person引用地址再无瓜葛)
  obj.name = 'Greg' // 修改引用的name值
}

setName(person)
console.log(person.name) // Nicholas
```

### 判断数据类型
面试中常见的三种判断方式，各有优劣。

#### typeof
最基础的判断方式，适用于判断基本类型（null 除外）和函数。
**特点**：
- `typeof null` 返回 `'object'`（历史遗留 bug）。
- 引用类型（除 function）一律返回 `'object'`。

```js
console.log(typeof undefined) // "undefined"
console.log(typeof null) // "object"
console.log(typeof '11') // "string"
console.log(typeof 123) // "number"
console.log(typeof BigInt(1)) // "bigint"
console.log(typeof Symbol('4')) // "symbol"
console.log(typeof { a: 1 }) // "object"
console.log(typeof function () {}) // "function"
```

#### instanceof
用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。
**原理**：`left.__proto__.__proto__... === right.prototype`
**缺点**：不能正确判断基本类型；受原型链修改影响。

```js
const obj = { a: 1 }
console.log(obj instanceof Object) // true

function Person() {}
const p = new Person()
console.log(p instanceof Person) // true
// p.__proto__ = Person.prototype
// Person.prototype.__proto__ = Object.prototype (可以参考原型链那张图)
// Object.prototype.__proto__ = null
console.log(p instanceof Object) // true
```

#### Object.prototype.toString.call()
最准确的判断方式，也就是常说的“万能方法”。它利用了 Object 原型上的 `toString` 方法，统一返回 `[object Type]` 格式。

```js
Object.prototype.toString.call({}) // "[object Object]"
Object.prototype.toString.call(1) // "[object Number]"
Object.prototype.toString.call('1') // "[object String]"
Object.prototype.toString.call(true) // "[object Boolean]"
Object.prototype.toString.call(() => {}) // "[object Function]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(/123/g) // "[object RegExp]"
Object.prototype.toString.call(new Date()) // "[object Date]"
Object.prototype.toString.call([]) // "[object Array]"
Object.prototype.toString.call(document) // "[object HTMLDocument]"
Object.prototype.toString.call(window) // "[object Window]"
```

### 类型转换
类型转换分为**显式转换**（强制转换）和**隐式转换**（自动转换）。

#### 显式转换

**Number()**
将各种类型强制转为数字。
- **Boolean**: `true` -> 1, `false` -> 0
- **Null**: -> 0
- **Undefined**: -> `NaN`
- **Symbol**: 抛出 TypeError
- **Object**: 先调用 `[Symbol.toPrimitive]`，否则调 `valueOf()`，再调 `toString()`，最后转数字。

**String()**
将值转换为字符串。
- **Symbol**: 抛出 TypeError
- **Object**: 依次调用 `[Symbol.toPrimitive](hint: "string")` -> `toString()` -> `valueOf()`。

**parseInt(string, radix)**
解析字符串返回整数。
- **规则**：从第一个非空字符开始解析，遇到非数字字符停止。
- **注意**：始终指定 `radix`（基数），如 `parseInt('10', 10)`，避免旧版浏览器解析八进制的坑。

**parseFloat(string)**
解析字符串返回浮点数。
- 始终解析 10 进制。
- 遇到非法字符停止，能识别指数符号 `e`。

**Boolean()**
除了以下 **6 个假值**，其他全为 `true`：
`undefined`, `null`, `false`, `''` (空串), `0` (+0/-0), `NaN`

#### 隐式转换
主要发生在 `==` 比较和 `+` 运算中。

**'==' 的隐式类型转换规则**
1. **类型相同**：直接比较（Object 比较引用地址）。
2. **null == undefined**：返回 `true`。
3. **Object vs Primitive**：Object 转为原始值（调用 ToPrimitive）。
4. **String/Boolean vs Number**：转为 Number 进行比较。
   - `true` -> 1
   - `'123'` -> 123

**'+' 的隐式类型转换规则**
1. **字符串拼接**：只要有一方是字符串，另一方就会转为字符串拼接。
2. **数字加法**：如果两边都不是字符串，转为数字相加。
   - 特例：`Date` 对象会优先转字符串。

**Object 的转换规则 (ToPrimitive)**
当对象需要转为原始值时（如 `obj + 1`），引擎按以下顺序调用：
1. `Symbol.toPrimitive(hint)`
2. `valueOf()`
3. `toString()`
4. 如果以上都没返回原始值，抛出 `TypeError`。

---

## 高频追问与深层原理

### NaN 的判断：为何 `NaN !== NaN`

`NaN` 是 JavaScript 中唯一一个**不等于自身**的值。这是 IEEE 754 浮点数规范的规定。

```js
console.log(NaN === NaN) // false
console.log(Object.is(NaN, NaN)) // true - Object.is 可以正确判断
```

**为什么 `NaN` 不等于自身？**
- `NaN` 表示"不是一个数字"的运算结果（如 `0/0`）
- IEEE 754 标准规定 `NaN` 比较永远返回 `false`，以便区分"不确定"和"确定"的结果

**如何正确判断 NaN：**

```js
// 方法1：Number.isNaN（推荐）
Number.isNaN(NaN) // true
Number.isNaN('abc' / 2) // true

// 方法2：Object.is
Object.is(NaN, NaN) // true

// 方法3：利用 NaN !== NaN 的特性
const isNaN = (v) => v !== v // 利用 NaN !== NaN

// 不推荐：isNaN() 会做类型转换
isNaN('abc') // true - 先把 'abc' 转成 NaN，再判断
Number.isNaN('abc') // false - 不会做类型转换
```

**追问**：为什么 `Object.is` 能正确判断 `NaN`？
- `Object.is` 是 ES2015 新增的精确比较方法，内部实现是 `SameValueZero` 算法
- 与 `===` 的区别在于：`Object.is(NaN, NaN)` 和 `Object.is(+0, -0)` 都返回 `true`

---

### 装箱与拆箱：基本类型如何调用方法

JavaScript 的基本类型（`string`、`number`、`boolean`）本身不是对象，不应该有方法。但我们却可以这样写：

```js
const str = 'hello'
console.log(str.toUpperCase()) // "HELLO"
```

这背后是**装箱**机制在起作用：**临时将基本类型转换为包装对象**，从而可以调用对象上的方法。

#### 装箱过程

```js
// 引擎内部大概是这样做的：
const str = 'hello'
const boxed = new String(str) // 临时创建包装对象
boxed.toUpperCase()          // 调用方法
boxed = null                 // 使用后立即销毁（GC）
```

#### 拆箱过程

将包装对象转回基本类型：

```js
const boxed = new String('hello')
const primitive = boxed.valueOf() // "hello" - 显式拆箱
const primitive2 = boxed + ''     // "hello" - 隐式拆箱
```

#### Symbol.toPrimitive 的作用

当对象参与运算时，`Symbol.toPrimitive` 可以自定义转换逻辑：

```js
const obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return 42
    if (hint === 'string') return 'hello'
    return true
  }
}

console.log(obj + 1)      // 42 + 1 = 43 (hint: 'default')
console.log(obj * 2)      // 42 * 2 = 84 (hint: 'number')
console.log(String(obj))   // "hello" (hint: 'string')
```

---

### 浮点数精度问题：为何 `0.1 + 0.2 !== 0.3`

这是 JavaScript（乃至所有 IEEE 754 浮点数语言）的经典坑：

```js
console.log(0.1 + 0.2)        // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3) // false
```

**为什么会这样？**

JavaScript 使用 IEEE 754 双精度浮点数（64位）。`0.1` 和 `0.2` 在二进制下是无限循环小数：

```
0.1 (十进制) = 0.0001100110011001100... (二进制)
0.2 (十进制) = 0.0011001100110011001... (二进制)
```

IEEE 754 无法精确表示这些值，只会截取到 52位尾数，产生精度丢失。

**工程中的处理方案：**

```js
// 方案1：使用整数运算（处理金额时务必使用）
const cents = 10 + 20  // 30 cents，精确
const dollars = cents / 100 // 0.30，精确

// 方案2：使用 toFixed 或 round
const sum = (0.1 + 0.2).toFixed(2) // "0.30"，返回字符串
const sumNum = Math.round((0.1 + 0.2) * 100) / 100 // 0.3

// 方案3：使用专业库（如 decimal.js）
import Decimal from 'decimal.js'
new Decimal('0.1').plus('0.2').equals('0.3') // true

// 方案4：ES2020 BigDecimal（草案阶段）
```

**面试回答模板：**

> JavaScript 的 `0.1 + 0.2 !== 0.3` 是因为 IEEE 754 浮点数无法精确表示 `0.1`、`0.2` 这样的二进制无限循环小数。解决方案是使用整数运算（如金额用分而非元），或者使用 `toFixed`、`Math.round` 配合处理。

---

### Symbol 的应用场景

`Symbol` 是 ES2015 新增的基本类型，用于创建唯一标识。常见应用场景：

#### 1. 作为对象的键

```js
const sym = Symbol('description')
const obj = {
  name: 'hello',
  [sym]: 'world' // symbol 作为 key
}
obj[sym] // "world"
Object.keys(obj) // ["name"] - Symbol key 不会枚举
```

#### 2. Symbol.iterator：定义迭代器

```js
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from
    return {
      next() {
        if (current <= this.to) {
          return { value: current++, done: false }
        }
        return { done: true }
      }
    }
  }
}

for (const num of range) {
  console.log(num) // 1, 2, 3, 4, 5
}
```

#### 3. Symbol.toPrimitive：自定义类型转换

```js
const distance = {
  value: 100,
  unit: 'km',
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.value
    if (hint === 'string') return `${this.value}${this.unit}`
    return this.value
  }
}

console.log(distance + 0)       // 100
console.log(String(distance))   // "100km"
```

#### 4. Symbol.replace / Symbol.split：自定义正则行为

```js
const replacer = {
  [Symbol.replace](str, replacement) {
    return str.replace(/foo/g, replacement)
  }
}
```

#### 5. 全局 Symbol vs 本地 Symbol

```js
// 本地 Symbol（每次创建都唯一）
const s1 = Symbol('key')
const s2 = Symbol('key')
s1 === s2 // false

// 全局 Symbol（相同 key 返回同一引用）
const gs1 = Symbol.for('key')
const gs2 = Symbol.for('key')
gs1 === gs2 // true
Symbol.keyFor(gs1) // "key" - 通过 symbol 找 key
```

---

### BigInt 的使用限制与场景

BigInt 是 ES2020 新增的基本类型，用于处理超过 `Number.MAX_SAFE_INTEGER`（2^53 - 1）的整数。

#### 基本用法

```js
const big = 9007199254740991n  // 加 n 后缀
const alsoBig = BigInt(9007199254740991)

// 大数运算
big + 1n // 9007199254740992n
big * 2n // 18014398509481982n
```

#### 使用限制

```js
// 1. 不能与 Number 混用运算
1n + 1 // TypeError
1n + BigInt(1) // 2n - OK

// 2. 不能使用 Math 方法
Math.max(1n, 2n) // TypeError

// 3. 不能 JSON.stringify
JSON.stringify(1n) // TypeError

// 4. typeof 返回 "bigint"
typeof 1n // "bigint"
```

#### 适用场景

```js
// 1. 金融计算（金额、汇率）
const price = 1000000000000000000n // 1兆元，精确

// 2. ID 生成（超过 Number 安全范围）
const id = BigInt(Date.now()) * 1000000n + BigInt(Math.random() * 999999)

// 3. 位运算
const flags = 1n << 64n // 左移 64 位
```

---

### 手写 instanceof Polyfill

`instanceof` 的原理是沿着对象的原型链向上查找，看是否有构造函数的 `prototype`。

```js
function myInstanceof(left, right) {
  // 边界检查：left 必须是对象，right 必须是函数
  if (typeof left !== 'object' || left === null) {
    return false
  }
  if (typeof right !== 'function') {
    return false
  }

  // 获取 left 的原型
  let proto = Object.getPrototypeOf(left)
  const prototype = right.prototype

  // 沿着原型链向上查找
  while (proto !== null) {
    if (proto === prototype) {
      return true
    }
    proto = Object.getPrototypeOf(proto)
  }

  return false
}

// 测试
function Person(name) {
  this.name = name
}
const p = new Person('Nicholas')

myInstanceof(p, Person)        // true
myInstanceof(p, Object)        // true
myInstanceof(p, String)        // false
myInstanceof('hello', String)  // false（基本类型）
myInstanceof(null, Object)     // false（null 检查）
```

**面试追问**：`instanceof` 和 `typeof` 的区别？

| 维度 | typeof | instanceof |
|------|--------|------------|
| 基本类型 | 能判断（除 null） | 不能 |
| 引用类型 | 只能返回 object/function | 能判断继承关系 |
| 原型链修改 | 不受影响 | 可能受影响 |
| 跨 iframe | 不受影响 | 可能受影响 |

---

## 面试回答模板

**问题**：JavaScript 的数据类型系统有什么特点？

**高分回答**：

> JavaScript 包含 7 种基本类型（string、number、boolean、null、undefined、symbol、bigint）和 1 种引用类型（object）。
>
> 基本类型存储在栈中，按值访问，**不可变**；引用类型存储在堆中，变量实际存储的是**指针**。
>
> 传参时都是按值传递，引用类型传递的是指针副本，所以函数内部可以修改对象属性，但不能重新赋值外部变量。
>
> 类型判断首选 `typeof`（适合基本类型和函数），需要精确判断用 `Object.prototype.toString.call()`，`instanceof` 用于判断继承关系。
>
> 隐式类型转换主要发生在 `==` 和 `+` 运算中，核心规则是**对象转原始值**（调用 ToPrimitive），然后根据运算符类型转数字或字符串。需要注意 `NaN !== NaN` 的特性和浮点数精度问题（大数运算使用整数或专业库）。

---

## 相关链接

- [MDN JavaScript 数据类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)
- [MDN Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [MDN BigInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- [IEEE 754 浮点数计算器](https://www.h-schmidt.net/FloatConverter/IEEE754.html)
