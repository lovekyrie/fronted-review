function test() {
  let str = ''
  for (let i = 0; i < 1000; i++) {
    // eslint-disable-next-line prefer-template
    str += ['hello'] + 'world'
  }
  return str
}

function test1() {
  let str = ''
  for (let i = 0; i < 1000; i++) {
    str += 'hello' + 'world'
  }
  return str
}

// 类型转换比较损耗性能
console.time('test')
test()
console.timeEnd('test')

console.time('test1')
test1()
console.timeEnd('test1')
