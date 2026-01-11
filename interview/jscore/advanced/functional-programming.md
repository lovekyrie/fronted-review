### 函数式编程
函数式编程是一种编程范式，它强调使用纯函数和不可变数据。

#### 1. 纯函数 (Pure Functions)
纯函数是指相同的输入总是产生相同的输出，并且没有副作用的函数。

```js
// 纯函数
function add(a, b) {
  return a + b;
}

// 非纯函数
let total = 0;
function addToTotal(x) {
  total += x; // 有副作用
  return total;
}
```

#### 2. 不可变性 (Immutability)
不可变性是指数据一旦创建就不能被修改。

```js
// 可变操作
const arr = [1, 2, 3];
arr.push(4); // 修改原数组

// 不可变操作
const arr = [1, 2, 3];
const newArr = [...arr, 4]; // 创建新数组
```

#### 3. 高阶函数 (Higher-Order Functions)
高阶函数是指接受函数作为参数或返回函数的函数。

```js
// 接受函数作为参数
function map(array, fn) {
  return array.map(fn);
}

// 返回函数
function multiply(x) {
  return function(y) {
    return x * y;
  };
}

const multiplyByTwo = multiply(2);
console.log(multiplyByTwo(3)); // 6
```

#### 4. 函数组合 (Function Composition)
函数组合是将多个函数组合成一个新函数的过程。

```js
const compose = (...fns) => 
  fns.reduce((f, g) => (...args) => f(g(...args)));

const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;
const addOneAndMultiplyByTwo = compose(multiplyByTwo, addOne);

console.log(addOneAndMultiplyByTwo(3)); // 8
```

#### 5. 柯里化 (Currying)
柯里化是将一个接受多个参数的函数转换为一系列接受单个参数的函数。

```js
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...moreArgs) => curried.apply(this, args.concat(moreArgs));
  };
};

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
```

#### 6. 函数式编程工具
##### 6.1 map
```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2);
console.log(doubled); // [2, 4, 6]
```

##### 6.2 filter
```js
const numbers = [1, 2, 3, 4, 5];
const even = numbers.filter(x => x % 2 === 0);
console.log(even); // [2, 4]
```

##### 6.3 reduce
```js
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 10
```

#### 7. 函数式编程模式
##### 7.1 管道模式 (Pipeline)
```js
const pipe = (...fns) => 
  fns.reduce((f, g) => (...args) => g(f(...args)));

const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;
const addOneAndMultiplyByTwo = pipe(addOne, multiplyByTwo);

console.log(addOneAndMultiplyByTwo(3)); // 8
```

##### 7.2 函子 (Functor)
```js
class Maybe {
  constructor(value) {
    this.value = value;
  }

  static of(value) {
    return new Maybe(value);
  }

  map(fn) {
    return this.value == null ? 
      Maybe.of(null) : 
      Maybe.of(fn(this.value));
  }
}

const maybe = Maybe.of(5)
  .map(x => x * 2)
  .map(x => x + 1);

console.log(maybe.value); // 11
```

##### 7.3 Monad
```js
class Either {
  constructor(value) {
    this.value = value;
  }

  static of(value) {
    return new Either(value);
  }

  map(fn) {
    return this.value == null ? 
      Either.of(null) : 
      Either.of(fn(this.value));
  }

  chain(fn) {
    return this.map(fn).value;
  }
}

const either = Either.of(5)
  .map(x => x * 2)
  .chain(x => Either.of(x + 1));

console.log(either); // 11
```

#### 8. 最佳实践
1. 使用纯函数
2. 避免副作用
3. 使用不可变数据
4. 使用高阶函数
5. 使用函数组合
6. 使用柯里化
7. 使用函数式编程工具
8. 使用函数式编程模式
9. 使用TypeScript增强类型安全
10. 编写单元测试确保正确性

#### 9. 常见面试题
1. **实现一个compose函数**
```js
const compose = (...fns) => 
  fns.reduce((f, g) => (...args) => f(g(...args)));
```

2. **实现一个curry函数**
```js
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...moreArgs) => curried.apply(this, args.concat(moreArgs));
  };
};
```

3. **实现一个Maybe函子**
```js
class Maybe {
  constructor(value) {
    this.value = value;
  }

  static of(value) {
    return new Maybe(value);
  }

  map(fn) {
    return this.value == null ? 
      Maybe.of(null) : 
      Maybe.of(fn(this.value));
  }
}
``` 