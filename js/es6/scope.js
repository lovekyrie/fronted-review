// 块级作用域 存在于1.函数 2.块中(字符{和}之间的区域)

// 临时死区

const value = 'global'; // 全局作用域中的变量跟块级作用域的变量重名 不报错
// eg1.
(function () {
  console.log(value) // ReferenceError: Cannot access 'value' before initialization
  let value = 'local'
})();

// eg2.
(function () {
  const value = 'local' // 闭包里面声明的变量不会跟外面的变量重名？ //因为这里是块级作用域
  console.log(value)
})()

// eg3.
{
  console.log(value) // ReferenceError: Cannot access 'value' before initialization
  let value = 'local'
}
