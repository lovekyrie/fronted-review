/* es6迭代器：  所谓迭代器就是一个拥有next方法的对象，每次调用next()都会返回一个结果对象，
  该结果对象有两个属性，value表示当前的值，done表示是否遍历结束
 */
function createIterator(items) {
  let i = 0
  return {
    next() {
      const done = i >= items.length
      const value = !done ? items[i++] : undefined
      return {
        value,
        done,
      }
    },
    return() {
      console.log('执行了return方法')
      return {
        value: 23333,
        done: true,
      } // return必须返回对象，但是在浏览器并不会生效
    },
  }
}
// interator现在是一个迭代器
const iterator = createIterator([1, 2, 3])

console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())

// for of
const obj = {
  a: 1,
}
obj[Symbol.iterator] = function () {
  return createIterator([1, 2, 3])
}

for (value of obj) {
  if (value == 1)
    break
  console.log(value)
}
// 执行了return方法

// 默认可遍历对象
const colors = ['red', 'green', 'blue']
for (const color of colors) {
  console.log(color)
}
// 尽管我们没有手动添加 Symbol.iterator 属性，还是可以遍历成功，
// 这是因为 ES6 默认给数组部署了 Symbol.iterator 属性，当然我们也可以自行修改
colors[Symbol.iterator] = function () {
  return createIterator([1, 2, 3])
}
for (const color of colors) {
  console.log(color)
}
/* 除了数组之外，还有一些数据结构默认部署了System.iterator属性
  所以for...of循环可以使用的范围包括：
  1. 数组
  2. Set
  3. Map
  4. 类数组对象，如arguments,DOM NodeList对象
  5. Generator对象
  6. 字符串
*/

// 模拟实现
function forOf(obj, cb) {
  let iterable, result

  if (typeof obj[Symbol.iterator] !== 'function')
    throw new Error(`${result} is not iterable`)
  if (typeof cb !== 'function')
    throw new Error('cb must be callable')

  iterable = obj[Symbol.iterator]()

  result = iterable.next()
  while (!result.done) {
    cb(result.value)
    result = iterable.next()
  }
}
forOf([4, 5, 6], console.log)

// 内建迭代器
/* ES6为数组、Map、Set集合内建了以下三种迭代器
  1. entries()返回一个遍历器对象，用来遍历[键名,键值]组成的数组。对于数组，键名就是索引值
  2. keys()返回一个遍历器对象，用来遍历所有的键名
  3. values()返回一个遍历器对象，用来遍历所有的键值
*/
for (const index of colors.keys()) {
  console.log(index)
}
// 0
// 1
// 2
for (const color of colors.values()) {
  console.log(color)
}
// red
// green
// blue
for (const item of colors.entries()) {
  console.log(item)
}
// [0,'red']
// [1,'green']
// [2,'blue']

// Map类型与数组类似，但是对于Set类型需要注意以下：
const colors1 = new Set(['red', 'green', 'blue'])

for (const index of colors1.keys()) {
  console.log(index)
}

// red
// green
// blue

for (const color of colors1.values()) {
  console.log(color)
}

// red
// green
// blue

for (const item of colors1.entries()) {
  console.log(item)
}

// [ "red", "red" ]
// [ "green", "green" ]
// [ "blue", "blue" ]

// Set类型的keys()和values()返回的是相同的迭代器，这也意味着在Set这种数据结构中键名与键值相同。
/* 而且每个集合类型都有一个默认的迭代器，
在for - of 循环中， 如果没有显式指定则使用默认的迭代器。
数组和Set集合的默认迭代器是values()方法， Map集合的默认迭代器是entries()方法。
这也就是为什么直接 for of 遍历Set和Map数据结构，会有不同的数据结构返回： */

const valuesSet = new Set([1, 2, 3])
for (const value of valuesSet) {
  console.log(value)
}
// 1
// 2
// 3
const valuesMap = new Map([
  ['key1', 'value1'],
  ['key2', 'value2'],
])
for (const value of valuesMap) {
  console.log(value)
}

// 遍历Map数据结构的时候可以顺便结合解构赋值：
const valuesMap1 = new Map([
  ['key1', 'value1'],
  ['key2', 'value2'],
])
for (const [key, value] of valuesMap1) {
  console.log(`${key}:${value}`)
}

module.exports = forOf
