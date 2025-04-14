function Person(name) {
  this.name = name
}

// constructor变成了可枚举属性
Person.prototype = {
  constructor: Person,
  getName() {
    return this.name
  },
}

const person = new Person('dyp')
for (const key in person) {
  // name constructor getName
  console.log(key)
}

Object.defineProperty(Person.prototype, 'constructor', {
  value: Person,
  enumerable: false,
})

for (const key in person) {
  // name getName
  console.log(key)
}
