// 求将数组参数中的对象以总成绩(包括属性"chinese"、"math"、"english")从高到低进行排序并返回
function sortScore(arr) {
  return arr.sort((a, b) => {
    const totalA = a.chinese + a.math + a.english
    const totalB = b.chinese + b.math + b.english
    return totalB - totalA
  })
}

console.log(sortScore([{ chinese: 95, math: 90, english: 53 }, { chinese: 95, math: 81, english: 79 }]))
