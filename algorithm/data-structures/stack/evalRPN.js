/**
 * 根据逆波兰表示法（后缀表达式），求表达式的值。有效的算符包括 `+`、`-`、`*`、`/` 。
 */

/**
 * 解题思路
 * 遍历表达式：
 * - 遇到数字：压入栈。
 * - 遇到算符：弹出栈顶的两个数字进行运算，并将结果压回栈。
 */
/**
 * @param {string[]} tokens
 * @return {number}
 */
function evalRPN(tokens) {
  const stack = []
  for (const token of tokens) {
    if (!Number.isNaN(token)) {
      stack.push(Number(token))
    }
    else {
      const b = stack.pop()
      const a = stack.pop()
      switch (token) {
        case '+': stack.push(a + b)
          break
        case '-': stack.push(a - b)
          break
        case '*': stack.push(a * b)
          break
        case '/': stack.push(Number.parseInt(a / b))
          break // 向零截断
      }
    }
  }
  return stack.pop()
}

console.log(evalRPN(['2', '1', '+', '3', '*']))
console.log(evalRPN(['4', '13', '5', '/', '+']))
console.log(evalRPN(['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']))
