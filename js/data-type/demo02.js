// instanceof
// 用于检测构造函数的prototype属性是否出现在某个实例对象的原型链上。
// 例如，在表达式left instanceof right，会沿着left的原型链查找，看看是否存在right的prototype对象。
// left.__proto__.__proto__... =?= right.prototype

const obj = { a: 1 }
console.log(obj instanceof Object)

function Person() {}
const p = new Person()
console.log(p instanceof Person)
// p.__proto__ = Person.prototype
// Person.prototype.__proto__ = Object.prototype (可以参考原型链那张图)
// Object.prototype.__proto__ = null
console.log(p instanceof Object)
