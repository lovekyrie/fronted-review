function Parent() {
  this.name = 'parent'
  this.age = 33
  this.getAge = function () {
    return this.age
  }
}

Parent.prototype.getName = function () {
  return this.name
}

function Child() {
  Parent.call(this)
  this.age = 4
  this.type = 'child'
}

// 构造函数方法的继承只能继承父类的实例方法和属性，而不能继承父类原型上的方法跟属性
const child = new Child()
console.log(child.getAge())
console.log(child.getName()) // 会报错，因为getName是parent原型上的方法。
// 而child没有继承Parent.他的原型是继承的Object
