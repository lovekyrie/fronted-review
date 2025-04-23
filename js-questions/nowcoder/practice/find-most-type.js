function _findMostType(array) {
  // 补全代码
  const map = new Map()
  array.forEach((item) => {
    const type = typeof item
    map.set(type, (map.get(type) || 0) + 1)
  })
  // 返回['string', 'number', 2] 这种格式
  let mostTypeArr = []
  Array.from(map.entries()).reduce((acc, [type, count]) => {
    if (count >= acc.count) {
      mostTypeArr = !mostTypeArr.length ? [type, count] : [type, ...mostTypeArr]
      return { type, count }
    }
    return acc
  }, { type: '', count: 0 })
  return mostTypeArr
}

// 这一种比第二种第三种效率低了100倍
console.time('implementation1')
console.log(_findMostType([1, 2, '', '', undefined, Symbol('1'), BigInt(4)]))
console.timeEnd('implementation1')

function _findMostType2(array) {
  const obj = {}
  let num = 0
  let arr = []
  for (const key of array) {
    const type = typeof key
    if (obj[type]) {
      obj[type]++
    }
    else {
      obj[type] = 1
    }
    if (obj[type] > num) {
      num = obj[type]
    }
  }
  for (const key in obj) {
    arr = obj[key] === num ? [key, ...arr] : arr
  }
  return [...arr, num]
}

console.time('implementation2')
console.log(_findMostType2([1, 2, '', '', undefined, Symbol('1'), BigInt(4)]))
console.timeEnd('implementation2')

function _findMostType3(array) {
  const map = new Map()
  let max = 0
  const arr = []
  for (const key of array) {
    const type = typeof key
    if (map.has(type)) {
      map.set(type, map.get(type) + 1)
      max = Math.max(max, map.get(type))
    }
    else {
      map.set(type, 1)
    }
  }
  for (const key of map.keys()) {
    if (map.get(key) === max) {
      arr.push(key)
    }
  }
  return [...arr, max]
}
// 最优
console.time('implementation3')
console.log(_findMostType3([1, 2, '', '', undefined, Symbol('1'), BigInt(4)]))
console.timeEnd('implementation3')

// 优化第一种
function optimizedFindMostType(array) {
  // 补全代码
  let max = 0
  const map = new Map()
  const mostTypeArr = []
  array.forEach((item) => {
    const type = typeof item
    map.set(type, (map.get(type) || 0) + 1)
    max = Math.max(max, map.get(type))
  })
  // 返回['string', 'number', 2] 这种格式
  map.forEach((count, type) => {
    if (count === max) {
      mostTypeArr.push(type)
    }
  })
  return [...mostTypeArr, max]
}

console.time('optimizedFindMostType')
console.log(optimizedFindMostType([1, 2, '', '', undefined, Symbol('1'), BigInt(4)]))
console.timeEnd('optimizedFindMostType')
