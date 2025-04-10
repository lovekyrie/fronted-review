// 不用eval
Function.prototype._call = function (context) {
  if (context === null || context === undefined) {
    context = globalThis;
  }

  context = new Object(context);
  context.fn = this;
  const args = [];
  Array.prototype.forEach.call(
    Array.prototype.slice.call(arguments, 1),
    (item) => args.push(item)
  );
  const result = context.fn(...args);
  delete context.fn;
  return result;
};

var foo = {
  value: 1,
};

function bar(name, age) {
  console.log(name);
  console.log(age);
  console.log(this.value);
}

bar._call(foo, "kevin", 31);
