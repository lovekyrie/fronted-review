//原始值转对象 原始值通过调用String()、Number()或者Boolean构造函数，转换为它们各自包装的对象
// null和undefined例外，当将他们用在一个期望是一个对象的地方都会造成一个类型错误（Typeerror）异常
var a = 1;
console.log(typeof a) //number
var b = new Number(a)
console.log(typeof b) //object