// 偏函数
const partialFunc = (func, ...args) => {
  let placeholderNum = 0
  return (...args2) => {
    args2.forEach(arg => {
      let index = args.findIndex(item => item === '_')
      if (index < 0) return //不用throw new Error跳出循环？
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
//使用
let add = (a, b, c, d) => a + b + c + d
let partialAdd2 = partialFunc(add, '_', 2, '_')
console.log(partialAdd2(1, 3, 4))
let partialAdd3 = partialFunc(add, 1, 2)
console.log(partialAdd3(3, 4))