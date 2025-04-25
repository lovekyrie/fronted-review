function commonParentNode(oNode1, oNode2) {
  // 获取oNode1的父节点
  while (!oNode1.contains(oNode2)) {
    oNode1 = oNode1.parentNode
  }
  return oNode1
}
