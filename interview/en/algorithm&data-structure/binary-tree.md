### Tree Structure
A tree is an important nonlinear data structure, and the binary tree is one of the most commonly used tree structures.

#### 1. Basic Implementation
##### 1.1 Node Definition
```javascript
// Binary tree node
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// N-ary tree node
class NaryTreeNode {
  constructor(val) {
    this.val = val;
    this.children = [];
  }
}
```

##### 1.2 Tree Implementation
```javascript
// Binary tree
class BinaryTree {
  constructor() {
    this.root = null;
  }

  // Insert a node
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

  // Delete a node
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

#### 2. Traversal
##### 2.1 Depth-First Search (DFS)
```javascript
// Preorder traversal
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

// Inorder traversal
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

// Postorder traversal
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

##### 2.2 Breadth-First Search (BFS)
```javascript
// Level-order traversal
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

#### 3. Common Operations
##### 3.1 Basic Tree Operations
```javascript
// Get tree height
function getHeight(root) {
  if (!root) return 0;
  return Math.max(getHeight(root.left), getHeight(root.right)) + 1;
}

// Check if balanced
function isBalanced(root) {
  if (!root) return true;
  
  const leftHeight = getHeight(root.left);
  const rightHeight = getHeight(root.right);
  
  return Math.abs(leftHeight - rightHeight) <= 1 &&
         isBalanced(root.left) &&
         isBalanced(root.right);
}

// Check if symmetric
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

##### 3.2 Special Tree Operations
```javascript
// Lowest common ancestor
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  
  if (left && right) return root;
  return left || right;
}

// Path sum
function hasPathSum(root, sum) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === sum;
  
  return hasPathSum(root.left, sum - root.val) ||
         hasPathSum(root.right, sum - root.val);
}

// Serialize and deserialize
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

#### 4. Special Tree Structures
##### 4.1 Binary Search Tree
```javascript
// Validate a binary search tree
function isValidBST(root) {
  function validate(node, min, max) {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    
    return validate(node.left, min, node.val) &&
           validate(node.right, node.val, max);
  }
  
  return validate(root, -Infinity, Infinity);
}

// Insert a node
function insertIntoBST(root, val) {
  if (!root) return new TreeNode(val);
  
  if (val < root.val) {
    root.left = insertIntoBST(root.left, val);
  } else {
    root.right = insertIntoBST(root.right, val);
  }
  
  return root;
}

// Delete a node
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

##### 4.2 Heap
```javascript
// Min heap
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

#### 5. Best Practices
1. Choose the right traversal
2. Handle edge cases
3. Optimize space usage
4. Optimize time efficiency
5. Use recursion or iteration
6. Keep the code readable
7. Add comments
8. Implement error handling
9. Account for special cases
10. Write unit tests

#### 6. Common Interview Questions
1. **Basic tree operations**
   - Traversal
   - Node operations
   - Tree properties
   - Tree conversion

2. **Special tree structures**
   - Binary search tree
   - Balanced tree
   - Heap
   - Trie

3. **Tree application scenarios**
   - File systems
   - Database indexes
   - Algorithm implementations
   - Real-world applications

#### 7. High-Frequency Gaps (Binary Tree Interview Quick Answers)

##### 7.1 How to quickly answer DFS vs BFS
- DFS (preorder / inorder / postorder): good for paths, subtree properties, and recursively defined problems.
- BFS (level-order): good for shortest number of levels, per-level processing, and a level-by-level view.

##### 7.2 A unified template for recursive tree problems
1. Define the function clearly: what `fn(node)` returns.
2. Base case: the return value when `node === null`.
3. Split into subproblems: left subtree and right subtree.
4. Combine answers: build the current result from the left and right return values.

##### 7.3 Common binary tree complexity
- Traversal time is usually `O(n)`.
- Recursive space is the tree height `O(h)`; about `O(log n)` for a balanced tree, `O(n)` when it degrades to a linked list.

##### 7.4 High-frequency pitfalls
1. Missing the recursive termination condition, which leads to a null pointer exception.
2. Checking a balanced tree by repeatedly computing height, which leads to `O(n^2)`.
3. Inconsistent null-node markers between serialize and deserialize.
