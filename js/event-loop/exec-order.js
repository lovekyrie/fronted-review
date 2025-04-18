/* eslint-disable no-use-before-define */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
setTimeout(() => {
  console.log(a)
}, 0)

var a = 10

console.log(b)
console.log(fn)

var b = 20

/**
 * 虽然这个宏任务晚进入事件栈执行，但是他只需要等待10ms就开始执行
 */
function fn() {
  setTimeout(() => {
    console.log('setTImeout 10ms.')
  }, 10)
}

fn.toString = function () {
  return 30
}

console.log(fn)

/**
 * 虽然这个宏任务会先进入事件栈执行，但是他要等定时20ms才开始执行
 */
setTimeout(() => {
  console.log('setTimeout 20ms.')
}, 20)

fn()
