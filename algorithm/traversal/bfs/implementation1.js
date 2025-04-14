function widthTraversal1(node) {
  const queue = [node]
  const nodeList = []
  while (queue.length) {
    const temp = queue.shift()
    nodeList.push(temp)
    temp.children && Array.from(temp.children).forEach(v => queue.push(v))
  }

  return nodeList
}

const parent = document.querySelector('.parent')
console.log(widthTraversal1(parent, []))
