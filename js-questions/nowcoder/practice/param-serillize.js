function _getParams(url) {
  // 补全代码
  const params = url.split('?')[1]
  const paramsObj = {}
  params.split('&').forEach((param) => {
    const [key, value] = param.split('=')
    paramsObj[key] = value
  })
  return paramsObj
}
