// 需求： 延迟打印数组[1,2,3,4,5] 每一次打印的初始延迟为1000ms，增长延迟500ms。
// 0s 1
// 1s 2
// 2.5s 3
// 4.5s 4
// 7s 5

const arr = [1, 2, 3, 4, 5]
arr.reduce(async (prev, next, index) => {
  // 因为prev是一个promise，而不是return一个promise的函数，所以不需要执行prev()
  const t = await prev
  const time = index === 0 ? 0 : 1000 + (index - 1) * 500
  return new Promise(res => {
    setTimeout(() => {
      console.log(next)
      res(time)
    }, time)
  })
}, Promise.resolve(0))
