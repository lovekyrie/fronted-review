// eslint-disable-next-line unicorn/no-new-array
console.log(+new Array(17))

// 上面的代码是稀松数组，另外eslint也会直接报错，建议用下面的方式初始化
console.log(+Array.from({ length: 17 }))

// 而且注意这个跟new Array一个空数字是有区别的 (下面这两个都能转成空字符串)
// 先调用valueOf, 在调用toString
console.log(+Array.from({ length: 1 }))
console.log(+[])
