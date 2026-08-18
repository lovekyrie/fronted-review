# Array method — map

```javascript
// Implement Array.map with a loop. A neat trick: use `this` to get the array that called map
function selfMap(fn, context) {
  const arr = Array.prototype.slice.call(this)
  const mappedArr = new Array()
  for (i = 0, len = arr.length; i < len; i++) {
    // Skip holes in sparse arrays
    if (!arr.hasOwnProperty(i))
      continue
    mappedArr[i] = fn.call(context, arr[i], i, arr)
  }
  return mappedArr
}

Array.prototype.selfMap = selfMap
console.log([1, 2, 3].selfMap(item => item * 2))
/* Note: the second argument of map is `this` inside the callback.
   If the first argument is an arrow function, setting this thisArg is ignored because of lexical this. */
```
