//节流的两种实现方式
var count = 1;
var container = document.getElementById("container");
function getUserAction() {
  container.innerHTML = count++;
}

container.onmousemove = throttle2(getUserAction, 3000);
//第一版方式 时间戳
function throttle1(fn, wait) {
  var context, args;
  var previous = 0;

  return function () {
    var now = +new Date();
    context = this;
    args = arguments;
    if (now - previous > wait) {
      fn.apply(context, args); //这种写法保证参数按 xx,xx,xx这样传递，不是数组
      previous = now;
    }
  };
}

//第二版方式 定时器
function throttle2(fn, wait) {
  var context, args, timeout;

  return function () {
    context = this;
    args = arguments;
    if (!timeout) {
      timeout = setTimeout(() => {
        fn.apply(context, args);
        timeout = null;
      }, wait);
    }
  };
}
/* 两种方式比较：
1. 第一种会立即执行，第二种在N秒后执行
2. 第一种时间停止后不再触发，第二种在事件结束后会再触发一次 */
