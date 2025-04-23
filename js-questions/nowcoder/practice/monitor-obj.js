const ul = document.querySelector('ul')
const person = { sex: '男', age: '25', name: '王大锤', height: 28, weight: 32 }
function render(element) {
  const str = `<li>姓名：<span>${person.name}</span></li>
    <li>性别：<span>${person.sex}</span></li>
    <li>年龄：<span>${person.age}</span></li>
    <li>身高：<span>${person.height}</span></li>
    <li>体重：<span>${person.weight}</span></li>`
  element.innerHTML = str
}
render(ul)
// 补全代码
Object.keys(person).forEach((key) => {
  let value = person[key]
  Object.defineProperty(person, key, {
    get() {
      return value
    },
    set(newValue) {
      if (newValue !== value) {
        value = newValue
        render(ul)
      }
    },
  })
})
