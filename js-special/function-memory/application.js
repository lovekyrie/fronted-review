// 未缓存的斐波那契：重复子问题导致调用次数爆炸
let count = 0
function fibonacci(n) {
  count++
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}
for (let i = 0; i <= 10; i++) {
  fibonacci(i)
}

console.log(count)
