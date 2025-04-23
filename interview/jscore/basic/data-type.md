- 基本类型 (primitive type) 值保存的数据结构为栈

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
- 引用类型 (refenrence type) 值保存的数据结构为堆，指针(指向堆地址)还是会存储在栈中

```js
// 对象类型
const obj = {} // Object
const arr = [] // Array
function func() {} // Function
const date = new Date() // Date
```

* 函数参数传递 都是值传递 (就是引用类型传的是指向堆内存的指针)
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
* 判断数据类型
 1. typeof
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
 2. instanceof
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
 3. Object.prototype.toString.call()
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

- 类型转换
 * 显式转换
   - Number()
   - parseInt()
   - parseFloat()
   - String()
   - toString()
   - Boolean()

 * 隐式转换
