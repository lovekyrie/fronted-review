// 惰性函数：首次执行时重写 foo，之后走轻量分支
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
