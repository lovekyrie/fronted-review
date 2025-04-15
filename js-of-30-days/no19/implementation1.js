/**
 * @param {Array<Function>} functions
 * @return {Promise<any>}
 */
function promiseAll(functions) {
  return new Promise((resolve, reject) => {
    const len = functions.length
    const results = Array.from({ length: len }).fill(null)
    let count = 0
    functions.forEach((el, idx) => {
      el().then((res) => {
        results[idx] = res
        count++
        if (count === len) {
          resolve(results)
        }
      }).catch((err) => {
        reject(err)
      })
    })
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
