const process = require('node:process')

// 每一个setTimeout, setImmediate跟外层的script宏任务一样执行。保证一个宏任务执行完再执行下一个宏任务。
// 此时创建了一个setTimeout task queue
setTimeout(() => {
  console.log('timeout1')
  process.nextTick(() => {
    console.log('timeout1_nextTick')
  })
  new Promise((resolve) => {
    console.log('timeout1_promise')
    resolve()
  }).then(() => {
    console.log('timeout1_then')
  })
})

// 当外层的宏任务执行是，碰到了setImmediate。所以这是宏任务创建的第二个task queue.
setImmediate(() => {
  console.log('immediate1')
  process.nextTick(() => {
    console.log('immediate1_nextTick')
  })
  new Promise((resolve) => {
    console.log('immediate1_promise')
    resolve()
  }).then(() => {
    console.log('immediate1_then')
  })
})

// 因为在此前已经存在一个setTimouet task queue.所以这个宏任务也是直接排在第一个setTimeout的后面
setTimeout(() => {
  console.log('timeout2')
  process.nextTick(() => {
    console.log('timeout2_nextTick')
  })
  new Promise((resolve) => {
    console.log('timeout2_promise')
    resolve()
  }).then(() => {
    console.log('timeout2_then')
  })
})
