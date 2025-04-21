function foo() {
  const a = 2

  return function bar() {
    const b = 9

    return function fn() {
      console.log(a)
    }
  }
}

const bar = foo()
const fn = bar()
fn()
