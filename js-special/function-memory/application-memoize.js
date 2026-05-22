import memoize from './underscore-mock.js'

// 同一 n 只算一次，count 会远小于未缓存版本
let count = 0
let fibonacci = function (n) {
  count++
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}
fibonacci = memoize(fibonacci)
for (let i = 0; i <= 10; i++) {
  fibonacci(i)
}
console.log(count)
