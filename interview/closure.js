function foo() {
  const arr = []
  let i
  for (i = 0; i < 10; i++) {
    arr[i] = function () {
      console.log(i)
    }
  }
  return arr[0]
}

foo()() // 执行顺序的问题，先执行的是foo()，执行完循环才return arr[0],然后才去执行function(){console.log(i)} 这个函数

// 变型
function foo1() {
  const arr = []
  let i
  for (i = 0; i < 10; i++) {
    if (i !== 1)
      continue
    arr[i] = (function (j) {
      console.log(j)
    })(i)
  }
  return arr[0]
}
foo1()
