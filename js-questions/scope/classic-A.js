// A 运用了闭包
const scope = 'global scope'
function checkscope() {
  const scope = 'local scope'
  function f() {
    return scope
  }
  return f()
}
checkscope()
