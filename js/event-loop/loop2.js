console.log('start here')

const foo = () => (new Promise((resolve, reject) => {
  console.log('first promise constructor')

  let promise1 = new Promise((resolve, reject) => {
    console.log('second promise constructor')

    setTimeout(() => {
      console.log('setTimeout here')
      resolve()
    }, 0)

    resolve('promise1')

  })

  resolve('promise0')

  promise1.then(arg => {
    console.log(arg)
  })
}))

foo().then(arg => {
  console.log(arg)
})

console.log('end here')
