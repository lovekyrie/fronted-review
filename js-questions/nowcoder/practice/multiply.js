// 求 a 和 b 相乘的值，a 和 b 可能是小数，需要注意结果的精度问题
function multiply(a, b) {
  // 将数字转换为字符串，获取小数位数
  const getDecimalPlaces = (num) => {
    const str = num.toString()
    const decimal = str.indexOf('.')
    return decimal === -1 ? 0 : str.length - decimal - 1
  }

  // 获取两个数的小数位数
  const decimalPlacesA = getDecimalPlaces(a)
  const decimalPlacesB = getDecimalPlaces(b)

  // 将数字转换为整数进行计算 (这里相当于Math.pow(10, decimalPlacesA + decimalPlacesB)) 但是eslint推荐用用**代替
  const multiplier = 10 ** (decimalPlacesA + decimalPlacesB)
  const result = (a * multiplier) * (b * multiplier) / (multiplier * multiplier)

  // 处理精度问题
  return Number(result.toFixed(decimalPlacesA + decimalPlacesB))
}

// 测试用例
console.time('multiply')
console.log(multiply(3.33, 0.0001))
console.timeEnd('multiply')
