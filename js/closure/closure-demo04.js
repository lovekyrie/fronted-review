function foo() {
  var a = 2

  return function bar() {
    var b = 9

    return function fn() {
      console.log(a, b)
    }
  }
}

var bar = foo()
var fn = bar()
fn()
