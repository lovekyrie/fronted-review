// underscore版本的flatten实现
console.time('underscore')
const arr = [1, [2, [3, 4]]]
/**
 *
 * @param {*} input 要处理的数据
 * @param {*} shallow 是否只扁平化一层
 * @param {*} strict  是否严格处理，为true时不处理非数组元素
 * @param {*} output 用于递归
 */
function flatten(input, shallow, strict, output) {
  // 递归用到ouput
  output = output || []
  let idx = output.length

  // 循环处理input
  for (let i = 0, len = input.length; i < len; i++) {
    const value = input[i]
    // 是数组
    if (Array.isArray(value)) {
      if (shallow) {
        // shallow 扁平化一层
        const j = 0
        const length = value.length
        while (j < length) {
          output[idx++] = value[j]
        }
      }
      else {
        // 全部扁平化,传入已经处理的output,所以要初始化idx为output.length
        flatten(value, shallow, strict, output)
        idx = output.length
      }
    }
    else if (!strict) {
      // 不是数组
      output[idx++] = value
    }
  }
  return output
}
console.log(flatten(arr, false, false))
console.timeEnd('underscore')

module.exports = flatten
