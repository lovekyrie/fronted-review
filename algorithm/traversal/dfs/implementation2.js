// 方法2 跟方法1一样采用递归，只是组装数据的方法变化
function deepTraversal2(node) {
  let nodeList = []
  if (node) {
    nodeList.push(node)
    const child = node.children
    for (let i = 0; i < child.length; i++) {
      nodeList = nodeList.concat(deepTraversal2(child[i]))
    }
  }
  return nodeList
}

const parent = document.querySelector('.parent')
console.log(deepTraversal2(parent))
