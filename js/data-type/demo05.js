const a = {}
const b = { key: 'b' }
const c = { key: 'c' }

a[b] = 123
a[c] = 456
// 注意这里的b和c用来当作对象的属性，我们知道对象时不能作为键值对的键的，只有字符串和symbol类型的值
// 所以这里会转换成[object Object]
console.log(b.toString())
console.log(c.toString())

console.log(a[b]) // 所以这时候a[b] = a[c] = 456
