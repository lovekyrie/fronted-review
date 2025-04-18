global.gc()
console.log(process.memoryUsage().heapTotal)

const wm = new WeakMap()
let key = new Array(5 * 1024 * 1024)
wm.set(key, 1)
global.gc()
console.log(process.memoryUsage().heapTotal)

key = null
global.gc()
console.log(process.memoryUsage().heapTotal)