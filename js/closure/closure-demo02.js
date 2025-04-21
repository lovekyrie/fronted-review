let fn
const m = 20
function foo() {
  const a = 2
  function baz(a) {
    // 这里打印的a是自己的函数作用域，没有返回上级作用域,不形成闭包
    console.log(a)
  }
  fn = baz
}

function bar() {
  fn(m)
}

foo()
bar()
