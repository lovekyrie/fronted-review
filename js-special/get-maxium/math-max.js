const arr = [6, 4, 1, 8, 2, 11, 23]

let result = arr[0]
for (let i = 1, len = arr.length; i < len; i++) {
  result = Math.max(result, arr[i])
}
console.log(result)
