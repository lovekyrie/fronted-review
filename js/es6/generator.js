function* test(n0) {
  let n1 = yield n0;
  let n2 = yield n1;
  let n3 = yield n2;
  return [n0, n1, n2, n3];
}

var a = test(0);
console.log(a.next());
console.log(a.next(1));
console.log(a.next(2));
console.log(a.next(3));

//如果我们去掉* yield语法糖，用朴素的函数表示
function test(n0) {
  //callback是闭包，所以能储存值
  let callback = () => {
    return {
      value: n0,
      next: (n1) => {
        return {
          value: n1,
          next: (n2) => {
            return {
              value: n2,
              next: (n3) => {
                return { value: [n0, n1, n2, n3] };
              },
            };
          },
        };
      },
    };
  };
  let next = (arg) => {
    if (!callback) return { value: result, done: true };
    let { value, next } = callback(arg);
    callback = next;
    result = value;
    return { value, done: !callback };
  };
  return { next };
}
a = test(0);
console.log(a.next());
console.log(a.next(1));
console.log(a.next(2));
console.log(a.next(3));
