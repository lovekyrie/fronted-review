// 以斐波拉契数列为例
var count = 0
var fibonacci = function (n) {
  count++
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}
for (var i = 0; i <= 10; i++) {
  fibonacci(i)
}

console.log(count)