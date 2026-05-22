// 柯里化 v1：一次性预填部分参数，返回的函数再收集剩余参数
function curry(fn) {
  const args = [].slice.call(arguments, 1) // curry 时传入的已固定参数
  return function () {
    const newArgs = args.concat([].slice.call(arguments))
    return fn.apply(this, newArgs)
  }
}

function add(a, b) {
  return a + b
}

var addCurry = curry(add, 1, 2)
console.log(addCurry())
var addCurry = curry(add, 1)
console.log(addCurry(2))
var addCurry = curry(add)
console.log(addCurry(1, 2))
