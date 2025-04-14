function deepTraversal1(node, nodeList) {
  if (node) {
    nodeList.push(node)
    const children = node.children
    for (let i = 0; i < children.length; i++) {
      deepTraversal1(children[i], nodeList)
    }
  }
  return nodeList
}

const parent = document.querySelector('.parent')
console.log(deepTraversal1(parent, []))
