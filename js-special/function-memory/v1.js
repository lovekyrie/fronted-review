// 记忆化：相同参数直接读缓存（犀牛书写法）
function memoize(f) {
  const cache = {}
  return function () {
    const key = arguments.length + Array.prototype.join.call(arguments, ',') // 简易序列化 key
    if (cache[key]) {
      return cache[key]
    }
    else {
      return (cache[key] = f.apply(this, arguments))
    }
  }
}

function add(a, b, c) {
  return a + b + c
}
const memoizeAdd = memoize(add)
console.time('use memoize')
for (var i = 0; i < 10000; i++) {
  memoizeAdd(1, 2, 3)
}
console.timeEnd('use memoize')
console.time('not use memoize')
for (var i = 0; i < 10000; i++) {
  add(1, 2, 3)
}
console.timeEnd('not use memoize')
