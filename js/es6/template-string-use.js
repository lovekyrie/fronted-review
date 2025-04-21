// 模版字符串应用，感觉作用是动态输出网页
const x = 'Hi'
const y = 'Kevin'
const res = message`${x}, I am ${y}`

function message(literals, value1, value2) {
  console.log(literals)
  console.log(value1)
  console.log(value2)
}

function message1(literals, ...values) {
  // 这里的i是currentIndex
  const res = literals.reduce((prev, next, i) => {
    const value = values[i - 1]
    return prev + value + next
  })
  return res
}
const res1 = message1`${x}, I am ${y}`
