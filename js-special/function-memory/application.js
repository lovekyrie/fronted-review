// 以斐波拉契数列为例
let count = 0
function fibonacci(n) {
  count++
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}
for (let i = 0; i <= 10; i++) {
  fibonacci(i)
}

console.log(count)
