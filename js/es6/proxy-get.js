const dom = new Proxy(
  {},
  {
    get(target, property) {
      return function (attrs = {}, ...children) {
        const el = document.createElement(property)
        for (const prop of Object.keys(attrs)) {
          el.setAttribute(prop, attrs[prop])
        }
        for (let child of children) {
          if (typeof child === 'string') {
            child = document.createTextNode(child)
          }
          el.appendChild(child)
        }
        return el
      }
    },
  },
)

// 先循环的是a,跟ul,最后才处理整个div
const el = dom.div(
  {},
  'Hello, my name is ',
  dom.a({ href: '//example.com' }, 'Mark'),
  '. I like:',
  dom.ul(
    {},
    dom.li({}, 'The web'),
    dom.li({}, 'Food'),
    dom.li({}, '…actually that\'s it'),
  ),
)

document.body.appendChild(el)
