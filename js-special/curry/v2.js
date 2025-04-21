// 第二版
function sub_curry(fn) {
  const args = [].slice.call(arguments, 1)
  return function () {
    return fn.apply(this, args.concat([].slice.call(arguments)))
  }
}

function curry(fn, length) {
  length = length || fn.length

  const slice = Array.prototype.slice

  return function () {
    if (arguments.length < length) {
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

module.exports = curry
