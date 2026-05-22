// 递归柯里化草稿（逻辑不完整，仅供对比 v2 思路）
function curry(fn, args) {
  const length = fn.length // 应为原函数形参个数
  args = args || []

  return function () {
    const _args = args.slice(0)
    let arg; let i
    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i]
      _args.push(arg)
    }
    if (_args.length < length) {
      curry.apply(this, fn, _args)
    }
    else {
      curry.apply(this, _args)
    }
  }
}

const fn = curry((a, b, c) => {
  console.log([a, b, c])
})
fn('a', 'b', 'c') // ["a", "b", "c"]
fn('a', 'b')('c') // ["a", "b", "c"]
fn('a')('b')('c') // ["a", "b", "c"]
fn('a')('b', 'c') // ["a", "b", "c"]
