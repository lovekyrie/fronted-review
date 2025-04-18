const curry3 = (fn, placeholder = '_') => {
  curry3.placeholder = placeholder
  if (fn.length <= 1) return fn
  let argsList = []
  const generator = (...args) => {
    let currentPlaceholderIndex = -1
    args.forEach(arg => {
      let placeholderIndex = argsList.findIndex(item => item === curry3.placeholder)
      if (placeholderIndex < 0) {
        //如果数组中没有占位符直接往数组末尾放入一个元素
        currentPlaceholderIndex = argsList.push(arg) - 1
        //防止将元素填充到当前轮参数的占位符
        //(1, '_')('_', 2) 数字2应该填充到1后面的占位符，不能是2前面的占位符
      } else if (placeholderIndex !== currentPlaceholderIndex) {
        argsList[placeholderIndex] = arg
      } else {
        argsList.push(arg)
      }
    })
    let realArgsList = argsList.filter(arg => arg !== curry3.placeholder)
    if (realArgsList.length === fn.length) {
      return fn(...argsList)
    } else if (realArgsList.length > fn.length) {
      throw new Error('超出初始函数参数最大值')
    } else {
      return generator
    }
  }
  return generator
}

var fn = curry3(function (a, b, c) {
  console.log([a, b, c])
})
fn('a', '_', 'c')('b')

let display = (a, b, c, d, e, f, g, h) => console.log([a, b, c, d, e, f, g, h])
const curriedDisplay = curry3(display)
curriedDisplay('_', 2)(1, '_')(3)(4, '_', )('_', 5)(6)(7, 8)
/* 通过占位符能让柯里化更加灵活， 实现思路是， 每一轮传入的参数先去填充上一轮的占位符，
 如果当前轮参数含有占位符， 则放到内部保存的数组末尾， 当前轮的元素不会去填充当前轮参数的占位符， 只会填充之前传入的占位符 */