// instanceof
// 用于检测构造函数的prototype属性是否出现在某个实例对象的原型链上。
// 例如，在表达式left instanceof right，会沿着left的原型链查找，看看是否存在right的prototype对象。
// left.__proto__.__proto__... =?= right.prototype

var obj = { a: 1 }
console.log(obj instanceof Object)
