// 1. 创建临时的空对象，为了表述方便，我们命名为fn.让对象fn的隐式原型指向F的显示原型
// 2. 执行函数F()，将this指向对象fn，并传入参数args，得到执行结果result
// 3. 判断上一步的执行结果result，如果result为非空对象，则返回result。否则返回fn
function createNew(F) {
  var fn = Object.create(F.prototype)
  const args = [].slice.call(arguments, 1)
  var obj = F.apply(fn, args)
  return obj && typeof obj === 'object' ? obj : fn
}

function Student(name, age) {
  this.name = name
  this.age = age
}

var obj = createNew(Student, 'lovekyrie', 18)
// obj.name = 'lovekyrie'
console.dir(obj)
