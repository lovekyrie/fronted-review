/**
 * 每日温度
 * 给定一个整数数组 `temperatures`，表示每天的温度，返回一个数组 `answer`，其中 `answer[i]` 是指在第 `i` 天之后，才等待温度更高的一天所需的天数。如果气温在这之后都不会升高，请在该位置用 `0` 来代替。
 * 例如：
 * 输入: temperatures = [73,74,75,71,69,72,76,73]
 * 输出: [1,1,4,2,1,1,0,0]
 * 解释:
 * - 第 0 天温度为 73，第 1 天温度为 74，所以答案是 1。
 * - 第 1 天温度为 74，第 2 天温度为 75，所以答案是 1。
 * - 第 2 天温度为 75，第 3 天温度为 71，第 4 天温度为 69，第 5 天温度为 72，第 6 天温度为 76，第 7 天温度为 73，所以答案是 4。
 * - 第 3 天温度为 71，第 4 天温度为 69，第 5 天温度为 72，第 6 天温度为 76，第 7 天温度为 73，所以答案是 2。
 */

/**
 * 解题思路
 * 使用单调栈。栈内存储下标，对应温度单调递减。
 * 遍历温度，如果当前温度大于栈顶下标对应的温度，说明找到了栈顶元素之后第一个更高温。
 * 弹出栈顶并计算索引差值。
 */
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
function dailyTemperatures(temperatures) {
  const res = Array.from({ length: temperatures.length }, () => 0)
  const stack = []
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const preIndex = stack.pop()
      res[preIndex] = i - preIndex
    }
    stack.push(i)
  }
  return res
}

// [10, 3, 6, 15]
// i = 0, stack = [0]
// i = 1, stack = [0, 1]
// i = 2, step One: stack = [0], preIndex = 1, res[1] = i - preIndex = 2 - 1 = 1
// i = 2, step Two: stack = [0], 不满足temperatures[2] > temperatures[0]，不弹出栈
// i = 3, step One: stack = [0, 2], temperatures[3] > temperatures[1], 弹出stack[2], res[2] = i - preIndex = 3 - 2 = 1
// i = 3, step Two: stack = [0], 不满足temperatures[3] > temperatures[0]，弹出栈，res[0] = i - preIndex = 3 - 0 = 3
console.log(dailyTemperatures([10, 3, 6, 15]))
