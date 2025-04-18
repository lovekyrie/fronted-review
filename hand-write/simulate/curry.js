// 函数柯里化
/* 柯里化是函数式编程的一个重要技巧，将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术
 * 函数式编程另一个重要的函数 compose，能够将函数进行组合，而组合的函数只接受一个参数，
 * 所以如果有接受多个函数的需求并且需要用到 compose 进行函数组合，就需要使用柯里化对准备组合的函数进行部分求值，让它始终只接受一个参数
 */
function curry(fn) {
  if (fn.length <= 1)
    return fn
  const generator = (...args) => {
    if (fn.length === args.length) {
      return fn(...args)
    }
    else {
      return (...args2) => {
        return generator(...args, ...args2)
      }
    }
  }
  return generator
}

const add = (a, b, c, d) => a + b + c + d
const curriedAdd = curry(add)
console.log(curriedAdd(5)(6)(7)(8))

// 使用场景参考js-special中的curry例子
