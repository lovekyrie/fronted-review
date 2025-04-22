function _isSameSet(s1, s2) {
  // 补全代码 s1, s2就是set
  if (s1.size !== s2.size) {
    return false
  }
  return [...s1].every(item => s2.has(item))
}
