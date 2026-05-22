// DOM 兼容：标准 addEventListener vs IE attachEvent

// 每次调用都检测环境
function addEvent(type, el, fn) {
  if (window.addEventListener) {
    el.addEventListener(type, fn, false);
  } else if (window.attachEvent) {
    el.attachEvent("on" + type, fn);
  }
}

// 惰性：首次检测后替换 addEvent 自身
function addEvent(type, el, fn) {
  if (window.addEventListener) {
    addEvent = function (type, el, fn) {
      el.addEventListener(type, fn, false);
    };
  } else if (window.attachEvent) {
    addEvent = function (type, el, fn) {
      el.attachEvent("on" + type, fn);
    };
  }
}

// IIFE 闭包：启动时分支一次，返回固定实现
var addEvent = (function () {
  if (window.addEventListener) {
    return function (type, el, fn) {
      el.addEventListener(type, fn, false);
    };
  } else if (window.attachEvent) {
    return function (type, el, fn) {
      el.attachEvent("on" + type, fn);
    };
  }
})();
/* 当我们每次都需要进行条件判断，其实只需要判断一次，接下来的使用方式都不会发生改变的时候，想想是否可以考虑使用惰性函数。 */
