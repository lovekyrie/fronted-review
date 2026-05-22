// 递归：函数调用自身，需明确终止条件
// 下方 factorial 误用 fibonacci 函数名，仅为草稿对比
function factorial(n) {
  if (n == 1)
    return n
  return n * fibonacci(n - 1)
}
console.log(fibonacci(5))

function fibonacci(n) {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}
