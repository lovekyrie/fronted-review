// js计时器
function count(start, end) {
  let count = start
  console.log(count)
  const timer = setInterval(() => {
    if (count < end) {
      count++
      console.log(count)
    }
  }, 100)

  return {
    cancel: () => {
      clearInterval(timer)
    },
  }
}

count(1, 10)
