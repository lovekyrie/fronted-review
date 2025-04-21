import Comparator from '../../utils/comparator/comparator'
import LinkedListNode from './LinkedListNode'

export default class LinkedList {
  /**
   * @param {*} compareFunction
   */
  constructor(compareFunction) {
    /** @var LinkedListNode */
    this.head = null

    /** @var LinkedListNode */
    this.tail = null

    this.compare = new Comparator(compareFunction)
  }

  /**
   *  往head前插入新节点
   * @param {*} value
   * @returns {LinkedList}
   */
  prepend(value) {
    // Make new node to be a head. 让新节点的next指向原来head
    const newNode = LinkedListNode(value, this.head)
    this.head = newNode

    // If there is not tail yet let's make new node a tail.
    if (!this.tail) {
      this.tail = newNode
    }

    return this
  }

  /**
   * 向末尾插入节点
   * @param {*} value
   * @returns {LinkedList}
   */
  append(value) {
    const newNode = new LinkedListNode(value)

    // If there is no head yet let's make new node a head.
    if (!this.head) {
      this.head = newNode
      this.tail = newNode

      return this
    }

    // Attach new node to the end of linked list.
    this.tail.next = newNode
    this.tail = newNode

    return this
  }

  insert(value, rawIndex) {

  }
}
