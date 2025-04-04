function TimeLimitedCache() {
  this.map = new Map()
  this.timer = null
}

TimeLimitedCache.prototype.set = function (key, value, duration) {
  const isExist = this.cache.has(key)
  if (isExist) {
    clearTimeout(this.timer)
  }

  this.cache.set(key, value)
  this.timer = setTimeout(() => {
    this.cache.delete(key)
  }, duration)

  return Boolean(isExist)
}

TimeLimitedCache.prototype.get = function (key) {
  return this.cache.has(key) ? this.cache.get(key) : -1
}

TimeLimitedCache.prototype.count = function () {
  return this.cache.size()
}
