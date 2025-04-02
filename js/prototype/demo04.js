function Person(name) {
  this.name = name
}

// constructor变成了可枚举属性
Person.prototype = {
  constructor: Person,
  getName: function() {
    return this.name
  }
}

const person = new Person('dyp')
for(let key in person) {
  // name constructor getName
  console.log(key);
}

Object.defineProperty(Person.prototype, 'constructor', {
  value: Person,
  enumerable: false,
})

for(let key in person) {
  // name getName
  console.log(key);
}

