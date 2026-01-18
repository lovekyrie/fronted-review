// 给定一个头结点为 head 的非空单链表，返回链表的中间结点。如果有两个中间结点，则返回第二个。
/**
 *  解题思路
 *快慢指针法**：慢指针走一步，快指针走两步。当快指针到达结尾时，慢指针正好在中间。
 */
import LinkedList from './LinkedList.js'

/**
 * @param {LinkedListNode} head
 * @returns {LinkedListNode}
 */
function findMidNode(head) {
  let slow = head
  let fast = head
  while (fast !== null && fast.next !== null) {
    slow = slow.next
    fast = fast.next.next
  }
  return slow
}

const list = LinkedList.fromArray([1, 2, 3, 4, 5])
console.log(findMidNode(list.head).value)
