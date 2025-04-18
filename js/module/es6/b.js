// 需要在package.json中type设置为module
import { a } from './a.js'

console.log(a)
setTimeout(() => {
  console.log(a)
}, 1000)
