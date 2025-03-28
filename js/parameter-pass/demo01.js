var person = {
  name: 'Nicholas',
  age: 20,
}

// obj指传入一个引用 (相当于与指向person堆内存地址的栈内存的副本)
function setName(obj) {
  obj = {} // 将传入的引用指向另外的值 (这里开辟了新的堆地址，所以与原来的person引用地址再无瓜葛)
  obj.name = 'Greg' // 修改引用的name值
}

setName(person)
console.log(person.name)
