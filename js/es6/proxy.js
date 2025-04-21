/* ES5中的Object.defineProperty这和Proxy有什么关系呢?"个人理解Proxy是Object.defineProperty的增强版,
ES5只规定能够定义属性的属性描述符或访问器.而Proxy增强到了13种"
其他使用场景：Proxy另外还有很多功能,比如在实现验证器的时候,可以将业务逻辑和验证器分离达到解耦,
通过get拦截对私有变量的访问实现私有变量,拦截对象做日志记录，实现微信api的promise化等 */

// 1. hanlder.apply apply可以拦截一个函数（js中函数也是对象，proxy可以拦截函数）的执行，可以用在函数节流中

function proxy(func, time) {
  let previous = new Date(0).getTime()

  const handler = {
    apply(target, context, args) {
      const now = new Date().getTime()
      if (now - previous > time) {
        previous = now
        Reflect.apply(func, context, args)
      }
    },
  }
  return new Proxy(func, handler)
}

// DOM.addEventListener("mousemove", proxy(func, TIME));

// 2. handler.construct contruct可以拦截通过new关键字调用这个函数的操作,我们可以把它用在单例模式中(代码在singleton.js有实现)

// 3. handle.defineProperty defineProperty可以拦截对这个对象的Object.defineProperty操作
// * 注意对象内部的默认的[[SET]]操作(即对这个对象的属性赋值)会间接触发defineProperty和getOwnPropertyDescriptor这2个拦截方法

function onChange(obj, callback) {
  const handler = {
    get(target, key) {
      try {
        return new Proxy(target[key], handler)
      }
      catch (e) {
        Reflect.get(target, key)
      }
    },
    defineProperty(target, key, descriptor) {
      callback()
      return Reflect.defineProperty(target, key, descriptor)
    },
  }
  return new Proxy(obj, handler)
}

const obj = onChange({}, () => {
  console.log('oops')
})
obj.a = {}
obj.a.b = 1
/* 1.这里使用了递归的操作,当需要访问对象的属性时候,会判断代理的对象属性的值仍是一个可以代理的对象就递归的进行代理,
否则通过错误捕获执行默认的get操作
   2.定义了defineProperty的拦截方法,当对这个代理对象的某个属性进行赋值的时候会执行对象内部默认的[[SET]]操作进行赋值,
这个操作会间接触发defineProperty这个方法,随后会执行定义的callback函数
 */
