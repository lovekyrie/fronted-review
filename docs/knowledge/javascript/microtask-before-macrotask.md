# 微任务先于下一次宏任务

> Related source: [interview/jscore/basic/event-loop.md](../../../interview/jscore/basic/event-loop.md)

## Meaning

`Promise.then`、`queueMicrotask`、`MutationObserver` 是微任务。`setTimeout`、`setInterval` 是宏任务。

当前调用栈清空后，先把微任务队列排空，再取下一个宏任务。所以同一轮里，已经排队的 `Promise` 回调会先于 `setTimeout` 回调执行。「优先于 `setTimeout`」说的是这个顺序，`setTimeout` 仍然是宏任务。

## In This Project

`interview/jscore/basic/event-loop.md` 最佳实践第 2 条：`Promise` 和 `MutationObserver` 优先于 `setTimeout`。比较对象是宏任务 `setTimeout`，不是把定时器归进微任务。
