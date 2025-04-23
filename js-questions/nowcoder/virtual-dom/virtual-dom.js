let vnode = {
  tag: 'ul',
  props: {
    class: 'list',
  },
  text: '',
  children: [
    {
      tag: 'li',
      props: {
        class: 'item',
      },
      text: '',
      children: [
        {
          tag: undefined,
          props: {},
          text: '牛客网',
          children: [],
        },
      ],
    },
    {
      tag: 'li',
      props: {},
      text: '',
      children: [
        {
          tag: undefined,
          props: {},
          text: 'nowcoder',
          children: [],
        },
      ],
    },
  ],
}
function _createElm(vnode) {
  // 补全代码
  if (vnode.tag) {
    const el = document.createElement(vnode.tag)
    if (vnode.props) {
      Object.keys(vnode.props).forEach((key) => {
        if (key === 'class') {
          el.className = vnode.props[key]
        }
        else {
          el[key] = vnode.props[key]
        }
      })
    }
    if (vnode.text) {
      el.textContent = vnode.text
    }
    if (vnode.children) {
      vnode.children.forEach((child) => {
        const childEl = _createElm(child)
        if (childEl) {
          el.appendChild(childEl)
        }
      })
    }
    return el
  }
  return document.createTextNode(vnode.text)
}
const root = _createElm(vnode)
document.body.appendChild(root)
