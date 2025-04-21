const arr = [6, 4, 1, 8, 2, 11, 23]

// 从这里我们可以看出apply,call等方法不一定要改变this指向，转换参数也可以使用
console.log(Math.max.apply(null, arr)) // 这个写法纯粹是把arr转换成...arr
