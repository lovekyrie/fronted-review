// Set 类似于数组，但是成员的值是唯一的
console.time('set')
const arr = [1, 2, 1, 1, '1']
function unique(array) {
  return Array.from(new Set(array))
}

console.log(unique(arr))
console.timeEnd('set')

// demo2
console.log(unique([Number.NaN, Number.NaN])) // [NaN]
// Set任务尽管NaN===NaN为false，但是这两个元素是重复的，所以会去重

/* 简化版本：
 return [...new Set(array)]

 var unique=(a)=>[...new Set(a)] */

// Map
function unique1(array) {
  const seen = new Map()
  return array.filter(a => !seen.has(a) && seen.set(a, 1))
}
console.time('map')
console.log(unique1(arr))
console.timeEnd('map')
