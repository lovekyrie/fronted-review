// 根据包名，在指定空间中创建对象
function namespace(oNamespace, sPackage) {
  // 将包名转换为数组
  const aPackage = sPackage.split('.')
  // 遍历数组
  for (let i = 0; i < aPackage.length; i++) {
    // 如果对象中不存在该属性，则创建一个空对象
    const ele = aPackage[i]
    // 如果对象中不存在该属性，则创建一个空对象
    if (!oNamespace[ele]) {
      oNamespace[ele] = {}
    }
    // 将oNamespace指向当前对象
    oNamespace = oNamespace[ele]
  }
  return oNamespace
}
