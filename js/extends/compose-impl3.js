/**
 * 组合继承 （组合了第一种原型继承和第二种构造函数继承）
 */
function Parent() {
  this.name = 'parent'
  this.play = [1, 2, 3]
}

Parent.prototype.getName = function () {
  return this.name
}

function Child() {
  // 第二次调用Parent
  Parent.call(this)
  this.type = 'child'
}

// 第一次调用Parent
Child.prototype = new Parent()
Child.prototype.constructor = Child

const child = new Child()
const child1 = new Child()
child.play.push(4)
console.log(child.play, child1.play)

console.log(child.getName())
console.log(child1.getName())
