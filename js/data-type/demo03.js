const arr = ['1', '2', '3']

// push方法返回的是数组的长度
const newArr = arr.push(['4', '5', '6'])
console.log(newArr)

// 注意这里如果我们用+拼接arr.slice(-1),也是会进行类型转换的。按对象转换成字符串方式
console.log(`拼接后的数组：${arr.slice(-1)}`)
