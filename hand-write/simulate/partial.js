// 偏函数
function partialFunc(func, ...args) {
  let placeholderNum = 0
  return (...args2) => {
    args2.forEach((arg) => {
      const index = args.findIndex(item => item === '_')
      if (index < 0)
        return // 不用throw new Error跳出循环？
      args[index] = arg
      placeholderNum++
    })
    const len = args2.length
    if (placeholderNum < len) {
      args2 = args2.slice(placeholderNum, len)
    }
    return func.apply(this, [...args, ...args2])
  }
}
// 使用
const add = (a, b, c, d) => a + b + c + d
const partialAdd2 = partialFunc(add, '_', 2, '_')
console.log(partialAdd2(1, 3, 4))
const partialAdd3 = partialFunc(add, 1, 2)
console.log(partialAdd3(3, 4))
