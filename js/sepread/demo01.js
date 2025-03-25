const a = {a: 1}
const b = {b: 1}

const c = {...a, ...b}
const d = Object.assign({}, a, b)
const e = Object.assign(a, b)

a.a = 2

console.log(c.a)
console.log(d.a)
console.log(e.a)
console.log(e?.e)