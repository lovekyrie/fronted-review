# Classic Queue Problems

## 1. Implement Stack using Queues

### Problem
Implement a stack with the following operations using queues: push, pop, top, empty. You may only use the standard queue operations: `push to back`, `peek/pop from front`, `size`, and `is empty`.

### Approach
One queue is enough. On each `push`, enqueue the new element first, then dequeue every other element and enqueue it again. The new element ends up at the front, which simulates the stack’s last-in, first-out (LIFO) order.

### Implementation
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

## 2. Binary Tree Level Order Traversal

### Problem
Given a binary tree, return the values of its nodes in **level order** (i.e. from left to right, level by level).

### Approach
This is the classic use of a queue: **breadth-first search (BFS)**.
1. Store the current level’s nodes in a queue.
2. Record the current queue size `size` (the number of nodes on this level).
3. Loop `size` times: dequeue a node, push its value into the result, and enqueue its left and right children.

### Implementation
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

## 3. Design Circular Queue

### Problem
Design a circular queue. A circular queue is a linear data structure that follows FIFO (first in, first out), with the tail connected back to the head to form a circle.

### Approach
Use a fixed-length array and keep two pointers `head` and `tail`, plus the current `size`.
- `(tail + 1) % capacity` implements the logical wrap-around.

### Implementation
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

## 4. Number of Recent Calls

### Problem
Write a `RecentCounter` class that counts how many requests arrived in the last 3000 milliseconds.

### Approach
Request timestamps are monotonically increasing, so store them in a queue.
1. On each `ping(t)`, enqueue `t`.
2. While the front timestamp is less than `t - 3000`, dequeue it (it has expired).
3. The queue length is the number of requests in the last 3000ms.

### Implementation
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

## 5. Sliding Window Maximum — monotonic queue

### Problem
You are given an integer array `nums` and a sliding window of size `k` that moves from the far left of the array to the far right. Return the maximum value in each window.

### Approach
**Monotonic queue**: keep a deque of indices whose corresponding values are monotonically decreasing.
1. Before enqueueing a new element, pop every smaller value from the back (they can never be the maximum again).
2. If the front index has slid out of the window, dequeue it.
3. The front of the deque is the maximum of the current window.

### Implementation
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function maxSlidingWindow(nums, k) {
  const deque = []; // store indices
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    // 1. Keep the deque monotonically decreasing
    while (deque.length && nums[i] >= nums[deque[deque.length - 1]]) {
      deque.pop();
    }
    deque.push(i);

    // 2. Drop the front index if it is outside the window
    if (deque[0] <= i - k) {
      deque.shift();
    }

    // 3. Record the result
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  return result;
}
```

---

## Interview answer template (Queue)

### 1) How to recognize the pattern
- Level-order traversal, sliding windows, request time windows, FIFO scheduling.
- Common structures: plain queue, circular queue, deque (monotonic queue).

### 2) General solving framework
1. Be clear whether the queue stores values, indices, or node objects.
2. Maintain the enqueue rule and the expire/dequeue rule.
3. Read the front as the current answer at the right time.

### 3) Complexity (quick answer)
- Basic queue operations are amortized `O(1)`.
- Sliding-window maximum with a monotonic queue is overall `O(n)` (each element enters and leaves at most once).

### 4) Common pitfalls
1. Frequent `shift()` in JS is slow on large data; consider a handwritten deque.
2. The “expired index dequeue” condition in sliding-window problems is often wrong (`<= i-k`).
3. Full/empty checks and modulo wrap-around on circular queues are easy to get wrong.
