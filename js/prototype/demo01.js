const parent = { code: 'p', name: 'parent' }
const child = { __proto__: parent, name: 'child' }

console.log(parent.prototype)
console.log(parent.__proto__)
console.log(child.name)
console.log(child.code)

child.hasOwnProperty('name')
child.hasOwnProperty('code')
