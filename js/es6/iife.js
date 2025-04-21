// 自执行函数
// eg1.
(function () {
  console.log(1)
})();

// eg2.
(function () {
  console.log(1)
})();

// eg3.
(() => {
  console.log(1)
})()

// eg4. 报错
/* (()=>{
  console.log(1)
}())
 */
