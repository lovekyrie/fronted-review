// 函数 useArguments 可以接收 1 个及以上的参数。请实现函数 useArguments，返回所有调用参数相加后的结果。
// 本题的测试参数全部为 Number 类型，不需考虑参数转换。
function useArguments(...rest) {
  return rest.reduce((acc, curr) => acc + curr, 0)
}

function useArguments1(...rest) {
  let sum = 0
  for (let i = 0; i < rest.length; i++) {
    sum += rest[i]
  }
  return sum
}

console.time('useArguments')
console.log(useArguments(1, 2, 3, 4, 5))
console.timeEnd('useArguments')

console.time('useArguments1')
console.log(useArguments1(1, 2, 3, 4, 5))
console.timeEnd('useArguments1')
