function sumIntervals(intervals) {
  // 首先对区间按照起始点排序
  intervals.sort((a, b) => a[0] - b[0])

  // 合并重叠区间
  const merged = []
  let current = intervals[0]

  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i]
    // 如果当前区间和下一个区间重叠
    if (current[1] >= next[0]) {
      // 合并区间，取最大的结束点
      current[1] = Math.max(current[1], next[1])
    }
    else {
      // 如果不重叠，将当前区间加入结果，并更新当前区间
      merged.push(current)
      current = next
    }
  }
  // 添加最后一个区间
  merged.push(current)

  // 计算总长度
  return merged.reduce((sum, [start, end]) => sum + (end - start), 0)
}

// 测试用例
console.log(sumIntervals([[1, 5], [6, 10]])) // 输出: 8
console.log(sumIntervals([[1, 4], [7, 10], [3, 5]])) // 输出: 7
console.log(sumIntervals([
  [1, 5],
  [10, 20],
  [1, 6],
  [16, 19],
  [5, 11],
])) // 输出: 19
