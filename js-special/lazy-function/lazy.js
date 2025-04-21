// 惰性函数
let foo = function () {
  const t = new Date()
  foo = function () {
    return t
  }
  return foo()
}

const first = foo()
const second = foo()
console.log(first)
console.log(second)
