//函数节流
const throttle = (
  func,
  time = 100,
  options = {
    leading: true,
    trailing: false,
    context: null,
  }
) => {
  let timer;
  let previous = new Date(0).getTime();
  const _throttle = function (...args) {
    let now = +new Date();
    if (!options.leading) {
      //第一次非立即执行
      if (timer) return;
      timer = setTimeout(() => {
        func.apply(options.context, args);
        timer = null;
      }, time);
    } else if (now - previous > time) {
      //第一次立即执行，因为previous为0，任何时间都会大于time
      func.apply(options.context, args);
      previous = now;
    } else if (options.trailing) {
      //最后执行一次
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(options.context, arg);
      }, time);
    }
  };

  _throttle.cancel = function () {
    previous = new Date(0).getTime();
    clearTimeout(timer);
    timer = null;
  };

  return _throttle;
};
