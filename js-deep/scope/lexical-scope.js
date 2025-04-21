const value = 1

function foo() {
  console.log(value)
}

function bar() {
  const value = 2
  foo()
}

bar()
