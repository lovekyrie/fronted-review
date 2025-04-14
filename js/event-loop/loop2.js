console.log('start here')

function foo() {
  return new Promise((resolve, reject) => {
    console.log('first promise constructor')

    const promise1 = new Promise((resolve, reject) => {
      console.log('second promise constructor')

      setTimeout(() => {
        console.log('setTimeout here')
        resolve()
      }, 0)

      resolve('promise1')
    })

    resolve('promise0')

    promise1.then((arg) => {
      console.log(arg)
    })
  })
}

foo().then((arg) => {
  console.log(arg)
})

console.log('end here')
