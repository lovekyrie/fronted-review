### ES6 新特性
ES6（ECMAScript 2015）引入了许多新的语言特性，使JavaScript更加强大和易用。

#### 1. 变量声明
ES6 引入了块级作用域的声明方式，解决了 `var` 带来的变量提升和全局污染问题。
- **let**：用于声明可变变量，受块级作用域约束。
- **const**：用于声明常量，受块级作用域约束，必须初始化，且引用地址不可变。

1. **let 和 const**
```js
// let 声明变量
let x = 1;
x = 2; // 可以重新赋值

// const 声明常量
const y = 1;
y = 2; // 错误：Assignment to constant variable
```

2. **块级作用域**
```js
{
  let x = 1;
  const y = 2;
}
console.log(x); // 错误：x is not defined
```

#### 2. 箭头函数
语法更简洁的函数定义方式。
- **特性**：不绑定自己的 `this`，继承外层上下文的 `this`。
- **限制**：不能作为构造函数（new），没有 `arguments` 对象。

1. **基本语法**
```js
// 传统函数
function add(a, b) {
  return a + b;
}

// 箭头函数
const add = (a, b) => a + b;
```

2. **this 绑定**
```js
const obj = {
  name: 'John',
  sayHello: function() {
    setTimeout(() => {
      // 这里的 this 自动指向 obj
      console.log(`Hello, ${this.name}`);
    }, 100);
  }
};
```

#### 3. 解构赋值
一种从数组或对象中提取数据的优雅语法。
- **场景**：交换变量、提取接口返回值、函数参数默认值。

1. **数组解构**
```js
const [a, b, ...rest] = [1, 2, 3, 4, 5];
console.log(a); // 1
console.log(b); // 2
console.log(rest); // [3, 4, 5]
```

2. **对象解构**
```js
const { name, age, ...other } = { name: 'John', age: 30, city: 'New York' };
console.log(name); // 'John'
console.log(age); // 30
console.log(other); // { city: 'New York' }
```

#### 4. 模板字符串
增强版的字符串，支持多行文本和嵌入变量。
- **语法**：使用反引号 (\`) 包裹，变量使用 `${}`。

```js
const name = 'John';
const age = 30;
const greeting = `Hello, my name is ${name} and I am ${age} years old.`;
```

#### 5. 展开运算符
`...` 运算符，用于将数组或对象展开为逗号分隔的序列。
- **场景**：合并数组/对象、复制数组/对象（浅拷贝）、函数不定参数。

1. **数组展开**
```js
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
console.log(arr2); // [1, 2, 3, 4, 5]
```

2. **对象展开**
```js
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };
console.log(obj2); // { a: 1, b: 2, c: 3 }
```

#### 6. 类 (Class)
基于原型的继承的语法糖，写法更接近传统面向对象语言。
- **constructor**：构造函数。
- **static**：静态方法。
- **super**：调用父类。

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // babel编译后可以看到，sayHello方法会添加到原型上
  sayHello() {
    console.log(`Hello, my name is ${this.name}`);
  }

  static create(name, age) {
    return new Person(name, age);
  }
}

const person = new Person('John', 30);
person.sayHello(); // Hello, my name is John
```

#### 7. 模块化 (Module)
ES6 原生支持的模块系统。
- **export**：导出模块接口（命名导出、默认导出）。
- **import**：引入其他模块提供的接口。

1. **导出**
```js
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export default class Calculator {}
```

2. **导入**
```js
// main.js
import Calculator, { add, subtract } from './math.js';
```

#### 8. Promise
用于处理异步操作的对象，解决了回调地狱问题。
- **状态**：pending -> fulfilled / rejected。
- **链式调用**：`.then()` 返回新的 Promise。

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success');
  }, 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

#### 9. 迭代器和生成器
- **Iterator**：一种接口机制，为各种数据结构提供统一的访问机制（`for...of`）。
- **Generator**：函数内部使用 `yield` 暂停执行，返回遍历器对象。

1. **迭代器**
```js
const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();
console.log(iterator.next()); // { value: 1, done: false }
```

2. **生成器**
```js
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generator();
console.log(gen.next()); // { value: 1, done: false }
```

#### 10. 新的数据结构
- **Set**：成员唯一（去重）的集合。
- **Map**：键值对集合，键可以是任意类型（包括对象）。
- **WeakMap/WeakSet**：弱引用版本，防止内存泄漏。

1. **Symbol**
唯一标识符，常用于定义对象的唯一属性名。

```js
const sym = Symbol('description');
console.log(sym); // Symbol(description)
```

2. **Map**
```js
const map = new Map();
map.set('key', 'value');
console.log(map.get('key')); // 'value'
```

3. **Set**
```js
const set = new Set([1, 2, 3, 3]);
console.log(set); // Set { 1, 2, 3 }
```

#### 11. 新的数组方法
简化数组操作的高阶函数。

1. **map**
返回新数组，每个元素映射为回调函数的返回值。

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6]
```

2. **filter**
返回新数组，包含所有通过测试的元素。

```js
const numbers = [1, 2, 3, 4, 5];
const even = numbers.filter(n => n % 2 === 0);
console.log(even); // [2, 4]
```

3. **reduce**
将数组元素累计计算为一个值。

```js
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 10
```

#### 12. 新的对象方法

1. **Object.assign**
用于合并对象（浅拷贝）。

```js
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const obj3 = Object.assign({}, obj1, obj2);
console.log(obj3); // { a: 1, b: 2 }
```

2. **Object.entries**
返回对象自身可枚举属性的键值对数组。

```js
const obj = { a: 1, b: 2 };
console.log(Object.entries(obj)); // [['a', 1], ['b', 2]]
```

#### 最佳实践
1. **拥抱 const/let**：彻底抛弃 `var`。
2. **巧用解构**：让代码更 clean，提取参数更方便。
3. **箭头函数优先**：除了需要动态 `this` 的场合（如对象方法、原型方法、事件回调需要指向元素本身时），尽量使用箭头函数。
4. **使用 Class**：在需要面向对象编程时，优先使用 Class 而不是构造函数+原型链。
5. **善用 Map/Set**：处理频繁增删键值对或去重场景，性能优于 Object/Array。
6. **模板字符串**：拼接字符串时首选。
7. **模块化**：坚持使用 `import/export`，避免全局污染。 