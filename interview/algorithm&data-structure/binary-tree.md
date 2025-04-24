### 树结构
树是一种重要的非线性数据结构，其中二叉树是最常用的树结构之一。

#### 1. 基本实现
##### 1.1 节点定义
```javascript
// 二叉树节点
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// 多叉树节点
class NaryTreeNode {
  constructor(val) {
    this.val = val;
    this.children = [];
  }
}
```

##### 1.2 树实现
```javascript
// 二叉树
class BinaryTree {
  constructor() {
    this.root = null;
  }

  // 插入节点
  insert(val) {
    const node = new TreeNode(val);
    if (!this.root) {
      this.root = node;
      return;
    }

    const queue = [this.root];
    while (queue.length) {
      const current = queue.shift();
      if (!current.left) {
        current.left = node;
        return;
      }
      if (!current.right) {
        current.right = node;
        return;
      }
      queue.push(current.left, current.right);
    }
  }

  // 删除节点
  delete(val) {
    if (!this.root) return;
    if (this.root.val === val) {
      this.root = null;
      return;
    }

    const queue = [this.root];
    while (queue.length) {
      const current = queue.shift();
      if (current.left) {
        if (current.left.val === val) {
          current.left = null;
          return;
        }
        queue.push(current.left);
      }
      if (current.right) {
        if (current.right.val === val) {
          current.right = null;
          return;
        }
        queue.push(current.right);
      }
    }
  }
}
```

#### 2. 遍历方式
##### 2.1 深度优先遍历
```javascript
// 前序遍历
function preorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    result.push(node.val);
    traverse(node.left);
    traverse(node.right);
  }
  
  traverse(root);
  return result;
}

// 中序遍历
function inorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  
  traverse(root);
  return result;
}

// 后序遍历
function postorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    traverse(node.right);
    result.push(node.val);
  }
  
  traverse(root);
  return result;
}
```

##### 2.2 广度优先遍历
```javascript
// 层序遍历
function levelOrderTraversal(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length) {
    const level = [];
    const size = queue.length;
    
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(level);
  }
  
  return result;
}
```

#### 3. 常见操作
##### 3.1 树的基本操作
```javascript
// 获取树的高度
function getHeight(root) {
  if (!root) return 0;
  return Math.max(getHeight(root.left), getHeight(root.right)) + 1;
}

// 判断是否平衡
function isBalanced(root) {
  if (!root) return true;
  
  const leftHeight = getHeight(root.left);
  const rightHeight = getHeight(root.right);
  
  return Math.abs(leftHeight - rightHeight) <= 1 &&
         isBalanced(root.left) &&
         isBalanced(root.right);
}

// 判断是否对称
function isSymmetric(root) {
  if (!root) return true;
  
  function isMirror(left, right) {
    if (!left && !right) return true;
    if (!left || !right) return false;
    return left.val === right.val &&
           isMirror(left.left, right.right) &&
           isMirror(left.right, right.left);
  }
  
  return isMirror(root.left, root.right);
}
```

##### 3.2 树的特殊操作
```javascript
// 最近公共祖先
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  
  if (left && right) return root;
  return left || right;
}

// 路径和
function hasPathSum(root, sum) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === sum;
  
  return hasPathSum(root.left, sum - root.val) ||
         hasPathSum(root.right, sum - root.val);
}

// 序列化和反序列化
function serialize(root) {
  if (!root) return 'null';
  
  const left = serialize(root.left);
  const right = serialize(root.right);
  
  return `${root.val},${left},${right}`;
}

function deserialize(data) {
  const values = data.split(',');
  let index = 0;
  
  function build() {
    if (values[index] === 'null') {
      index++;
      return null;
    }
    
    const node = new TreeNode(parseInt(values[index++]));
    node.left = build();
    node.right = build();
    return node;
  }
  
  return build();
}
```

#### 4. 特殊树结构
##### 4.1 二叉搜索树
```javascript
// 验证二叉搜索树
function isValidBST(root) {
  function validate(node, min, max) {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    
    return validate(node.left, min, node.val) &&
           validate(node.right, node.val, max);
  }
  
  return validate(root, -Infinity, Infinity);
}

// 插入节点
function insertIntoBST(root, val) {
  if (!root) return new TreeNode(val);
  
  if (val < root.val) {
    root.left = insertIntoBST(root.left, val);
  } else {
    root.right = insertIntoBST(root.right, val);
  }
  
  return root;
}

// 删除节点
function deleteNode(root, key) {
  if (!root) return null;
  
  if (key < root.val) {
    root.left = deleteNode(root.left, key);
  } else if (key > root.val) {
    root.right = deleteNode(root.right, key);
  } else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    
    const minNode = findMin(root.right);
    root.val = minNode.val;
    root.right = deleteNode(root.right, minNode.val);
  }
  
  return root;
}

function findMin(node) {
  while (node.left) {
    node = node.left;
  }
  return node;
}
```

##### 4.2 堆
```javascript
// 最小堆
class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  insert(val) {
    this.heap.push(val);
    this.bubbleUp();
  }
  
  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown();
    
    return min;
  }
  
  bubbleUp() {
    let index = this.heap.length - 1;
    const element = this.heap[index];
    
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex] <= element) break;
      
      this.heap[index] = this.heap[parentIndex];
      index = parentIndex;
    }
    
    this.heap[index] = element;
  }
  
  bubbleDown() {
    let index = 0;
    const element = this.heap[0];
    
    while (true) {
      const leftIndex = 2 * index + 1;
      const rightIndex = 2 * index + 2;
      let leftChild, rightChild;
      let swap = null;
      
      if (leftIndex < this.heap.length) {
        leftChild = this.heap[leftIndex];
        if (leftChild < element) swap = leftIndex;
      }
      
      if (rightIndex < this.heap.length) {
        rightChild = this.heap[rightIndex];
        if ((swap === null && rightChild < element) ||
            (swap !== null && rightChild < leftChild)) {
          swap = rightIndex;
        }
      }
      
      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      index = swap;
    }
    
    this.heap[index] = element;
  }
}
```

#### 5. 最佳实践
1. 选择合适的遍历方式
2. 处理边界情况
3. 优化空间使用
4. 优化时间效率
5. 使用递归或迭代
6. 保持代码可读性
7. 添加注释说明
8. 实现错误处理
9. 考虑特殊情况
10. 编写单元测试

#### 6. 常见面试题
1. **树的基本操作**
   - 遍历方式
   - 节点操作
   - 树的性质
   - 树的转换

2. **特殊树结构**
   - 二叉搜索树
   - 平衡树
   - 堆
   - 字典树

3. **树的应用场景**
   - 文件系统
   - 数据库索引
   - 算法实现
   - 实际应用 