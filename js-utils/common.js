/**
 * 通用工具函数
 */

// 金钱格式化，三位加逗号
export const formatMoney = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

// 截取字符串并加身略号
export function subText(str, length) {
  if (str.length === 0) {
    return ''
  }
  if (str.length > length) {
    return `${str.substr(0, length)}...`
  }
  else {
    return str
  }
}

// 获取文件base64编码
export function fileToBase64String(file, format = ['jpg', 'jpeg', 'png', 'gif'], size = 20 * 1024 * 1024, formatMsg = '文件格式不正确', sizeMsg = '文件大小超出限制') {
  return new Promise((resolve, reject) => {
    // 格式过滤
    const suffix = file.type.split('/')[1].toLowerCase()
    let inFormat = false
    for (let i = 0; i < format.length; i++) {
      if (suffix === format[i]) {
        inFormat = true
        break
      }
    }
    if (!inFormat) {
      reject(formatMsg)
    }
    // 大小过滤
    if (file.size > size) {
      reject(sizeMsg)
    }
    // 转base64字符串
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      const res = fileReader.result
      resolve({ base64String: res, suffix })
      reject('异常文件，请重新选择')
    }
  })
}

// B转换到KB,MB,GB并保留两位小数
export function formatFileSize(fileSize) {
  let temp
  if (fileSize < 1024) {
    return `${fileSize}B`
  }
  else if (fileSize < (1024 * 1024)) {
    temp = fileSize / 1024
    temp = temp.toFixed(2)
    return `${temp}KB`
  }
  else if (fileSize < (1024 * 1024 * 1024)) {
    temp = fileSize / (1024 * 1024)
    temp = temp.toFixed(2)
    return `${temp}MB`
  }
  else {
    temp = fileSize / (1024 * 1024 * 1024)
    temp = temp.toFixed(2)
    return `${temp}GB`
  }
}

// base64转file
export function base64ToFile(base64, filename) {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const suffix = mime.split('/')[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, { type: mime })
}

// base64转blob
export function base64ToBlob(base64) {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

// blob转file
export function blobToFile(blob, fileName) {
  blob.lastModifiedDate = new Date()
  blob.name = fileName
  return blob
}

// file转base64
export function fileToBase64(file) {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function (e) {
    return e.target.result
  }
}

// 生成指定范围随机数
export const RandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// 生成随机整数
export function randomNumInteger(min, max) {
  switch (arguments.length) {
    case 1:
      return Number.parseInt(Math.random() * min + 1, 10)
    case 2:
      return Number.parseInt(Math.random() * (max - min + 1) + min, 10)
    default:
      return 0
  }
}

// 数组乱序
export function arrScrambling(arr) {
  const array = arr
  let index = array.length
  while (index) {
    index -= 1
    const randomIndex = Math.floor(Math.random() * index)
    const middleware = array[index]
    array[index] = array[randomIndex]
    array[randomIndex] = middleware
  }
  return array
}

// 数组交集
export const similarity = (arr1, arr2) => arr1.filter(v => arr2.includes(v))

// 数组中某元素出现的次数
export function countOccurrences(arr, value) {
  return arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0)
}

// 查询数组中是否存在某个元素并返回元素第一次出现的下标
export function inArray(item, data) {
  for (let i = 0; i < data.length; i++) {
    if (item === data[i]) {
      return i
    }
  }
  return -1
}

// 加法函数（精度丢失问题）
export function add(arg1, arg2) {
  let r1, r2, m
  try { r1 = arg1.toString().split('.')[1].length }
  catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length }
  catch (e) { r2 = 0 }
  m = 10 ** Math.max(r1, r2)
  return (arg1 * m + arg2 * m) / m
}

// 减法函数（精度丢失问题）
export function sub(arg1, arg2) {
  let r1, r2, m, n
  try { r1 = arg1.toString().split('.')[1].length }
  catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length }
  catch (e) { r2 = 0 }
  m = 10 ** Math.max(r1, r2)
  n = (r1 >= r2) ? r1 : r2
  return Number(((arg1 * m - arg2 * m) / m).toFixed(n))
}

// 除法函数（精度丢失问题）
export function division(num1, num2) {
  let t1, t2, r1, r2
  try {
    t1 = num1.toString().split('.')[1].length
  }
  catch (e) {
    t1 = 0
  }
  try {
    t2 = num2.toString().split('.')[1].length
  }
  catch (e) {
    t2 = 0
  }
  r1 = Number(num1.toString().replace('.', ''))
  r2 = Number(num2.toString().replace('.', ''))
  return (r1 / r2) * 10 ** (t2 - t1)
}

// 乘法函数（精度丢失问题）
export function mcl(num1, num2) {
  let m = 0; const s1 = num1.toString(); const s2 = num2.toString()
  try { m += s1.split('.')[1].length }
  catch (e) { }
  try { m += s2.split('.')[1].length }
  catch (e) { }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / 10 ** m
}

// 递归优化（尾递归）
export function tco(f) {
  let value
  let active = false
  const accumulated = []

  return function accumulator() {
    accumulated.push(arguments)
    if (!active) {
      active = true
      while (accumulated.length) {
        value = f.apply(this, accumulated.shift())
      }
      active = false
      return value
    }
  }
}

