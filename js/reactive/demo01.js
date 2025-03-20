// object.defineProperty无法监听属性为对象或者数组类型
var o = {
  array: [],
}
;(function (o) {
  var obj = { id: 1 }
  var array = []

  Object.defineProperty(o, 'obj', {
    enumerable: true,
    configurable: true,
    configurable: true,
    get: function () {
      return obj
    },
    set: function (val) {
      console.log('set object')
      obj = val
    },
  })

  Object.defineProperty(o, 'arary', {
    enumerable: true,
    configurable: true,
    get: function () {
      return array
    },
    set: function (val) {
      console.log('set array')
      array = val
    },
  })
})(o)

o.obj.id = 2
console.log(o.obj)
o.array.push(1)
console.log(o.array)
