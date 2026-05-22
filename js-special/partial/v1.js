// 偏函数：固定前若干参数；与 curry 不同，不保证按 arity 分步收集
function partial(fn) {
  const args = [].slice.call(arguments, 1)
  return function () {
    const newArgs = args.concat([].slice.call(arguments))
    return fn.apply(this, newArgs)
  }
}

// bind 会绑定 this；partial 仅固定参数，this 由调用方决定
const value = 1

function add(a, b) {
  return a + b + this.value
}

const addOne = add.bind(null, 1)
const addTwo = partial(add, 1)

const obj = {
  value: 2,
  addTwo,
}
console.log(addOne(2)) // 在node环境下this不是指向window
console.log(obj.addTwo(2))
