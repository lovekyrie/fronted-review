// 寄生式继承
function createObj(o) {
  const clone = Object.create(o)
  clone.sayName = function () {
    console.log('hi')
  }
  return clone
}
// 缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法。
