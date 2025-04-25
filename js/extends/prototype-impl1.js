function Parent() {
  this.name = 'parent1'
  this.play = [1, 2, 3]
}

function Child() {
  this.name = 'child1'
}

Parent.prototype.getName = function () {
  return this.name
}

Child.prototype = new Parent()
const child = new Child()
child.name = 'child'
const child1 = new Child()

child.play.push(4)
console.log(child1.play) // [1, 2, 3, 4]
console.log(child1.name)
console.log(child.getName())
