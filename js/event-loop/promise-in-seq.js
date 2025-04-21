function f1(init) {
  return console.log(init)
}
new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('f1 running')
    // resolve(f2())的时候，任务队列为空。f2的setTimeout进入宏任务的setTimeout队列。并开始执行，所以f2 running紧接着f1 running后面输出
    resolve(f2())
  }, 1000)
})

function f2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('f2 running')
      resolve(2)
    }, 1000)
  })
}

const array = [f1, f2]
function runPromiseInSeq(array, initVal) {
  return array.reduce((prev, next) => prev.then(next), Promise.resolve(initVal))
}

runPromiseInSeq(array, 'init')
