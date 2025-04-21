// 似曾相识的代码
function partial(fn) {
  const args = [].slice.call(arguments, 1)
  return function () {
    const newArgs = args.concat([].slice.call(arguments))
    return fn.apply(this, newArgs)
  }
}

// this指向差异
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
