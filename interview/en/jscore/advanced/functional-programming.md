### Functional Programming
Functional programming is a programming paradigm that emphasizes pure functions and immutable data.

#### 1. Pure Functions
A pure function always produces the same output for the same input and has no side effects.

```js
// Pure function
function add(a, b) {
  return a + b;
}

// Impure function
let total = 0;
function addToTotal(x) {
  total += x; // Has a side effect
  return total;
}
```

#### 2. Immutability
Immutability means data cannot be modified once it is created.

```js
// Mutable operation
const arr = [1, 2, 3];
arr.push(4); // Mutates the original array

// Immutable operation
const arr = [1, 2, 3];
const newArr = [...arr, 4]; // Creates a new array
```

#### 3. Higher-Order Functions
A higher-order function is a function that takes a function as an argument or returns a function.

```js
// Takes a function as an argument
function map(array, fn) {
  return array.map(fn);
}

// Returns a function
function multiply(x) {
  return function(y) {
    return x * y;
  };
}

const multiplyByTwo = multiply(2);
console.log(multiplyByTwo(3)); // 6
```

#### 4. Function Composition
Function composition is the process of combining multiple functions into a new function.

```js
const compose = (...fns) => 
  fns.reduce((f, g) => (...args) => f(g(...args)));

const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;
const addOneAndMultiplyByTwo = compose(multiplyByTwo, addOne);

console.log(addOneAndMultiplyByTwo(3)); // 8
```

#### 5. Currying
Currying converts a function that takes multiple arguments into a series of functions that each take a single argument.

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

#### 6. Functional Programming Utilities
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

#### 7. Functional Programming Patterns
##### 7.1 Pipeline
```js
const pipe = (...fns) => 
  fns.reduce((f, g) => (...args) => g(f(...args)));

const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;
const addOneAndMultiplyByTwo = pipe(addOne, multiplyByTwo);

console.log(addOneAndMultiplyByTwo(3)); // 8
```

##### 7.2 Functor
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

#### 8. Best Practices
1. Use pure functions
2. Avoid side effects
3. Use immutable data
4. Use higher-order functions
5. Use function composition
6. Use currying
7. Use functional programming utilities
8. Use functional programming patterns
9. Use TypeScript to strengthen type safety
10. Write unit tests to ensure correctness

#### 9. Common Interview Questions
1. **Implement a compose function**
```js
const compose = (...fns) => 
  fns.reduce((f, g) => (...args) => f(g(...args)));
```

2. **Implement a curry function**
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

3. **Implement a Maybe functor**
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
