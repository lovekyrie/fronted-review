//函数防抖
const debounce = (
  func,
  time = 100,
  options = {
    leading: true,
    context: null,
  }
) => {
  let timer;
  const _debounce = function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    //默认触发第一次情况
    if (options.leading && !timer) {
      timer = setTimeout(null, time);
      func.apply(options.context, args);
    } else {
      timer = setTimeout(() => {
        func.apply(options.context, args);
        timer = null;
      }, time);
    }
  };

  _debounce.cancel = function () {
    clearTimeout(timer);
    timer = null;
  };

  return _debounce;
};

/* leading 为是否在进入时立即执行一次，原理是利用定时器，
如果在规定时间内再次触发事件会将上次的定时器清除，即不会执行函数并重新设置一个新的定时器，
直到超过规定时间自动触发定时器中的函数
同时通过闭包向外暴露了一个 cancel 函数，使得外部能直接清除内部的计数器
 */
