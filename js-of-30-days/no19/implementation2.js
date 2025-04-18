/**
 * @param {Array<Function>} functions
 * @return {Promise<any>}
 */
function promiseAll(functions) {
  return new Promise((resolve, reject) => {
    const len = functions.length
    let promiseReslen = 0
    const results = Array.from({ length: len }).fill(null)
    try {
      for (let i = 0; i < len; i++) {
        functions[i]().then((res) => {
          results[i] = res
          promiseReslen++
          // 之前的比较有问题，results.length 已经等于len了，所以在进行了一次循环后直接返回了
          if (len === promiseReslen) {
            resolve(results)
          }
        }, reject)
      }
    }
    catch (error) {
      reject(error)
    }
  })
}

const functions = [
  () => new Promise(resolve => setTimeout(() => resolve(4), 50)),
  () => new Promise(resolve => setTimeout(() => resolve(10), 150)),
  () => new Promise(resolve => setTimeout(() => resolve(16), 100)),
]
promiseAll(functions).then((res) => {
  console.log(res)
})
