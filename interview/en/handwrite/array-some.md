# Array method — some

```javascript
// Implement Array.some with a loop
function selfSome(fn, context) {
  const arr = Array.prototype.slice.call(this)
  if (!arr.length)
    return false
  for (let i = 0, len = arr.length; i < len; i++) {
    if (!arr.hasOwnProperty(i))
      continue
    const res = fn.call(context, arr[i], i, arr)
    if (res)
      return true
  }
  return false
}
/* If the array that calls some is empty, the result is always false.
   For every, an empty array always returns true. */
```
