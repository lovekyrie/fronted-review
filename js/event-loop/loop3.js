async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')
async1()
console.log('script end')

// 注意script end 会比async1 end先打印 (从明面上看就是会跳出当前async1的执行，直接事件栈中没有东西需要处理后，还会再回来处理)
// 通过babel转义的结果可以看出来async2语句这边是直接return掉了。
// 然后会有一个_context.next 指向3，代表的是console.log('async1 end')。等待同步事件执行完后还会再回来执行switch case 3:的打印。
