Function.prototype._apply = function (context) {
  if (context === null || context === undefined) {
    context = globalThis;
  }

  const context = new Object(globalThis);
  context.fn = this;

  let result; //undefined
  if (!arguments[1]) {
    result = context.fn();
  } else {
    result = context.fn(...arguments[1]);
  }

  delete context.fn;
  return result;
};
