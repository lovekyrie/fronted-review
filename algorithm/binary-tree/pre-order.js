// 前序遍历。怎么区分前序、中序、后序就看根节点在哪个位置
// 输入: [1,null,2,3]
//    1
//     \
//      2
//     /
//    3
// 输出: [1,2,3]
import { mockTree } from "../utils/mock.js"
/**
 *  递归实现
 * @param {*} root
 * @param {*} array
 * @returns
 */
function perOrderTraversal(root, array) {
  if (root) {
    array.push(root.val)
    perOrderTraversal(root.left, array)
    perOrderTraversal(root.right, array)
  }

  return array
}

function noRecursionImpl(root) {
  const result = [] // 输出的结果
  const stack = [] // 需要知道当前的节点
  let current = root
  while(current || stack.length) {
    while(current) {
      result.push(current.val)
      stack.push(current)
      current = current.left
    }
    current = stack.pop()
    current = current.right
  }
  return result
}


console.time('recursion');
console.log(perOrderTraversal(mockTree, []));
console.timeEnd('recursion');

console.time('norecursion');
console.log(noRecursionImpl(mockTree));
console.timeEnd('norecursion');