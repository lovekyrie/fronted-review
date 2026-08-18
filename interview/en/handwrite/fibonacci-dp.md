# Fibonacci (dynamic programming)

```javascript
// DP version — pair with the memoized fibonacci note
function fibonacci_DP(n) {
  let res = 1
  if (n === 1 || n === 2)
    return res
  n = n - 2
  let cur = 1
  let pre = 1
  while (n) {
    res = pre + cur
    pre = cur
    cur = res
    n--
  }
  return res
}
```
