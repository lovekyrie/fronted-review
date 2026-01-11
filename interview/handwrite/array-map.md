# 数组方法实现 - map

```javascript
// 循环方式实现Array.map 这里有了一个巧妙的方法，通过this获取调用map的数组
function selfMap(fn, context) {
  const arr = Array.prototype.slice.call(this)
  const mappedArr = new Array()
  for (i = 0, len = arr.length; i < len; i++) {
    // 判断稀疏数组情况
    if (!arr.hasOwnProperty(i))
      continue
    mappedArr[i] = fn.call(context, arr[i], i, arr)
  }
  return mappedArr
}

Array.prototype.selfMap = selfMap
console.log([1, 2, 3].selfMap(item => item * 2))
/* 注意：map 的第二个参数为第一个参数回调中的 this 指向，如果第一个参数为箭头函数，那设置第二个 this 会因为箭头函数的词法绑定而失效 */
```
