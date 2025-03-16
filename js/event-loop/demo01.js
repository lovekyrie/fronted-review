function f1() {
  setTimeout(console.log.bind(null, 1), 0)
}

function f2() {
  Promise.resolve().then(console.log.bind(null, 2))
}

function f3() {
  setTimeout(() => {
    console.log(3)
    f2()
  }, 1000)
}

function f4() {
  Promise.resolve().then(() => {
    console.log(4)
    f1()
  })
}

f3()
f4()
