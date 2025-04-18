//组合继承
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green']
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

Child.prototype = new Parent()
Child.prototype.constructor = Child;

var child1 = new Child('kevin', 18)
child1.colors.push('black')

console.log(child1.name)
console.log(child1.age)
console.log(child1.colors)

var child2 = new Child('daisy', 19)

console.log(child2.name)
console.log(child2.age)
console.log(child2.colors)
// 优点：融合原型链继承和构造函数的优点，是JavaScript最常见的继承模式