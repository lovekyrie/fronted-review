// That's why when you pass an object to a function, changes inside the function affect the original object.
const person = {
  name: 'Nicholas',
  age: 20,
}

// obj指传入一个引用 (通过这个引用可以找到堆地址，就是存储的值)
function setName(obj) {
  obj.name = 'Greg' // 修改引用的name值 (这里不同于demo01的地方在于这里修改的是同一个堆地址)
}

setName(person)
console.log(person.name)
