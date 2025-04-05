// map forEach使用
const reporter = {
  report(key, value) {
    console.log(`Key: ${key}, Value: ${value}`)
  },
}

const map = new Map([
  ['name', 'Ana'],
  ['des', 'JS'],
])

// 不能用箭头函数，用了箭头函数的this会指向global
map.forEach(function (value, key, map) {
  this.report(key, value)
}, reporter)
