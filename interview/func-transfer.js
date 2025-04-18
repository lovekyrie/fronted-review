function add(...args) {
  let arr = args
  function fn(...newArgs) {
    arr = [...arr, ...newArgs]
    return fn
  }
  fn.toString = fn.valueOf = function () {
    return arr.reduce((acc, cur) => acc + Number.parseInt(cur))
  }

  return fn
}

add(1)
add(1)(2)
add(1, 2)(3, 4, 5)(6)
