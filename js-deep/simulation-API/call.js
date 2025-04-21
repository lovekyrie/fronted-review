Function.prototype.call2 = function (context) {
  var context = context || window
  context.fn = this
  const args = []
  for (let i = 1, len = arguments.length; i < len; i++) {
    // 这里只能用拼接 因为这里的值为arguments[1],arguments[2]
    args.push(`arguments[${i}]`)
  }
  // 在eval中，args自动调用Array.toString()方法，效果类似于 var res=context.fn(argument1,argument[2],...)
  const res = eval(`context.fn(${args})`)
  delete context.fn
  return res
}

const foo = {
  value: 1,
}

function bar(name, age) {
  console.log(name)
  console.log(age)
  console.log(this.value)
}

bar.call2(foo, 'kevin', 18)
