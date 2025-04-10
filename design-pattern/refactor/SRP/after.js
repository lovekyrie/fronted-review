/**
 * 在 JavaScript 中，需要用到的类的场景并不太多，单一职责原则则是更多地运用在对象或者方法级别上面。
 函数应该做一件事，做好这件事，只做这一件事。 — 代码整洁之道
 * @param {*} val
 * @returns
 */
function getMax(val) {
  return val > MAX_VAL ? MAX_VAL : val;
}

function getSum() {
  for (let i = 0; i < val; i++) {
    doSomething(i);
  }
}

function example(val) {
  return doSomething(getMax(val));
}
