/**
 * es6的实现方式在hand-write/simulate/curry.js es6中可以直接省略apply用法
 * @param {*} func
 * @returns
 */
function curry(func) {
  return function curried(...args1) {
    if (args1.length >= func.length) {
      return func.apply(this, args1)
    }
    else {
      return function (...args2) {
        return curried.apply(this, args1.concat(args2))
      }
    }
  }
}

function sum(a, b, c) {
  return a + b + c
}

const curriedSum = curry(sum)

console.log(curriedSum(1, 2, 3))
console.log(curriedSum(1), (2, 3))
console.log(curriedSum(1)(2)(3))
