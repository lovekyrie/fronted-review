// 柯里化 v2：按 fn.length 判断是否凑齐参数，支持 fn('a')('b')('c')
function sub_curry(fn) {
  const args = [].slice.call(arguments, 1)
  return function () {
    return fn.apply(this, args.concat([].slice.call(arguments)))
  }
}

function curry(fn, length) {
  length = length || fn.length // 剩余待收集的参数个数

  const slice = Array.prototype.slice

  return function () {
    if (arguments.length < length) {
      // 参数不够，继续柯里化
      const combined = [fn].concat(slice.call(arguments))
      return curry(sub_curry.apply(this, combined), length - arguments.length)
    }
    else {
      return fn.apply(this, arguments)
    }
  }
}

const fn = curry((a, b, c) => {
  return [a, b, c]
})

console.log(fn('a', 'b', 'c'))
console.log(fn('a', 'b')('c'))
console.log(fn('a')('b')('c'))

export default curry
