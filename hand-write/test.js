import Promise from './promise.js'

const promise = new Promise(resolve => {
  resolve('data')
})

promise.then(res => {
  console.log(res);
})
console.log(1);