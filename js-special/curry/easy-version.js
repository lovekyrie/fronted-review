//递归版本
function curry(fn, args) {

  var length = args.length
  args = args || []

  return function () {
    var _args = args.slice(0),
      arg, i;
    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i]
      _args.push(arg)
    }
    if (_args.length < length) {
      curry.apply(this, fn, _args)
    } else {
      curry.apply(this, _args)
    }
  }
}

var fn = curry(function (a, b, c) {
  console.log([a, b, c])
})
fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b")("c") // ["a", "b", "c"]
fn("a")("b")("c") // ["a", "b", "c"]
fn("a")("b", "c") // ["a", "b", "c"]