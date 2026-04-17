/**
 * 给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串 `s` ，判断字符串是否有效。
 * 有效字符串需满足：
 * 1. 左括号必须用相同类型的右括号闭合。
 * 2. 左括号必须以正确的顺序闭合。
 */

/**
 * 解题思路
 * 利用栈的 **后进先出 (LIFO)** 特性。遍历字符串：
 * 遇到左括号，将其对应的右括号压入栈中。
 * 遇到右括号，弹出栈顶元素并判断是否相等。
 * 最后检查栈是否为空。
 */
/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const stack = []
  const map = {
    '(': ')',
    '[': ']',
    '{': '}',
  }

  for (const char of s) {
    if (map[char]) {
      stack.push(map[char])
    }
    else {
      if (stack.pop() !== char)
        return false
    }
  }
  return stack.length === 0
};

console.log(isValid('()'))
console.log(isValid('()[]{}'))
console.log(isValid('(]'))
console.log(isValid('([)]'))
console.log(isValid('{[]}'))
