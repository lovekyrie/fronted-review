/**
  已知如下数组：
  var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10]
  编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组
 */

const arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10]
function falt(arr, newArr) {
  for (let i = 0; i < arr.length; i++) {
    const elem = arr[i]
    if (Array.isArray(elem)) {
      falt(elem, newArr)
    }
    else {
      newArr.push(elem)
    }
  }
  return newArr
}

const res = falt(arr, [])
res.sort((a, b) => a - b)
const removeRepeatArr = [...new Set(res)]
console.log(removeRepeatArr)
