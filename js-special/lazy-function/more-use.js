//dom事件，兼容浏览器写法 常见写法：
function addEvent(type, el, fn) {
  if (window.addEventListener) {
    el.addEventListener(type, fn, false);
  } else if (window.attachEvent) {
    el.attachEvent("on" + type, fn);
  }
}

//利用惰性函数，改写
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

//利用闭包改写
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
