# 队列 (Queue) 经典题目

## 1. 用队列实现栈 (Implement Stack using Queues)

### 题目描述
使用队列实现栈的下列操作：push、pop、top、empty。你只能使用队列的标准操作：`push to back`、`peek/pop from front`、`size` 和 `is empty`。

### 解题思路
使用一个队列即可实现。每次 `push` 新元素时，先将其入队，然后将队列中除新元素外的所有元素依次出队并重新入队，这样新加入的元素就排在了队首，模拟了栈的后进先出（LIFO）。

### 代码实现
```javascript
class MyStack {
  constructor() {
    this.queue = [];
  }

  push(x) {
    let size = this.queue.length;
    this.queue.push(x);
    while (size--) {
      this.queue.push(this.queue.shift());
    }
  }

  pop() {
    return this.queue.shift();
  }

  top() {
    return this.queue[0];
  }

  empty() {
    return this.queue.length === 0;
  }
}
```

---

## 2. 二叉树的层序遍历 (Binary Tree Level Order Traversal)

### 题目描述
给你一个二叉树，请你返回其按 **层序遍历** 得到的节点值。 （即逐层地，从左到右访问所有节点）。

### 解题思路
这是队列最经典的应用：**广度优先搜索 (BFS)**。
1. 使用一个队列存储当前层的节点。
2. 记录当前队列的大小 `size`（即当前层的节点数）。
3. 循环 `size` 次，将节点出队，存入结果，并将其左右子节点入队。

### 代码实现
```javascript
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
function levelOrder(root) {
  const result = [];
  if (!root) return result;

  const queue = [root];
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}
```

---

## 3. 设计循环队列 (Design Circular Queue)

### 题目描述
设计一个循环队列实现。 循环队列是一种线性数据结构，其操作表现基于 FIFO（先进先出）原则并且队尾被连接在队首以形成一个循环。

### 解题思路
使用固定长度的数组，并维护两个指针 `head` 和 `tail` 以及当前大小 `size`。
- `(tail + 1) % capacity` 用于实现逻辑上的循环。

### 代码实现
```javascript
class MyCircularQueue {
  constructor(k) {
    this.capacity = k;
    this.queue = new Array(k);
    this.head = 0;
    this.tail = -1;
    this.size = 0;
  }

  enQueue(value) {
    if (this.isFull()) return false;
    this.tail = (this.tail + 1) % this.capacity;
    this.queue[this.tail] = value;
    this.size++;
    return true;
  }

  deQueue() {
    if (this.isEmpty()) return false;
    this.head = (this.head + 1) % this.capacity;
    this.size--;
    return true;
  }

  Front() {
    return this.isEmpty() ? -1 : this.queue[this.head];
  }

  Rear() {
    return this.isEmpty() ? -1 : this.queue[this.tail];
  }

  isEmpty() {
    return this.size === 0;
  }

  isFull() {
    return this.size === this.capacity;
  }
}
```

---

## 4. 最近的请求次数 (Number of Recent Calls)

### 题目描述
写一个 `RecentCounter` 类来计算最近 3000 毫秒内收到的请求数。

### 解题思路
由于请求时间是单调递增的，可以使用队列存储请求时间。
1. 每次 `ping(t)` 时，将 `t` 入队。
2. 检查队首时间是否小于 `t - 3000`，如果是则出队（说明已过期）。
3. 队列的长度即为最近 3000ms 内的请求数。

### 代码实现
```javascript
class RecentCounter {
  constructor() {
    this.queue = [];
  }

  ping(t) {
    this.queue.push(t);
    while (this.queue[0] < t - 3000) {
      this.queue.shift();
    }
    return this.queue.length;
  }
}
```

---

## 5. 滑动窗口最大值 (Sliding Window Maximum) - 单调队列

### 题目描述
给你一个整数数组 `nums`，有一个大小为 `k` 的滑动窗口从数组的最左侧移动到数组的最右侧。返回滑动窗口中的最大值。

### 解题思路
**单调队列**：维护一个双端队列，存放下标，并保持队列中对应元素单调递减。
1. 新元素入队前，将队尾所有小于它的元素弹出（因为它们不可能再成为最大值）。
2. 检查队首下标是否已经滑出窗口，如果是则出队。
3. 每轮的队首元素即为当前窗口的最大值。

### 代码实现
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function maxSlidingWindow(nums, k) {
  const deque = []; // 存放下标
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    // 1. 维持单调递减
    while (deque.length && nums[i] >= nums[deque[deque.length - 1]]) {
      deque.pop();
    }
    deque.push(i);

    // 2. 移除超出窗口的队首
    if (deque[0] <= i - k) {
      deque.shift();
    }

    // 3. 记录结果
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  return result;
}
```
