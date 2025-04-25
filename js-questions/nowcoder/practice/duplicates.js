// 在遍历的过程中，每次都去查找 indexOf，时间复杂度为 O(n^2)
function duplicates(arr) {
  return [...new Set(arr.filter((item, index) => arr.indexOf(item) !== index))]
}

// 只遍历一次, 但是同一个元素会出现多次
function duplicates2(arr) {
  const map = new Map()
  const result = []
  for (const item of arr) {
    if (map.has(item)) {
      map.set(item, map.get(item) + 1)
    }
    else {
      map.set(item, 1)
    }
  }
  map.forEach((value, key) => {
    if (value > 1) {
      result.push(key)
    }
  })
  return result
}

console.time('duplicates')
console.log(duplicates([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5]))
console.timeEnd('duplicates')

console.time('duplicates2')
console.log(duplicates2([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5]))
console.timeEnd('duplicates2')
