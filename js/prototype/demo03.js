const a = {}
console.log(a.__proto__ === Object.prototype)

const b = {}
console.log(b.__proto__ === a.__proto__)
