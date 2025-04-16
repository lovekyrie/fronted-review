function Animal(name) {
  this.name = name
}
Animal.prototype.data = { height: 30 }
const animal1 = new Animal('猴子')

console.log(Object.getPrototypeOf(animal1))
console.log(Object.getPrototypeOf(Animal.prototype))
