const doSomething = () => new Promise(resolve => resolve(1))

const doSomethingElse = () =>
  new Promise((resolve, reject) => {
    reject(2)
  })

const doThirdThing = () =>
  new Promise((resolve, reject) => {
    console.log('result will 3');
    resolve(3)
  })

doSomething()
  .then(res => doSomethingElse(res))
  .then(result => doThirdThing(result))
  .catch(error => console.error(error))
