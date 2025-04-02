// 可以看到eslint也不支持let声明的变量直接导出
// eslint-disable-next-line import/no-mutable-exports
export let a = ''
setTimeout(() => {
  a = 'a'
}, 500)
