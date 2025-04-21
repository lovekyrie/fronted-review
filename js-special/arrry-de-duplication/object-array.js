// 去除对象数组
const arr = [
  1,
  1,
  '1',
  '1',
  null,
  null,
  undefined,
  undefined,
  new String('1'),
  new String('1'),
  /a/,
  /a/,
  Number.NaN,
  Number.NaN,
]

function unique(array) {
  const obj = {}
  return array.filter((item, index, array) => {
    return obj.hasOwnProperty(typeof item + JSON.stringify(item))
      ? false
      : (obj[typeof item + JSON.stringify(item)] = true)
  })
}

console.log(unique(arr))

// 看似已经万无一失，但考虑到 JSON.stringify 任何一个正则表达式的结果都是 {}，所以这个方法并不适用于处理正则表达式去重。(引用勘误 )
// 就比如把上面第二个/a/改成/b/仍然会被过滤掉
console.log(JSON.stringify(/a/)) // {}
console.log(JSON.stringify(/b/)) // {}
