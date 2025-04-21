// 原型式继承,就是ES5 Object.create的模拟实现
function createObj(o) {
  function F() {}
  F.prototype = o
  return new F()
}

// 缺点：包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样
const person = {
  name: 'kevin',
  friends: ['daisy', 'kelly'],
}

const person1 = createObj(person)
const person2 = createObj(person)

person1.name = 'person1'
console.log(person1.name)
console.log(person2.name)
delete person1.name
// 修改了person1的值并未改变person2的name值，只是给person1增加了name属性，而不是修改了原型中的值
// 并且原型中的name不允许删除
console.log(person1.name)

person1.friends.push('taylor')
console.log(person2.friends)
