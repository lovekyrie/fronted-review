const map = new Map()
const weakMap = new WeakMap();
(function test() {
  const foo = { foo: 1 }
  const bar = { bar: 2 }

  map.set(foo, 1)
  weakMap.set(bar, 2)
})()

console.log(map.keys())
// WeakMap没有这个方法keys
// console.log(weakMap.keys())
