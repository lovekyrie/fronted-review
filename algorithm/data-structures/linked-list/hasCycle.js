// 判断一个链表中是否有环。

/**
 * 解题思路
 * 快慢指针法（Floyd's Cycle-Finding Algorithm）：定义两个指针，快指针每次走两步，慢指针每次走一步。如果链表有环，快指针最终一定会追上慢指针。
 */
import LinkedList from './LinkedList.js'
/**
 * @param {LinkedListNode} head
 * @returns {boolean}
 */
function hasCycle(head) {
  if (!head || !head.next)
    return false
  let slow = head
  let fast = head.next
  while (slow !== fast) {
    // 如果没有环的时候，那么快指针会先到达链表的末尾
    if (!fast || !fast.next)
      return false
    slow = slow.next
    fast = fast.next.next
  }
  return true
}

function hasCycle2(head) {
  const map = new WeakMap()
  if (!head || !head.next) {
    return false
  }
  while (head) {
    if (map.get(head)) {
      return true
    }
    else {
      map.set(head, true)
      head = head.next
    }
  }
  return false
};

const list = LinkedList.fromArray([1, 2, 3, 4, 5])
// 1 -> 2 -> 3 -> 4 -> 5 -> 2
list.head.next.next.next.next.next = list.head.next
// console.log(hasCycle(list.head))
console.log(hasCycle2(list.head))
