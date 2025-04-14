/**
 * forEach跟Map的参数一模一样，唯一的区别就是map会返回一个新数组，而forEach返回的是undefined
 * 并且他们都没有for循环快
 * @param1 callback (重要提示：这里的callback期望的是一个同步函数，它不会等待Promise兑现。)
 * @param2 context
 */
[1, 2, 3].map(
  function (value, index, originalArray) {
    console.log(`${index}: ${value} / ${originalArray} /`)
    console.log(this)
    return value + 1
  },
  { test: 1 },
);
// 0: 1 / 1,2,3 / {test: 1}
// 1: 2 / 1,2,3 / {test: 1}
// 2: 3 / 1,2,3 / {test: 1}
// 返回值：[2, 3, 4]

[1, 2, 3].forEach(
  function (value, index, originalArray) {
    console.log(`${index}: ${value} / ${originalArray} /`)
    console.log(this)
  },
  { test: 1 },
)
// 0: 1 / 1,2,3 / {test: 1}
// 1: 2 / 1,2,3 / {test: 1}
// 2: 3 / 1,2,3 / {test: 1}
// 返回值：undefined

// 返回 metrics 中 selected：true 的元素的 id 组成的数组
const metrics = [
  { id: 'sales', selected: true, title: 'Sales' },
  { id: 'units', selected: true, title: 'Units' },
  { id: 'buyers', selected: false, title: 'Buyers' },
]

// 注意：map 遍历数组时，每次都会返回一个值，如果没有显示返回，就返回 undefined
const ids = metrics.map((item) => {
  if (item.selected)
    return item.id
  return undefined
})
console.log(ids) // ['sales','units',undefined]

const ids2 = metrics.map(item => item.selected && item.id)
console.log(ids2) // ['sales','units',false]

const ids3 = metrics.filter(item => item.selected).map(item => item.id)
console.log(ids3) // ['sales','units']

const ids4 = []
metrics.forEach((item) => {
  item.selected && ids4.push(item.id)
})
console.log(ids4)

const ids5 = metrics.reduce((newArr, next) => {
  next.selected && newArr.push(next.id)
  return newArr
}, [])
console.log(ids5)

/**
 * 通过比较ids3跟ids5的获取值方式比较得出，明显ids5的方法是优于ids3的，因为ids5只执行了一次遍历，而ids3是两次
 */
