const process = require('node:process')
// 在Node.js中的事件循环中,process.nextTick的优先级高于Promise.then()
Promise.resolve()
  .then(() => {
    console.log('p1')
  })
  .then(() => {
    console.log('p2')
  })
process.nextTick(() => {
  console.log('n1')
  process.nextTick(() => {
    console.log('n2')
  })
})
