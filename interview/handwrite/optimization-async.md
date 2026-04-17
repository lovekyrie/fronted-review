# Async 异步处理优化

```javascript
// 优雅的处理async/await
async function errorCaptured(asyncFunc) {
  try {
    const res = await asyncFunc()
    return [null, res]
  }
  catch (e) {
    return [e, null]
  }
}

const [err, res] = await errorCaptured(asyncFunc)
/* 防止每次使用前面async/await的时候都要进行一次try/catch,
更加的优雅，这里提供另外一个思路，如果使用了 webpack 可以编写一个 loader，
分析 AST 语法树，遇到 await 语法，自动注入 try/catch，这样连辅助函数都不需要使用
 */
```
