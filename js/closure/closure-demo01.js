let fn
function foo() {
  const a = 2
  function baz() {
    console.log(a)
  }
  // 跟return baz一样
  fn = baz
}

function bar() {
  fn()
}

foo()
bar()
