/* eslint-disable no-console */
import Promise from './promise.js'

const promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve('data')
  })
})

promise.then((res) => {
  console.log(`1:  ${res}`)
  return `${res} next then`
}, (error) => {
  console.log('got error from promise', error)
}).then((res) => {
  console.log('链式调用的结果', res)
})
