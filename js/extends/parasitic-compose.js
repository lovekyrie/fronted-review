function clone (parent, child) {
  // 这里改用Object.create方式就可以解决组合继承中调用了两次Parent的情况
  child.prototype = Object.create(parent.prototype)
  child.prototype.constructor = child
}

function Parent() {
  this.name = 'parent'
  this.play = [1, 2, 3]
}
Parent.prototype.getName = function() {
  return this.name
}

function Child() {
  Parent.call(this)
  this.friends = 'child'
}

clone(Parent, Child)
Child.prototype.getFriends = function() {
  return this.friends
}

const person = new Child()
const person1 = new Child()
person.play.push(4)

console.log(person.play);
console.log(person1.play);