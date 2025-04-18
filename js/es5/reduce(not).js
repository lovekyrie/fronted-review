const f1 = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("f1 running");
      resolve(f2());
    }, 1000);
  });

const f2 = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("f2 running");
      resolve(2);
    }, 1000);
  });

const array = [f1, f2];
const runPromiseInSeq = (array, initVal) =>
  array.reduce((prev, next) => prev.then(next), Promise.resolve(initVal));

debugger;
runPromiseInSeq(array, "init");
