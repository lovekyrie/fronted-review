/**
 * @param {object | Array} obj
 * @return {object | Array}
 */
function compactObject(obj) {
  function dfs(obj) {
    if (!obj)
      return false
    if (typeof obj !== 'object')
      return obj
    if (Array.isArray(obj)) {
    // 数组 这个方法满足不了示例3的[0]变成[] 把concat改成push不就行了。。
    /**
     * 示例 3：
     * 输入：obj = [null, 0, 5, [0], [false, 16]]
     * 输出：[5, [], [16]]
     * 解释：obj[0], obj[1], obj[3][0], 和 obj[4][0] 包含假值，因此被移除。
     * @returns
     */
      const newArr = []
      for (let i = 0; i < obj.length; i++) {
        const subRes = dfs(obj[i])
        if (subRes) {
          newArr.push(subRes)
        }
      }
      return newArr
    }

    // 对象 (可能嵌套，也是需要递归)
    const newObj = {}

    for (const key in obj) {
      const subRes = dfs(obj[key])
      if (subRes) {
        newObj[key] = subRes
      }
    }
    return newObj
  }

  return dfs(obj)
}

const obj = [null, 0, 5, [0], [false, 16]]
compactObject(obj)
