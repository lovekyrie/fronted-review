//JSON.stringify() 方法可以将一个 JavaScript 值转换为一个 JSON 字符串，实现上也是调用了 toString 方法
//注意点： 1.处理基本类型时，与使用toString基本相同，都是字符串，除了undefined
console.log(JSON.stringify(null)) //null
console.log(JSON.stringify(undefined)) //undefined ,注意该undefined不是字符串undefined
console.log(JSON.stringify(true)) //true
console.log(JSON.stringify(42)) //42
console.log(JSON.stringify('42')) //"42"

// 2.布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值
JSON.stringify([new Number(1), new String('false'), new Boolean(false)]); //"[1,'false',false]"

// 3.undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）。
JSON.stringify({
  x: undefined,
  y: Object,
  z: Symbol("")
}) //"{}"
JSON.stringify([undefined, Object, Symbol("")]) //"[null,null,null]"

// 4. JSON.stringify有第二个参数replacer,它可以是数组或者函数，用来指定对象序列化过程中哪些属性应该被处理，哪些被排除
function replacer(key, value) {
  if (typeof value === 'string') {
    return undefined
  }
  return value
}
var foo = {
  foundation: "Mozilla",
  model: "box",
  week: 45,
  transport: "car",
  month: 7
}
var jsonString = JSON.stringify(foo, replacer)
console.log(jsonString) //{"week":45,"month":7}

console.log(JSON.stringify(foo, ['week', 'month'])) //{"week":45,"month":7}

// 5.如果一个被序列化的对象拥有 toJSON 方法，那么该 toJSON 方法就会覆盖该对象默认的序列化行为：不是那个对象被序列化，而是调用 toJSON 方法后的返回值会被序列化，例如
var obj = {
  foo: 'foo',
  toJSON: function () {
    return 'bar'
  }
}
console.log(JSON.stringify(obj)) //'bar'
console.log(JSON.stringify({
  x: obj
})) //{'x':'bar'}