import Promise from './promise.js'

const promise = new Promise((resolve) => {
  console.log('我在then 前面就打印了')
  resolve('data')
})

promise.then((res) => {
  console.log(res)
})
console.log(1)
