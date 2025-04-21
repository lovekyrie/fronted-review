// 函数柯里化第一版
function curry(fn) {
  // 得到传给curry的参数
  const args = [].slice.call(arguments, 1)
  return function () {
    // 得到调用curry后所传参数
    console.log(arguments)
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
