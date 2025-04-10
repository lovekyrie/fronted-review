const memoize = require("./underscore-mock")

// 利用memoize缓存结果
var count = 0
var fibonacci = function (n) {
  count++
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}
fibonacci = memoize(fibonacci)
for (var i = 0; i <= 10; i++) {
  fibonacci(i)
}
console.log(count)