// B 同样是闭包：闭包是一个可以访问外部作用域的内部函数，即使这个外部作用域已经执行结束。（🐂🍺完美解释）
const scope = 'global scope'
function checkscope() {
  const scope = 'local scope'
  function f() {
    return scope
  }
  return f
}
checkscope()()
