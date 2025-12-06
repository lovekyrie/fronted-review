### 基本类型 (primitive type)
  值保存的数据结构为栈

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
### 引用类型 (refenrence type)
值保存的数据结构为堆，指针(指向堆地址)还是会存储在栈中

```js
// 对象类型
const obj = {} // Object
const arr = [] // Array
function func() {} // Function
const date = new Date() // Date
```

### 函数参数传递
都是值传递 (就是引用类型传的是指向堆内存的指针)
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
console.log(person.name)
```
### 判断数据类型
 - typeof
 ```js
console.log(typeof undefined)
console.log(typeof null) // object
console.log(typeof '11')
console.log(typeof 123)
console.log(typeof BigInt(1))
console.log(typeof Symbol('4'))
console.log(typeof { a: 1 })
console.log(typeof function () {}) // function
 ```
 - instanceof
 // 用于检测构造函数的prototype属性是否出现在某个实例对象的原型链上。
 // 例如，在表达式left instanceof right，会沿着left的原型链查找，看看是否存在right的prototype对象。
 // left.__proto__.__proto__... =?= right.prototype
 ```js
 const obj = { a: 1 }
 console.log(obj instanceof Object)

function Person() {}
const p = new Person()
console.log(p instanceof Person)
// p.__proto__ = Person.prototype
// Person.prototype.__proto__ = Object.prototype (可以参考原型链那张图)
// Object.prototype.__proto__ = null
console.log(p instanceof Object) // true
 ```
 - Object.prototype.toString.call()
 ```js
Object.prototype.toString({}) // "[object Object]"
Object.prototype.toString.call({}) // 同上结果，加上call也ok
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
#### 显式转换
- Number()
  * 如果是布尔值，true 和 false 分别被转换为 1 和 0；
  * 如果是数字，返回自身；
  * 如果是 null，返回 0；
  * 如果是 undefined，返回 NaN；
  * 如果是字符串，遵循以下规则：如果字符串中只包含数字（或者是 0X / 0x 开头的十六进制数字字符串，允许包含正负号），则将其转换为十进制；如果字符串中包含有效的浮点格式，将其转换为浮点数值；如果是空字符串，将其转换为 0；如果不是以上格式的字符串，均返回 NaN；
  * 如果是 Symbol，抛出错误；
  * **如果是对象，并且部署了 `[Symbol.toPrimitive]` ，那么调用此方法，否则调用对象的 valueOf() 方法，然后依据前面的规则转换返回的值；如果转换的结果是 NaN ，则调用对象的 toString() 方法，再次依照前面的顺序转换返回对应的值（Object 转换规则会在下面细讲）。**

- String()
  * 字符串按原样返回。
  * undefined 转换成 "undefined"。
  * null 转换成 "null"。
  * true 转换成 "true"；false 转换成 "false"。
  * 使用与 toString(10) 相同的算法转换数字。
  * 使用与 toString(10) 相同的算法转换 BigInt。
  * Symbol 抛出 TypeError。
  * **对于对象，首先，通过依次调用其 `[Symbol.toPrimitive]()`（hint 为 "string"）、toString() 和 valueOf() 方法将其转换为原始值。然后将生成的原始值转换为一个字符串。**

- parseInt(string ,_radix)
  * 如果第一个字符不能转换为数字，parseInt 会返回 NaN。
  * 使用的时候，第二个参数是可选的，用来指定要转换的进制，默认是 10 进制。（但是最好指定），不指定的时候需要string以0 或者 0x/0X开头

- parseFloat(string)
  * parseFloat 是个全局函数，不属于任何对象。
  * 如果 parseFloat 在解析过程中遇到了正号（+）、负号（- U+002D HYPHEN-MINUS）、数字（0-9）、小数点（.）、或者科学记数法中的指数（e 或 E）以外的字符，则它会忽略该字符以及之后的所有字符，返回当前已经解析到的浮点数。
  * 第二个小数点的出现也会使解析停止（在这之前的字符都会被解析）。
  * 参数首位和末位的空白符会被忽略。
  * 如果参数字符串的第一个字符不能被解析成为数字，则 parseFloat 返回 NaN。
  * parseFloat 也可以解析并返回 Infinity。
  * parseFloat 解析 BigInt 为 Numbers, 丢失精度。因为末位 n 字符被丢弃。 (同parseInt一样)

- Boolean()
 除了 `undefined`、 `null`、 `false`、 `''`、 `0`（包括 +0，-0）、 `NaN` 转换出来是 false，其他都是 true。

 toString() (这玩意只是String强制类型转换的时候优先调用的方法而已，不属于强制类型转换的分支)
 * to convert an object to a primitive value.
 * This method is called in priority by string conversion, but numeric conversion and primitive conversion call valueOf() in priority.
 valueOf() 返回的是自身，如果是object类型需要强转，调用该方法还是返回的object类型。不是primitive类型。
 #### 隐式转换
- '==' 的隐式类型转换规则
  1. operands the same type
    * Object: only return true both operands reference the same object
    * Number: return true only if both operands have the same value.+0 and -0are treated as the same value. If either operand is NaN, return false; so, NaN is never equal to NaN.
    * String: return true if both operands have the same characters in the same order.
    * Boolean: return true only if operands both true of both false.
    * BigInt: return true only if both operands have the same value.
    * Symbol: return true only if both operands reference the same symbol.
  2. one operands is unll or undefined
  3. one is object type, the other is primitive. convert the object to primitive type.
  4. At this step, both operands are converted to primitives(one of String, Number, Boolean, Symbol and BigInt). The rest of the conversation is done one by one.
    * If they are the same type, compare them using step 1.
    * If one of the operands is Symbol but the other is not, return false.
    * If one of the operands is **Boolean**, but the other is not, convert the boolean to number: true is converted to 1, and false is converted to 0.The compare the two operands loosely again.
    * Number to String: convert the string to number. Conversation failure results in NaN.which will guarantee the equality to be false.
    * Number to Bigint: compare by their mathematical value. If the value is  ±Infinity or NaN, return false.
    * String to Bigint: convert the string to a BigInt using the same algorithm as the BigInt() constructor. If conversion fails, return false.
- '+' 的隐式类型转换规则
  '+' 号操作符，不仅可以用作数字相加，还可以用作字符串拼接。仅当 '+' 号两边都是数字时，进行的是加法运算；如果两边都是字符串，则直接拼接，无须进行隐式类型转换。
  除了上述比较常规的情况外，还有一些特殊的规则，如下所示。

  -  如果其中有一个是字符串，另外一个是 undefined、null 或布尔型，则调用 toString() 方法进行字符串拼接；如果是纯对象、数组、正则等，则默认调用对象的转换方法会存在优先级（下一讲会专门介绍），然后再进行拼接。

  * 如果其中有一个是数字，另外一个是 undefined、null、布尔型或数字，则会将其转换成数字进行加法运算，对象的情况还是参考上一条规则。
  * 如果其中一个是字符串、一个是数字，则按照字符串规则进行拼接。
- Object 的转换规则
对象转换的规则，会先调用内置的 `[ToPrimitive]` 函数，其规则逻辑如下：
  * 如果部署了 Symbol.toPrimitive 方法，优先调用再返回；
  * 调用 valueOf()，如果转换为基础类型，则返回；
  * 调用 toString()，如果转换为基础类型，则返回；
  * 如果都没有返回基础类型，会报错。
