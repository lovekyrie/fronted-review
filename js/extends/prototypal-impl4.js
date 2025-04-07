const parent = {
  name: 'parent',
  friends: ['parent1', 'parent2', 'parent3'],
  getName() {
    return this.name
  },
}

const person = Object.create(parent)
person.name = 'tom'
person.friends.push('jerry')

const person1 = Object.create(parent)
person1.friends.push('lucy')

console.log(person.name)
console.log(person.name === person.getName())
console.log(person1.name)
console.log(person.friends) // person value, person1 value has the same value
console.log(person1.friends)
