// underscore防抖实现
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

  return function () {
    const context = this
    const args = arguments

    if (timeout) {
      clearTimeout(timeout)
    }
    if (immediate) {
      // 立即执行，如果执行过，则不执行
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

  debounce.cancel = function () {
    clearTimeout(timeout)
    timeout = nul
  }

  return debounce
}
