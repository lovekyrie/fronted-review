// 适合err-first风格的异步操作(eg. nodejs)的promisify功能
const fs = require("fs");

function promisify(asyncFunc) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push(function callback(err, ...values) {
        if (err) {
          return reject(err);
        }
        return resolve(...values);
      });
      asyncFunc.call(this, ...args);
    });
  };
}

const fsp = new Proxy(fs, {
  get(target, key) {
    return promisify(target[key]);
  },
});

async function generateCommit() {
  try {
    let data = await fsp.readFile("./promisify.js", "utf-8");
    data += "\n//我是注释";
    await fsp.writeFile("./promisify.js", data);
  } catch (error) {
    console.log(error);
  }
}
generateCommit();

//我是注释
/* promisify 函数是将回调函数变为 promise 的辅助函数，适合 error-first 风格（nodejs）的回调函数，
原理是给 error-first 风格的回调无论成功或者失败，在执行完毕后都会执行最后一个回调函数，
我们需要做的就是让这个回调函数控制 promise 的状态即可
这里还用了 Proxy 代理了整个 fs 模块，拦截 get 方法，使得不需要手动给 fs 模块所有的方法都包裹一层 promisify 函数，更加的灵活 */
