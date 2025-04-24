### ES6 新特性
ES6（ECMAScript 2015）引入了许多新的语言特性，使JavaScript更加强大和易用。

#### 1. 变量声明
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
      console.log(`Hello, ${this.name}`);
    }, 100);
  }
};
```

#### 3. 解构赋值
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
```js
const name = 'John';
const age = 30;
const greeting = `Hello, my name is ${name} and I am ${age} years old.`;
```

#### 5. 展开运算符
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

#### 6. 类
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

#### 7. 模块化
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

#### 10. 新的数据类型
1. **Symbol**
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
1. **map**
```js
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6]
```

2. **filter**
```js
const numbers = [1, 2, 3, 4, 5];
const even = numbers.filter(n => n % 2 === 0);
console.log(even); // [2, 4]
```

3. **reduce**
```js
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 10
```

#### 12. 新的对象方法
1. **Object.assign**
```js
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const obj3 = Object.assign({}, obj1, obj2);
console.log(obj3); // { a: 1, b: 2 }
```

2. **Object.entries**
```js
const obj = { a: 1, b: 2 };
console.log(Object.entries(obj)); // [['a', 1], ['b', 2]]
```

#### 最佳实践
1. 使用`const`声明不会改变的变量
2. 使用`let`声明会改变的变量
3. 使用箭头函数简化代码
4. 使用解构赋值简化对象和数组操作
5. 使用模板字符串处理字符串拼接
6. 使用展开运算符合并数组和对象
7. 使用类组织代码
8. 使用模块化组织代码
9. 使用Promise处理异步操作
10. 使用新的数组和对象方法简化操作 