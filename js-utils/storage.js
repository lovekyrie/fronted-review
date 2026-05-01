/**
 * 浏览器存储相关工具函数
 */

// localStorage 存贮
export function localStorageSet(key, value) {
  if (typeof (value) === 'object')
    value = JSON.stringify(value)
  localStorage.setItem(key, value)
}

// localStorage 获取
export function localStorageGet(key) {
  return localStorage.getItem(key)
}

// localStorage 移除
export function localStorageRemove(key) {
  localStorage.removeItem(key)
}

// localStorage 存贮某一段时间失效
export function localStorageSetExpire(key, value, expire) {
  if (typeof (value) === 'object')
    value = JSON.stringify(value)
  localStorage.setItem(key, value)
  setTimeout(() => {
    localStorage.removeItem(key)
  }, expire)
}

// sessionStorage 存贮
export function sessionStorageSet(key, value) {
  if (typeof (value) === 'object')
    value = JSON.stringify(value)
  sessionStorage.setItem(key, value)
}

// sessionStorage 获取
export function sessionStorageGet(key) {
  return sessionStorage.getItem(key)
}

// sessionStorage 删除
export function sessionStorageRemove(key) {
  sessionStorage.removeItem(key)
}

// sessionStorage 存贮某一段时间失效
export function sessionStorageSetExpire(key, value, expire) {
  if (typeof (value) === 'object')
    value = JSON.stringify(value)
  sessionStorage.setItem(key, value)
  setTimeout(() => {
    sessionStorage.removeItem(key)
  }, expire)
}

// cookie 存贮
export function cookieSet(key, value, expire) {
  const d = new Date()
  d.setDate(d.getDate() + expire)
  document.cookie = `${key}=${value};expires=${d.toUTCString()}`
}

// cookie 获取
export function cookieGet(key) {
  const cookieStr = unescape(document.cookie)
  const arr = cookieStr.split('; ')
  let cookieValue = ''
  for (let i = 0; i < arr.length; i++) {
    const temp = arr[i].split('=')
    if (temp[0] === key) {
      cookieValue = temp[1]
      break
    }
  }
  return cookieValue
}

// cookie 删除
export function cookieRemove(key) {
  document.cookie = `${encodeURIComponent(key)}=;expires=${new Date()}`
}
