function test() {
  console.log(a)

  console.log(foo)
  var a = 2

  function foo() {
    return 2
  }
}

test()