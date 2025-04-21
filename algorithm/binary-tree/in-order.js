// 中序遍历
// 输入: [1,null,2,3]
//    1
//     \
//      2
//     /
//    3
// 输出: [1,3,2]
import { mockTree } from '../utils/mock.js'

/**
 *  递归版本
 * @param {*} root
 * @param {*} array
 * @returns
 */
function inOrderTraversal(root, array) {
  if (root) {
    inOrderTraversal(root.left, array)
    array.push(root.val)
    inOrderTraversal(root.right, array)
  }
  return array
}

// 非递归实现
// 取根节点为目标节点，开始遍历
// 1.左孩子入栈 -> 直至左孩子为空的节点
// 2.节点出栈 -> 访问该节点
// 3.以右孩子为目标节点，再依次执行1、2、3

function noRecursionImpl(root) {
  const result = []
  const stack = []
  let current = root
  while (current || stack.length) {
    while (current) {
      stack.push(current)
      current = current.left
    }
    current = stack.pop()
    result.push(current.val)
    current = current.right
  }

  return result
}

console.time('recursion')
console.log(inOrderTraversal(mockTree, []))
console.timeEnd('recursion')

console.time('norecursion')
console.log(noRecursionImpl(mockTree))
console.timeEnd('norecursion')
