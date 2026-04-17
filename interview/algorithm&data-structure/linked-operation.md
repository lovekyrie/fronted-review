### 链表操作
链表是一种线性数据结构，由一系列节点组成，每个节点包含数据和指向下一个节点的指针。

#### 1. 基本实现
##### 1.1 节点定义
```javascript
// 单链表节点
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

// 双向链表节点
class DoublyListNode {
  constructor(val) {
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}
```

##### 1.2 链表实现
```javascript
// 单链表
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // 添加节点
  append(val) {
    const node = new ListNode(val);
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.size++;
  }

  // 插入节点
  insert(position, val) {
    if (position < 0 || position > this.size) return false;
    
    const node = new ListNode(val);
    if (position === 0) {
      node.next = this.head;
      this.head = node;
    } else {
      let current = this.head;
      let previous = null;
      let index = 0;
      
      while (index < position) {
        previous = current;
        current = current.next;
        index++;
      }
      
      node.next = current;
      previous.next = node;
    }
    this.size++;
    return true;
  }

  // 删除节点
  removeAt(position) {
    if (position < 0 || position >= this.size) return null;
    
    let current = this.head;
    if (position === 0) {
      this.head = current.next;
    } else {
      let previous = null;
      let index = 0;
      
      while (index < position) {
        previous = current;
        current = current.next;
        index++;
      }
      
      previous.next = current.next;
    }
    this.size--;
    return current.val;
  }
}
```

#### 2. 常见操作
##### 2.1 遍历和查找
```javascript
// 遍历链表
function traverse(head) {
  let current = head;
  while (current) {
    console.log(current.val);
    current = current.next;
  }
}

// 查找节点
function find(head, val) {
  let current = head;
  while (current) {
    if (current.val === val) return current;
    current = current.next;
  }
  return null;
}

// 获取节点索引
function indexOf(head, val) {
  let current = head;
  let index = 0;
  while (current) {
    if (current.val === val) return index;
    current = current.next;
    index++;
  }
  return -1;
}
```

##### 2.2 链表操作
```javascript
// 反转链表
function reverse(head) {
  let prev = null;
  let current = head;
  
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}

// 检测环
function hasCycle(head) {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  
  return false;
}

// 合并有序链表
function mergeSortedLists(l1, l2) {
  const dummy = new ListNode(0);
  let current = dummy;
  
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  
  current.next = l1 || l2;
  return dummy.next;
}
```

#### 3. 高级操作
##### 3.1 链表排序
```javascript
// 归并排序
function mergeSort(head) {
  if (!head || !head.next) return head;
  
  const mid = findMiddle(head);
  const right = mid.next;
  mid.next = null;
  
  return mergeSortedLists(mergeSort(head), mergeSort(right));
}

function findMiddle(head) {
  let slow = head;
  let fast = head;
  
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return slow;
}

// 快速排序
function quickSort(head) {
  if (!head || !head.next) return head;
  
  const pivot = head;
  let less = new ListNode(0);
  let greater = new ListNode(0);
  let lessCurrent = less;
  let greaterCurrent = greater;
  let current = head.next;
  
  while (current) {
    if (current.val < pivot.val) {
      lessCurrent.next = current;
      lessCurrent = lessCurrent.next;
    } else {
      greaterCurrent.next = current;
      greaterCurrent = greaterCurrent.next;
    }
    current = current.next;
  }
  
  lessCurrent.next = null;
  greaterCurrent.next = null;
  
  return mergeSortedLists(quickSort(less.next), pivot, quickSort(greater.next));
}
```

##### 3.2 链表操作
```javascript
// 删除倒数第N个节点
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0);
  dummy.next = head;
  let first = dummy;
  let second = dummy;
  
  for (let i = 0; i <= n; i++) {
    first = first.next;
  }
  
  while (first) {
    first = first.next;
    second = second.next;
  }
  
  second.next = second.next.next;
  return dummy.next;
}

// 旋转链表
function rotateRight(head, k) {
  if (!head || !head.next || k === 0) return head;
  
  let length = 1;
  let current = head;
  
  while (current.next) {
    current = current.next;
    length++;
  }
  
  k = k % length;
  if (k === 0) return head;
  
  current.next = head;
  current = head;
  
  for (let i = 0; i < length - k - 1; i++) {
    current = current.next;
  }
  
  const newHead = current.next;
  current.next = null;
  return newHead;
}
```

#### 4. 最佳实践
1. 使用哨兵节点
2. 处理边界情况
3. 注意指针操作
4. 避免内存泄漏
5. 优化空间使用
6. 优化时间效率
7. 保持代码可读性
8. 添加注释说明
9. 实现错误处理
10. 编写单元测试

#### 5. 常见面试题
1. **链表基本操作**
   - 插入节点
   - 删除节点
   - 查找节点
   - 反转链表

2. **链表算法实现**
   - 检测环
   - 合并链表
   - 排序链表
   - 删除节点

3. **链表应用场景**
   - 内存管理
   - 缓存实现
   - 算法实现
   - 实际应用 