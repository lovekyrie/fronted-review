// 类数组长度
const obj = {
  2: 3,
  3: 4,
  length: 2,
  splice: Array.prototype.splice,
  push: Array.prototype.push,
}
obj.push(1)
obj.push(2)
console.log(obj)
console.log(obj.length)
// 注意类数组的长度只会输出属性值，不会把方法算进去
delete obj.push
console.log(obj.length) // 4
