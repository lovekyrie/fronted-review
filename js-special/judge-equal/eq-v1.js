function equal(a, b) {
  //===结果为true，区别出+0和-0
  if (a === b) return a !== 0 || 1 / a === 1 / b
  //typeof null的结果为object，这里做判断，是为了让有null的情况尽早退出
  if (a == null || b == null) return false
  //判断NaN
  if (a !== a) return b !== b
  //判断参数a类型，如果是基本类型直接退出
  var type = typeof a
  if (type !== 'function' && type !== 'object' && typeof b !== 'object') return false
  // 如果加typeof b!=='function'条件，则a是基本类型b是函数的时候，直接进入deepEq,凭借经验就能得知基本类型跟函数不相等
  //更复杂的对象使用deepEq函数进行比较
  deepEq()
}