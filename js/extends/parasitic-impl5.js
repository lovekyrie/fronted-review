/**
 * 使用原型式继承可以获得一份目标对象的浅拷贝，
 * 然后利用这个浅拷贝的能力再进行增强，添加一些方法，这样的继承方式就叫作寄生式继承。
 */

const parent = {
  name: 'parent',
  friends: ['parent1', 'parent2', 'parent3'],
  getName() {
    return this.name
  },
}

function clone(original) {
  const clone = Object.create(original)
  clone.getFriends = function () {
    return this.friends
  }
  return clone
}

const person = clone(parent)
console.log(person.getName())
console.log(person.getFriends())
