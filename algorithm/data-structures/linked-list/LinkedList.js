import LinkedListNode from './LinkedListNode.js'

export default class LinkedList {
  constructor() {
    /** @var LinkedListNode */
    this.head = null

    /** @var LinkedListNode */
    this.tail = null
  }

  /**
   *  往head前插入新节点
   * @param {*} value
   * @returns {LinkedList}
   */
  prepend(value) {
    // 让新节点的next指向原来head
    const newNode = new LinkedListNode(value, this.head)
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

  /**
   * 将数组转换为链表（静态方法，方便测试）
   * @param {*[]} values
   * @return {LinkedList}
   */
  static fromArray(values) {
    const list = new LinkedList()
    values.forEach(value => list.append(value))
    return list
  }

  /**
   * 将链表转为数组，方便 console.log 查看
   * @return {*[]}
   */
  toArray() {
    const nodes = []
    let currentNode = this.head
    while (currentNode) {
      nodes.push(currentNode.value)
      currentNode = currentNode.next
    }
    return nodes
  }

  /**
   * 打印链表
   * @param {Function} [callback]
   * @return {string}
   */
  toString(callback) {
    return this.toArray().map(node => node.toString(callback)).toString()
  }
}
