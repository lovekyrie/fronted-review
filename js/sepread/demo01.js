// 注意：这里看起来虽然是深拷贝了，但是这边的对象的属性值都是primitive type.
// 如果是 nested structures object。那么就还是shallow copy(可以参考demo02)
const a = { a: 1 }
const b = { b: 1 }

const c = { ...a, ...b }
const d = Object.assign({}, a, b)
const e = Object.assign(a, b)

a.a = 2

console.log(c.a)
console.log(d.a)
console.log(e.a)
console.log(e?.e)
