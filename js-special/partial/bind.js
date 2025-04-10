/* 柯里化是将一个多参数函数转换成多个单参数函数， 也就是将一个 n 元函数转换成 n 个一元函数。
局部应用则是固定一个函数的一个或者多个参数， 也就是将一个 n 元函数转换成一个 n - x 元函数。 */
//以bind为例
function add(a, b) {
  return a + b
}

var addOne = add.bind(this, 1)

function addOther() {
  return add.bind(this, 1)
}

console.log(addOne(2))
console.log(addOther()(2))