// 后序遍历
// 输入: [1,null,2,3]
//    1
//     \
//      2
//     /
//    3
// 输出: [3,2,1]
import { mockTree } from '../utils/mock.js'
// 递归实现
function postOrderTraversal(root, array) {
  if (root) {
    postOrderTraversal(root.left, array)
    postOrderTraversal(root.right, array)
    array.push(root.val)
  }

  return array
}
// 非递归实现
// 取根节点为目标节点，开始遍历
// 1.左孩子入栈 -> 直至左孩子为空的节点
// 2.栈顶节点的右节点为空或右节点被访问过 -> 节点出栈并访问他，将节点标记为已访问
// 3.栈顶节点的右节点不为空且未被访问，以右孩子为目标节点，再依次执行1、2、3
function noRecursionImpl(root) {
  const result = []
  const stack = []
  let current = root
  let last = null
  while (current || stack.length) {
    while (current) {
      stack.push(current)
      current = current.left
    }

    // 赋值current
    current = stack[stack.length - 1]
    if (!current.right || current.right == last) {
      current = stack.pop()
      result.push(current.val)
      last = current
      current = null // 让他去执行赋值current这一步。继续把栈顶弹出 (先进后出)
    }
    else {
      current = current.right
    }
  }

  return result
}

console.time('recursion')
console.log(postOrderTraversal(mockTree, []))
console.timeEnd('recursion')

console.time('norecursion')
console.log(noRecursionImpl(mockTree))
console.timeEnd('norecursion')
