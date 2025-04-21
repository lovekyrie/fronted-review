// 手写实现new
function Otaku(name, age) {
  this.name = name
  this.age = age

  this.habit = 'Games'
}

Otaku.prototype.strength = 60

Otaku.prototype.sayYourName = function () {
  console.log(`I am ${this.name}`)
}

function objectFactory() {
  const obj = new Object()
  Constructor = [].shift.call(arguments)
  obj.__proto__ = Constructor.prototype
  Constructor.apply(obj, arguments)
  return obj
}

const person = objectFactory(Otaku, 'kevin', 31)

console.log(person.name)
console.log(person.age)
console.log(person.strength)

person.sayYourName()
