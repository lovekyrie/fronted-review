//模拟实现第一版extend
function extend() {
  var name, copy, options;
  var i = 1,
    length = arguments.length;
  var target = arguments[0];
  for (; i < length; i++) {
    options = arguments[i];
    for (name in options) {
      copy = options[name];
      if (copy !== undefined) {
        target[name] = copy;
      }
    }
  }
  return target;
}
