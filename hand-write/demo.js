function testA() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('testA')
    }, 1000)
  })
}

function testB() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('testB')
    }, 1000)
  })
}

// 并行1：Promise.all + then（完成后再打印）
const start = performance.now()
Promise.all([testA(), testB()]).then((res) => {
  console.log('并行1', res)
  console.log('并行1 耗时 ms', performance.now() - start)
})

// 并行2：先拿到 Promise，再 all（效果同上，写法不同）
const start2 = performance.now()
const p1 = testA()
const p2 = testB()
Promise.all([p1, p2]).then((res) => {
  console.log('并行2', res)
  console.log('并行2 耗时 ms', performance.now() - start2)
})
