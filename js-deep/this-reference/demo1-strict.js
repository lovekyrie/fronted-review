'use strict'
const value = 1

const foo = {
  value: 2,
  bar() {
    return this.value
  },
}

// 示例1
console.log(foo.bar()) // 2
// 示例2
console.log((foo.bar)()) // 2
// 示例3
console.log((foo.bar = foo.bar)()) // 1
// 示例4
console.log((false || foo.bar)()) // 1
// 示例5
console.log((foo.bar, foo.bar)()) // 1
