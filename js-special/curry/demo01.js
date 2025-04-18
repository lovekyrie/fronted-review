'use strict'
const add = (a, b, c) => a + b + c

console.log(add(1, 2, 3))

function curry(a) {
  return (b) => {
    return (c) => {
      return a + b + c
    }
  }
}
console.log(curry(3)(2)(1))
