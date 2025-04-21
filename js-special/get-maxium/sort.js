const arr = [6, 4, 1, 8, 2, 11, 23]

arr.sort((a, b) => {
  return a - b
})
console.log(arr[arr.length - 1])
