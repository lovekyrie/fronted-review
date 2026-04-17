/**
 * 设计一个支持 `push` ，`pop` ，`top` 操作，并能在常数时间内检索到最小元素的栈。
 */

/**
 * 解题思路
 * 使用**辅助栈**。主栈存储所有数据，辅助栈存储当前的最小值。
 * - `push`: 如果新元素小于等于辅助栈顶，也压入辅助栈。
 * - `pop`: 如果主栈弹出的元素等于辅助栈顶，辅助栈也弹出。
 */
/**
 * @param {number} val
 * @return {void}
 */

class MinStack {
  constructor() {
    this.stack = []
    this.minStack = [Infinity]
  }

  push(val) {
    this.stack.push(val)
    this.minStack.push(Math.min(val, this.minStack[this.minStack.length - 1]))
  }

  pop() {
    this.stack.pop()
    this.minStack.pop()
  }

  top() {
    return this.stack[this.stack.length - 1]
  }

  getMin() {
    return this.minStack[this.minStack.length - 1]
  }
}

const minStack = new MinStack()
minStack.push(-2)
minStack.push(0)
minStack.push(-3)
console.log(minStack.getMin()) // 返回 -3.
minStack.pop()
console.log(minStack.top()) // 返回 0.
console.log(minStack.getMin()) // 返回 -2.

console.log(minStack.minStack)
