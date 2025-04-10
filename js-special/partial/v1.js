// 似曾相识的代码
function partial(fn) {
  var args = [].slice.call(arguments, 1)
  return function () {
    var newArgs = args.concat([].slice.call(arguments))
    return fn.apply(this, newArgs)
  }
}

//this指向差异
var value = 1

function add(a, b) {
  return a + b + this.value
}

var addOne = add.bind(null, 1);
var addTwo = partial(add, 1)

var obj = {
  value: 2,
  addTwo: addTwo
}
console.log(addOne(2)) //在node环境下this不是指向window
console.log(obj.addTwo(2))