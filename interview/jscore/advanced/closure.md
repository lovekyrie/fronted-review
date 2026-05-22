# 闭包 (Closure)

## 1. 核心概念

### 定义
**闭包**是指有权访问另一个函数作用域中变量的**函数**。
在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。

简单来说：**闭包 = 函数 + 函数体内可访问的外部变量**。

### 产生原因
JavaScript 采用**词法作用域**（Lexical Scoping），函数的作用域在函数定义时就决定了。
当一个内部函数被返回并在其定义的作用域之外被执行时，它仍然持有对定义时所在作用域的引用，这个引用就是闭包。

## 2. 闭包的表现形式

1.  **函数作为返回值**：
    ```javascript
    function createCounter() {
        let count = 0;
        return function() {
            return ++count;
        };
    }
    const counter = createCounter();
    console.log(counter()); // 1
    console.log(counter()); // 2
    ```

2.  **函数作为参数传递**：
    ```javascript
    function print(fn) {
        const a = 200;
        fn();
    }
    const a = 100;
    function fn() {
        console.log(a);
    }
    print(fn); // 输出 100，而不是 200
    ```
  > fn 定义在全局作用域，所以它里面访问 a 时，会去它“定义时所在的作用域”找 a，也就是全局的 const a = 100。
虽然 fn() 是在 print 里面被调用的，print 里面也有 const a = 200，但这个 a = 200 只属于 print 的局部作用域。fn 不是在 print 里面定义的，所以它不会去拿 print 里的 a。
可以记一句话：
作用域看定义位置，不看调用位置。
所以输出是 100，不是 200。

## 3. 应用场景

### 3.1 模拟私有变量（模块模式）
JavaScript 没有原生的私有属性（ES2019 之前），闭包常用来封装私有变量，防止外部污染。

```javascript
const User = (function() {
    let _password = '123'; // 私有变量

    class User {
        constructor(username) {
            this.username = username;
        }
        login(pwd) {
            return pwd === _password;
        }
    }
    return User;
})();

let u = new User('admin');
console.log(u.username); // 'admin'
console.log(u._password); // undefined
```

### 3.2 柯里化 (Currying)
将多参数函数转换为单参数函数的形式。

```javascript
function add(a) {
    return function(b) {
        return a + b;
    }
}
const add5 = add(5);
console.log(add5(10)); // 15
```

### 3.3 防抖与节流
防抖（Debounce）和节流（Throttle）是闭包在前端性能优化中最经典的应用。

```javascript
function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}
```

### 3.4 once：只执行一次

通过闭包保存 `fn`，首次调用后把 `fn` 置为 `null`，后续走 `replacer`。

```javascript
function once(fn, replacer = null) {
    return function (...args) {
        if (fn) {
            const ret = fn.apply(this, args);
            fn = null;
            return ret;
        }
        if (replacer) {
            return replacer.apply(this, args);
        }
    };
}

const obj = {
    init: once(
        () => {
            console.log('Initializer has been called.');
        },
        () => {
            throw new Error('This method should be called only once.');
        }
    ),
};

obj.init(); // 正常执行
obj.init(); // 抛出 Error: This method should be called only once.
```

**为什么第二次会报错？**

容易误以为：每次 `obj.init()` 都会把箭头函数再传进 `once`。实际上：

1. `once(原函数, replacer)` **只在定义 `init` 时执行一次**，返回的是包装函数。
2. 闭包里的 `fn` 是**可变引用**，第一次调用后 `fn = null`。
3. 第二次 `obj.init()` 调用的是包装函数，`fn` 已为 `null`，走 `replacer` 分支抛错。

| 调用 | 闭包中的 `fn` | 行为 |
|------|---------------|------|
| 第 1 次 | 原函数 | 执行原函数，然后 `fn = null` |
| 第 2 次 | `null` | 执行 `replacer`（此处抛错） |

等价理解：

```javascript
// once 内部大致等价于
let fn = /* 传入的原函数 */;
let replacer = /* 传入的 replacer */;

obj.init = function (...args) {
    if (fn) { /* 用完后 fn = null */ }
    else if (replacer) { /* 第二次走这里 */ }
};
```

> 若不传 `replacer`，第二次调用会静默返回 `undefined`，不会抛错。

## 4. 经典面试题：循环与闭包

**题目**：输出什么？
```javascript
for (var i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}
```
**结果**：输出 5 个 5。
**原因**：`var` 声明的 `i` 是函数级作用域（此处是全局），循环结束后 `i` 变成了 5。`setTimeout` 是异步执行，当它执行时，循环早已结束，访问的都是同一个全局 `i`。

**解决方案**：
1.  **使用 IIFE（立即执行函数）构建闭包**：
    ```javascript
    for (var i = 0; i < 5; i++) {
        (function(j) {
            setTimeout(function() {
                console.log(j);
            }, 1000);
        })(i);
    }
    ```
2.  **使用 `let` (ES6)**：
    ```javascript
    for (let i = 0; i < 5; i++) { // let 创建块级作用域
        setTimeout(function() {
            console.log(i);
        }, 1000);
    }
    ```

## 5. 内存泄漏问题

**误区**：闭包一定会导致内存泄漏？
**真相**：闭包会导致变量常驻内存，这本就是闭包的特性。只有当这些变量不再需要使用，却因为闭包引用而无法被垃圾回收（GC）时，才叫内存泄漏。

**IE 的 Bug**：
在旧版 IE（IE9 之前）中，如果闭包的作用域链中保存着一个 DOM 对象，那么这个 DOM 对象将无法被销毁。
```javascript
function assignHandler() {
    var element = document.getElementById("someElement");
    element.onclick = function() {
        alert(element.id); // 闭包引用了 element，element 又引用了 function，形成循环引用
    };
}
```
**解决**：手动解除引用 `element = null;`。

