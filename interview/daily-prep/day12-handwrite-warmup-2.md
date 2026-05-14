# Day 12 手写保温 2（防抖/节流 / Promise / EventEmitter / promisify） 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 12 | 手写 2（防抖节流/EventEmitter/promisify） | [debounce](../handwrite/debounce)、[throttle](../handwrite/throttle)、[event-emitter](../handwrite/event-emitter)、[promisify](../handwrite/promisify) |

## 今日目标

- 看完 `/handwrite/debounce`、`throttle`、`promisify`、`event-emitter`
- 输出防抖 / 节流对比表（触发时机、leading/trailing 选项、取消语义）
- 输出 EventEmitter / promisify 口述模板

## 阅读卡点

- 防抖 = 等一会儿只执行最后一次；节流 = 固定频率
- 常见追问：`leading: true, trailing: true` 同时开启的边界、`cancel` 方法怎么实现
- EventEmitter 的 `once` 用包装函数 + 删除来实现
- `promisify` 针对 error-first 回调，注意 `this` 绑定

## 速记卡 / 知识点

### 防抖 vs 节流

| 维度 | 防抖 (debounce) | 节流 (throttle) |
|------|----------------|-----------------|
| 含义 | 等一会儿，只执行最后一次 | 固定频率执行 |
| 适用场景 | 搜索框输入、窗口 resize 结束 | 滚动事件、拖拽 |
| 时序 | 停止触发后 delay 才执行 | 每 delay 时间至少执行一次 |
| leading | 第一次立即执行 | 第一次立即执行 |
| trailing | 最后一次延迟执行 | 最后一次延迟执行 |

### EventEmitter 最小 API

```text
on(event, fn)    → 订阅
off(event, fn)   → 取消
emit(event, ...args)  → 发布
once(event, fn)  → 订阅一次（执行后自动取消）
```

### promisify 三步

```text
1. 返回新函数
2. 新函数内部 new Promise
3. 调用原函数，传入 error-first 回调：(err, data) => err ? reject : resolve
```

## 手写 / 流程图

### debounce（含 leading / trailing / cancel）

```js
function debounce(fn, delay, { leading = false, trailing = true } = {}) {
  let timer = null
  let isInvoked = false  // leading 是否已触发

  const debounced = function (...args) {
    if (timer) clearTimeout(timer)

    if (leading && !isInvoked) {
      fn.apply(this, args)
      isInvoked = true
    }

    timer = setTimeout(() => {
      if (trailing && isInvoked !== true || trailing && !leading) {
        fn.apply(this, args)
      }
      timer = null
      isInvoked = false
    }, delay)
  }

  debounced.cancel = function () {
    clearTimeout(timer)
    timer = null
    isInvoked = false
  }

  return debounced
}
```

### throttle（时间戳法）

```js
function throttle(fn, delay) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}
```

### EventEmitter

```js
class EventEmitter {
  constructor() {
    this._events = Object.create(null)
  }

  on(event, fn) {
    (this._events[event] || (this._events[event] = [])).push(fn)
    return this
  }

  off(event, fn) {
    const fns = this._events[event]
    if (!fns) return this
    this._events[event] = fns.filter(f => f !== fn && f._orig !== fn)
    return this
  }

  emit(event, ...args) {
    const fns = this._events[event]
    if (!fns) return false
    fns.forEach(fn => fn.apply(this, args))
    return true
  }

  once(event, fn) {
    const wrapper = (...args) => {
      fn.apply(this, args)
      this.off(event, wrapper)
    }
    wrapper._orig = fn  // off 时能匹配原函数
    this.on(event, wrapper)
    return this
  }
}
```

### promisify

```js
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }
}
```

## 口述题

### 1. 防抖和节流怎么结合场景选？

回答模板：

> 防抖适合"等用户停下来再执行"的场景，比如搜索框输入，用户停止打字 300ms 后再发请求，避免每次按键都发。节流适合"控制执行频率"的场景，比如滚动事件中的懒加载检测，不需要每个 scroll 事件都处理，每 200ms 处理一次就够。
>
> 简单记忆：防抖像电梯关门（有人来就重新等），节流像红绿灯（固定时间放一次）。
>
> 追问 leading/trailing：防抖默认 trailing（最后执行），加 `leading: true` 可以第一次立即执行；节流默认 leading（第一次立即），可以用定时器版实现 trailing。

### 2. Promise 风格 API 转 async 风格怎么讲？

回答模板：

> `promisify` 是把 Node.js 风格的 error-first 回调函数转成返回 Promise 的函数。核心是返回一个新函数，内部 `new Promise`，把原函数的最后一个参数替换为 `(err, data) => err ? reject(err) : resolve(data)`。
>
> Node.js 自带 `util.promisify`，还支持自定义 `[Symbol('nodejs.util.promisify.custom')]`。在浏览器端如果需要，手写几行就够。转换后就可以用 `async / await` 写同步风格的异步代码。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 防抖节流原理 + 场景 + leading/trailing（2 分钟）
2. EventEmitter 4 个 API + once 的实现（1.5 分钟）
3. promisify 三步 + error-first 回调约定（1.5 分钟）

录完后自查：

- 是否说出防抖 = "等停下来"、节流 = "固定频率"。
- 是否说出 once 用包装函数 + 执行后 off。
- 是否说出 promisify 的 error-first 回调约定。
- 是否说出 `cancel` 方法的作用。

## 今日复盘

今天最需要回补的 3 个点：

1. `leading: true, trailing: true` 同时开启时的边界处理（首尾各执行一次）。
2. EventEmitter 中 `off` 在 `emit` 遍历期间被调用时的数组修改问题（应拷贝后遍历）。
3. `promisify` 处理多参数回调（如 `(err, data1, data2)`）的扩展写法。
