// 1.强引用
// node --expose-gc 允许手动执行垃圾回收机制 

global.gc()
// 返回 Nodejs 的内存占用情况，单位是 bytes
console.log(process.memoryUsage().heapTotal)

let map = new Map()
let key = new Array(5 * 1024 * 1024)
map.set(key, 1)
global.gc()
console.log(process.memoryUsage().heapTotal)

map.delete(key)
global.gc()
console.log(process.memoryUsage().heapTotal)

key = null
global.gc()
console.log(process.memoryUsage().heapTotal)