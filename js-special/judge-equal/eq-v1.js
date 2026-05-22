// 深比较入口（草稿）：完整版需实现 deepEq 递归键值
function equal(a, b) {
  if (a === b)
    return a !== 0 || 1 / a === 1 / b // 区分 +0 / -0
  if (a == null || b == null)
    return false
  if (a !== a)
    return b !== b // NaN
  const type = typeof a
  if (type !== 'function' && type !== 'object' && typeof b !== 'object')
    return false
  // return deepEq(a, b, ...)  // 对象/数组递归比较
}