// 去除空格
export function trim(str, type = 1) {
  if (type && type !== 1 && type !== 2 && type !== 3 && type !== 4)
    return
  switch (type) {
    case 1:
      return str.replace(/\s/g, '')
    case 2:
      return str.replace(/(^\s)|(\s*$)/g, '')
    case 3:
      return str.replace(/(^\s)/g, '')
    case 4:
      return str.replace(/(\s$)/g, '')
    default:
      return str
  }
}

// 大小写转换
export function turnCase(str, type) {
  switch (type) {
    case 1:
      return str.toUpperCase()
    case 2:
      return str.toLowerCase()
    case 3:
      return str[0].toUpperCase() + str.substr(1).toLowerCase()
    default:
      return str
  }
}

// 随机16进制颜色
export function hexColor() {
  let str = '#'
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F']
  for (let i = 0; i < 6; i++) {
    const index = Number.parseInt((Math.random() * 16).toString())
    str += arr[index]
  }
  return str
}

// 随机16进制颜色（方法二）
export function randomHexColorCode() {
  const n = (Math.random() * 0xFFFFF * 1000000).toString(16)
  return `#${n.slice(0, 6)}`
}

// 转义html(防XSS攻击)
export function escapeHTML(str) {
  str.replace(
    /[&<>'"]/g,
    tag =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '\'': '&#39;',
        '"': '&quot;',
      }[tag] || tag),
  )
}

// 数字超过规定大小加上加号"+"，如数字超过99显示99+
export function outOfNum(val, maxNum) {
  val = val ? val - 0 : 0
  if (val > maxNum) {
    return `${maxNum}+`
  }
  else {
    return val
  }
}

// 判断数据类型
export function type(target) {
  const ret = typeof (target)
  const template = {
    '[object Array]': 'array',
    '[object Object]': 'object',
    '[object Number]': 'number - object',
    '[object Boolean]': 'boolean - object',
    '[object String]': 'string-object',
  }

  if (target === null) {
    return 'null'
  }
  else if (ret == 'object') {
    const str = Object.prototype.toString.call(target)
    return template[str]
  }
  else {
    return ret
  }
}

// Windows根据详细版本号判断当前系统名称
export function OutOsName(osVersion) {
  if (!osVersion) {
    return
  }
  const str = osVersion.substr(0, 3)
  if (str === '5.0') {
    return 'Win 2000'
  }
  else if (str === '5.1') {
    return 'Win XP'
  }
  else if (str === '5.2') {
    return 'Win XP64'
  }
  else if (str === '6.0') {
    return 'Win Vista'
  }
  else if (str === '6.1') {
    return 'Win 7'
  }
  else if (str === '6.2') {
    return 'Win 8'
  }
  else if (str === '6.3') {
    return 'Win 8.1'
  }
  else if (str === '10.') {
    return 'Win 10'
  }
  else {
    return 'Win'
  }
}

// 判断手机是Andoird还是IOS
export function getOSType() {
  const u = navigator.userAgent; const app = navigator.appVersion
  const isAndroid = u.includes('Android') || u.includes('Linux')
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  if (isIOS) {
    return 0
  }
  if (isAndroid) {
    return 1
  }
  return 2
}

// 函数防抖
export function debounce(func, wait, immediate) {
  let timeout
  return function () {
    const context = this
    const args = arguments

    if (timeout)
      clearTimeout(timeout)
    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow)
        func.apply(context, args)
    }
    else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}

// 函数节流
export function throttle(func, wait, type) {
  let previous, timeout
  if (type === 1) {
    previous = 0
  }
  else if (type === 2) {
    timeout = null
  }
  return function () {
    const context = this
    const args = arguments
    if (type === 1) {
      const now = Date.now()
      if (now - previous > wait) {
        func.apply(context, args)
        previous = now
      }
    }
    else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null
          func.apply(context, args)
        }, wait)
      }
    }
  }
}

// 递归生成树形结构
export function getTreeData(data, pid, pidName = 'parentId', idName = 'id', childrenName = 'children', key) {
  const arr = []

  for (let i = 0; i < data.length; i++) {
    if (data[i][pidName] == pid) {
      data[i].key = data[i][idName]
      data[i][childrenName] = getTreeData(data, data[i][idName], pidName, idName, childrenName)
      arr.push(data[i])
    }
  }

  return arr
}

// 遍历树节点
export function foreachTree(data, childrenName = 'children', callback) {
  for (let i = 0; i < data.length; i++) {
    callback(data[i])
    if (data[i][childrenName] && data[i][childrenName].length > 0) {
      foreachTree(data[i][childrenName], childrenName, callback)
    }
  }
}

// 追溯父节点
export function traceParentNode(pid, data, rootPid, pidName = 'parentId', idName = 'id', childrenName = 'children') {
  let arr = []
  foreachTree(data, childrenName, (node) => {
    if (node[idName] == pid) {
      arr.push(node)
      if (node[pidName] != rootPid) {
        arr = arr.concat(traceParentNode(node[pidName], data, rootPid, pidName, idName, childrenName))
      }
    }
  })
  return arr
}

// 寻找所有子节点
export function traceChildNode(id, data, pidName = 'parentId', idName = 'id', childrenName = 'children') {
  let arr = []
  foreachTree(data, childrenName, (node) => {
    if (node[pidName] == id) {
      arr.push(node)
      arr = arr.concat(traceChildNode(node[idName], data, pidName, idName, childrenName))
    }
  })
  return arr
}

// 根据pid生成树形结构
export function createTree(items, id = null, link = 'pid') {
  items.filter(item => item[link] === id).map(item => ({ ...item, children: createTree(items, item.id) }))
}
