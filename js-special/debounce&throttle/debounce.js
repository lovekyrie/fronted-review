// 防抖：高频触发只执行最后一次；支持 leading + cancel
let count = 1
const container = document.getElementById('container')
function getUserAction() {
  container.innerHTML = count++
}
const setUseAction = debounce(getUserAction, 1000, false)
container.onmousemove = setUseAction

document.getElementById('button').addEventListener('click', () => {
  setUseAction.cancel()
})

function debounce(fn, wait, immediate) {
  let timeout, result

  const debounced = function () {
    const context = this
    const args = arguments

    if (timeout) {
      clearTimeout(timeout)
    }
    if (immediate) {
      // leading：冷却期内不重复触发
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) {
        result = fn.apply(context, args)
      }
    }
    else {
      timeout = setTimeout(() => {
        fn.apply(context, args)
      }, wait)
    }
    return result
  }

  debounced.cancel = function () {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}
