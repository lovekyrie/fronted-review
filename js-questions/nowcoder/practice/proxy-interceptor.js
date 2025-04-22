function _proxy(object, ...prototypes) {
  // 补全代码
  return new Proxy(object, {
    get(target, prop) {
      if (prototypes.includes(prop)) {
        return 'noright'
      }
      else {
        return target[prop]
      }
    },
  })
}
