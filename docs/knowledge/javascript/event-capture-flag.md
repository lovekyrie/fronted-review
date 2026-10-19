# addEventListener 的 capture 不阻止冒泡

> Related source: [interview/jscore/basic/event-mechanism.md](../../../interview/jscore/basic/event-mechanism.md)

## Meaning

第三个参数 `true`（或 `{ capture: true }`）表示这个监听器挂在捕获阶段。点击子节点时，事件仍然走完三段：从 `window` 向下捕获，到达目标，再向上冒泡。

父节点上的捕获监听会在事件向下经过它时执行，早于子节点。执行完之后事件继续往下，再向上冒泡。要截断传播，调用 `stopPropagation`。

同一个节点既有捕获监听又有冒泡监听时：点的是子节点，捕获监听只在向下经过时跑一次，冒泡监听在向上返回时再跑一次。点的就是这个节点本身，两种监听都在目标阶段、按注册顺序执行。

## In This Project

`interview/jscore/basic/event-mechanism.md` 里 `parent.addEventListener('click', ..., true)` 只是让父节点在捕获阶段打印。它不会让事件停在 `parent`。
