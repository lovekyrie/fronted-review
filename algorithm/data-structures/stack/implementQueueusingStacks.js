/**
 * 使用两个栈实现先入先出 (FIFO) 的队列。
 */

/**
 * 解题思路
 * - `stackIn`: 用于入队（push）。
 * - `stackOut`: 用于出队（pop）或查看队首（peek）。
 * - 当需要出队而 `stackOut` 为空时，将 `stackIn` 的所有元素弹出并压入 `stackOut`。
 */

class MyQueue {
  constructor() {
    this.stackIn = []
    this.stackOut = []
  }

  push(x) {
    this.stackIn.push(x)
  }

  pop() {
    this.peek()
    return this.stackOut.pop()
  }

  peek() {
    if (!this.stackOut.length) {
      while (this.stackIn.length) {
        this.stackOut.push(this.stackIn.pop())
      }
    }
    return this.stackOut[this.stackOut.length - 1]
  }

  empty() {
    return !this.stackIn.length && !this.stackOut.length
  }
}
