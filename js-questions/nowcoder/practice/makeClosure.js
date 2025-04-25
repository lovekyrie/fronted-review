function makeClosures(arr, fn) {
  return arr.reduce((acc, item) => {
    acc.push(() => fn(item))
    return acc
  }, [])
}

const arr = [1, 2, 3]
function fn(item) {
  return item * 2
}
const mark = makeClosures(arr, fn)
console.log(mark[1]() === fn(arr[1]))
