// object.defineProperty无法监听属性为对象或者数组类型
const o = {
  array: [],
}
;(function (o) {
  let obj = { id: 1 }
  let array = []

  Object.defineProperty(o, 'obj', {
    enumerable: true,
    configurable: true,
    configurable: true,
    get() {
      return obj
    },
    set(val) {
      console.log('set object')
      obj = val
    },
  })

  Object.defineProperty(o, 'arary', {
    enumerable: true,
    configurable: true,
    get() {
      return array
    },
    set(val) {
      console.log('set array')
      array = val
    },
  })
})(o)

o.obj.id = 2
console.log(o.obj)
o.array.push(1)
console.log(o.array)
