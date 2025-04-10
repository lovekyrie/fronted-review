// underscore防抖实现
var count = 1;
var container = document.getElementById("container");
function getUserAction() {
  container.innerHTML = count++;
}
var setUseAction = debounce(getUserAction, 1000, false);
container.onmousemove = setUseAction;

document.getElementById("button").addEventListener("click", function () {
  setUseAction.cancel();
});

function debounce(fn, wait, immediate) {
  var timeout, result;

  return function () {
    var context = this;
    var args = arguments;

    if (timeout) {
      clearTimeout(timeout);
    }
    if (immediate) {
      //立即执行，如果执行过，则不执行
      var callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) {
        result = fn.apply(context, args);
      }
    } else {
      timeout = setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    }
    return result;
  };

  debounce.cancel = function () {
    clearTimeout(timeout);
    timeout = nul;
  };

  return debounce;
}
