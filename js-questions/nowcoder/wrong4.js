function A() {}
A.prototype.a = 1
const B = new A()
A.prototype = {
  b: 2,
  c: 3,
}
const C = new A()
A.prototype.d = 4
// 注意看清楚题目，这下面打印了两个实例对象B跟C (牛客网这傻逼题目一点语义都没有)
console.log(B.a)
console.log(B.b)
console.log(C.c)
console.log(C.d)
