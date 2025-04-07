function Parent() {
  this.name = 'parent1'
  this.play = [1, 2, 3]
}

function Child() {
  this.name = 'child1'
}

Child.prototype = new Parent()
const child = new Child()
const child1 = new Child()

child.play.push(4)
console.log(child1.play) // [1, 2, 3, 4]
