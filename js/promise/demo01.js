const doSomething = () => new Promise(resolve => resolve(1))

function doSomethingElse() {
  return new Promise((resolve, reject) => {
    reject(new TypeError('2'))
  })
}

function doThirdThing() {
  return new Promise((resolve, reject) => {
    console.log('result will 3')
    resolve(3)
  })
}

doSomething()
  .then(res => doSomethingElse(res))
  .then(result => doThirdThing(result))
  .catch(error => console.error(error))
