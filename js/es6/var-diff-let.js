// 我们会发现，在 for 循环中使用 let 和 var，底层会使用不同的处理方式
const arr = Array.from({ length: 10000 }, (v, i) => i)

console.time('var')
let sum = 0
for (var i = 0, length = arr.length; i < length; i++) {
  sum += i
}
console.timeEnd('var')
console.time('let')
sum = 0
for (let i = 0, length = arr.length; i < length; i++) {
  sum += i
}
console.timeEnd('let')

// eg.2
// 简单的来说，就是在 for (let i = 0; i < 3; i++) 中，即圆括号之内建立一个隐藏的作用域，这就可以解释为什么:
for (let i = 0; i < 3; i++) {
  const i = 'abc'
  console.log(`let:${i}`)
}
// abc
// abc
// abc

for (var i = 0; i < 3; i++) {
  var i = 'abc'
  console.log(`var:${i}`)
}
// abc
