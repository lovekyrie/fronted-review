/**
 * 浏览器操作相关工具函数
 */

// 返回当前url
export const currentURL = () => window.location.href

// 获取url参数（第一种）
export function getUrlParam(name, origin = null) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  let r = null
  if (origin == null) {
    r = window.location.search.substr(1).match(reg)
  }
  else {
    r = origin.substr(1).match(reg)
  }
  if (r != null)
    return decodeURIComponent(r[2])
  return null
}

// 获取url参数（第二种）
export function getUrlParams(name, origin = null) {
  const url = location.href
  const temp1 = url.split('?')
  const pram = temp1[1]
  const keyValue = pram.split('&')
  const obj = {}
  for (let i = 0; i < keyValue.length; i++) {
    const item = keyValue[i].split('=')
    const key = item[0]
    const value = item[1]
    obj[key] = value
  }
  return obj[name]
}

// 修改url中的参数
export function replaceParamVal(paramName, replaceWith) {
  const oUrl = location.href.toString()
  const re = new RegExp(`(${paramName}=)([^&]*)`, 'gi')
  location.href = oUrl.replace(re, `${paramName}=${replaceWith}`)
  return location.href
}

// 删除url中指定的参数
export function funcUrlDel(name) {
  const loca = location
  const baseUrl = `${loca.origin + loca.pathname}?`
  const query = loca.search.substr(1)
  if (query.includes(name)) {
    const obj = {}
    const arr = query.split('&')
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('=')
      obj[arr[i][0]] = arr[i][1]
    }
    delete obj[name]
    const url = baseUrl + JSON.stringify(obj).replace(/["{}]/g, '').replace(/:/g, '=').replace(/,/g, '&')
    return url
  }
}

// 获取窗口可视范围的高度
export function getClientHeight() {
  let clientHeight = 0
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight = (document.body.clientHeight < document.documentElement.clientHeight)
      ? document.body.clientHeight
      : document.documentElement.clientHeight
  }
  else {
    clientHeight = (document.body.clientHeight > document.documentElement.clientHeight)
      ? document.body.clientHeight
      : document.documentElement.clientHeight
  }
  return clientHeight
}

// 获取窗口可视范围宽度
export function getPageViewWidth() {
  const d = document
  const a = d.compatMode === 'BackCompat' ? d.body : d.documentElement
  return a.clientWidth
}

// 获取窗口宽度
export function getPageWidth() {
  const g = document
  const a = g.body
  const f = g.documentElement
  const d = g.compatMode === 'BackCompat' ? a : g.documentElement
  return Math.max(f.scrollWidth, a.scrollWidth, d.clientWidth)
}

// 获取窗口尺寸
export function getViewportOffset() {
  if (window.innerWidth) {
    return {
      w: window.innerWidth,
      h: window.innerHeight,
    }
  }
  else {
    if (document.compatMode === 'BackCompat') {
      return {
        w: document.body.clientWidth,
        h: document.body.clientHeight,
      }
    }
    else {
      return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight,
      }
    }
  }
}

// 获取滚动条距顶部高度
export function getPageScrollTop() {
  const a = document
  return a.documentElement.scrollTop || a.body.scrollTop
}

// 获取滚动条距左边的高度
export function getPageScrollLeft() {
  const a = document
  return a.documentElement.scrollLeft || a.body.scrollLeft
}

// 开启全屏
export function launchFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  }
  else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  }
  else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  }
  else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen()
  }
}

// 关闭全屏
export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  }
  else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
  else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  }
  else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}

// 返回当前滚动条位置
export function getScrollPosition(el = window) {
  return {
    x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
    y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop,
  }
}

// 滚动到指定元素区域
export function smoothScroll(element) {
  document.querySelector(element).scrollIntoView({
    behavior: 'smooth',
  })
}

// 平滑滚动到页面顶部
export function scrollToTop() {
  const c = document.documentElement.scrollTop || document.body.scrollTop
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop)
    window.scrollTo(0, c - c / 8)
  }
}

// http跳转https
export function httpsRedirect() {
  if (location.protocol !== 'https:')
    location.replace(`https://${location.href.split('//')[1]}`)
}

// 检查页面底部是否可见
export function bottomVisible() {
  return document.documentElement.clientHeight + window.scrollY
    >= (document.documentElement.scrollHeight || document.documentElement.clientHeight)
}

// 打开一个窗口
export function openWindow(url, windowName, width, height) {
  const x = Number.parseInt(screen.width / 2.0) - width / 2.0
  const y = Number.parseInt(screen.height / 2.0) - height / 2.0
  const isMSIE = navigator.appName === 'Microsoft Internet Explorer'
  if (isMSIE) {
    let p = 'resizable=1,location=no,scrollbars=no,width='
    p = p + width
    p = `${p},height=`
    p = p + height
    p = `${p},left=`
    p = p + x
    p = `${p},top=`
    p = p + y
    window.open(url, windowName, p)
  }
  else {
    const win = window.open(
      url,
      'ZyiisPopup',
      `top=${y},left=${x},scrollbars=${scrollbars},dialog=yes,modal=yes,width=${width},height=${height},resizable=no`,
    )
    try {
      win.resizeTo(width, height)
    }
    catch (e) {
      // do nothing
    }
    win.focus()
  }
}

// 自适应页面（rem）
export function AutoResponse(width = 750) {
  const target = document.documentElement
  target.clientWidth >= 600
    ? (target.style.fontSize = '80px')
    : (target.style.fontSize = `${target.clientWidth / width * 100}px`)
}

// 检测移动/PC设备
export function detectDeviceType() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? 'Mobile'
    : 'Desktop'
}

// 隐藏所有指定标签
export const hideTag = (...el) => [...el].forEach(e => (e.style.display = 'none'))

// 返回指定元素的生效样式
export const getStyle = (el, ruleName) => getComputedStyle(el)[ruleName]

// 检查是否包含子元素
export const elementContains = (parent, child) => parent !== child && parent.contains(child)
