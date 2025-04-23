// 1. id为"rect"的矩形初始动画周期为10秒
// 2. id为"range"的滑块控件默认值为1、最小值为、最大值为10、滑动间隔为1
// 3. 当滑动滑块值为1时，矩形动画周期为10秒、当...，为...、当滑动滑块值为10时，矩形动画周期为1秒

const rect = document.getElementById('rect')
const range = document.getElementById('range')

range.addEventListener('change', () => {
  rect.style.animationDuration = `${11 - Number(range.value)}s`
})
