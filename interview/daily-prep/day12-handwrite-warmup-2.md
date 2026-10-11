# Day 12 手写保温 2（防抖/节流 / Promise / EventEmitter / promisify）

## 今日目标

- 看完 `/handwrite/debounce`、`throttle`、`promisify`、`event-emitter`
- 输出防抖 / 节流对比表（触发时机、leading/trailing 选项、取消语义）
- 输出 EventEmitter / promisify 口述模板

## 按顺序阅读

1. [debounce](../handwrite/debounce)
2. [throttle](../handwrite/throttle)
3. [event-emitter](../handwrite/event-emitter)
4. [promisify](../handwrite/promisify)

## 实操与自测

**检查点**

- 防抖 = 等一会儿只执行最后一次；节流 = 固定频率
- 常见追问：`leading: true, trailing: true` 同时开启的边界、`cancel` 方法怎么实现
- EventEmitter 的 `once` 用包装函数 + 删除来实现
- `promisify` 针对 error-first 回调，注意 `this` 绑定

**先独立完成，再对照专题**

- 防抖 vs 节流 — [参考章节](../handwrite/debounce#day-12-防抖-vs-节流)
- EventEmitter 最小 API — [参考章节](../handwrite/event-emitter#day-12-eventemitter-最小-api)
- promisify 三步 — [参考章节](../handwrite/promisify#day-12-promisify-三步)
- debounce（含 leading / trailing / cancel） — [参考章节](../handwrite/debounce#day-12-debounce-含-leading-trailing-cancel)
- throttle（时间戳法） — [参考章节](../handwrite/throttle#day-12-throttle-时间戳法)
- EventEmitter — [参考章节](../handwrite/event-emitter#day-12-eventemitter)
- promisify — [参考章节](../handwrite/promisify#day-12-promisify)

**脱稿口述题**

- 1. 防抖和节流怎么结合场景选？
- 2. Promise 风格 API 转 async 风格怎么讲？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 防抖节流原理 + 场景 + leading/trailing（2 分钟）
2. EventEmitter 4 个 API + once 的实现（1.5 分钟）
3. promisify 三步 + error-first 回调约定（1.5 分钟）

录完后自查：

- 是否说出防抖 = "等停下来"、节流 = "固定频率"。
- 是否说出 once 用包装函数 + 执行后 off。
- 是否说出 promisify 的 error-first 回调约定。
- 是否说出 `cancel` 方法的作用。

## 复盘

今天最需要回补的 3 个点：

1. `leading: true, trailing: true` 同时开启时的边界处理（首尾各执行一次）。
2. EventEmitter 中 `off` 在 `emit` 遍历期间被调用时的数组修改问题（应拷贝后遍历）。
3. `promisify` 处理多参数回调（如 `(err, data1, data2)`）的扩展写法。
