// 需要在package.json中type设置为commonjs，或者不设置type
var a = require('./a.js')
console.log(a)
setTimeout(() => console.log(a), 1000)