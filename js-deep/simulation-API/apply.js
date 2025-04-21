// eval实现

Function.prototype.apply2 = function (context, arr) {
  var context = new Object(context) || window
  context.fn = this

  let result
  if (!arr) {
    result = context.fn()
  }
  else {
    const args = []
    for (let i = 0, len = arr.length; i < len; i++) {
      args.push(`arr[${i}]`)
    }
    result = eval(`content.fn(${args})`)
  }
  delete context.fn
  return result
}
