// mutile-leves-extends

function A() {}
A.prototype.a = function () {
  return 'a'
}

function B() {}
B.prototype = new A()
// 当用A构造函数实例化一个对象a的时候，正常a.__proto__ = A.Prototype 所以实际上就是B的原型等于A的原型
B.prototype.b = function () {
  return 'b'
}

const c = new B()
c.b()
c.a()
