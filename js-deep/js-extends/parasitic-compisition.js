//寄生组合式继承 由于组合继承会访问两次Parent构造函数
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

function object(o) {
  function F() {}
  F.prototype = o
  return new F()
}

function prototype(child, parent) {
  var prototype = object(parent.prototype)
  prototype.constructor = child
  child.prototype = prototype
}

//使用的时候
prototype(Child, Parent)

//开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。
//原因：Parent只调用一次，Parent原型上不会出现多余属性，并且原型链保持不变，instanceof和isPropertyOf还能使用