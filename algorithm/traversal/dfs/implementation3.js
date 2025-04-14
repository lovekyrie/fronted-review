// 非递归
function deepTraversal3(node) {
  const nodes = []
  const stack = []
  stack.push(node)
  while (stack.length) {
    const item = stack.pop()
    const children = item.children
    nodes.push(item)

    for (let i = children.length - 1; i >= 0; i--) {
      stack.push(item.children[i])
    }
  }

  return nodes
}

const parent = document.querySelector('.parent')
console.log(deepTraversal3(parent))
