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
