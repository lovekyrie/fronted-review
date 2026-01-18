/**
 * 二分查找
 * 给定一个有序数组 `arr` 和目标值 `target`，查找目标值的索引。
 * 如果目标值不存在，返回 -1。
 */
/**
 * @param {number[]} arr
 * @param {number} target
 * @return {number}
 */
function binarySearch(arr, target) {
  let left = 0
  let right = arr.length - 1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (arr[mid] === target)
      return mid
    if (arr[mid] < target)
      left = mid + 1
    else right = mid - 1
  }
  return -1
}

// [1, 2, 3, 4, 5] target = 2
