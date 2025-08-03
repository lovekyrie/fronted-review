class User {
  constructor(name) {
    this.name = name
  }

  // 错误示例：使用普通函数
  fetchUserData() {
    fetch('http://example.com/movies.json')
      .then(function (response) {
        // 可以看到我们是在then的回调函数里面调用了this.name, then的this指向fetch, fetch的this指向window (在浏览器中可以通过‘fetch' in window 来判断)
        // 这里的 this 指向 window 或 undefined
        console.log('this', this)
        console.log(this.name) // 报错：Cannot read property 'name' of undefined
      })
  }
}
const user = new User('John')
user.fetchUserData()

class DataService {
  constructor() {
    this.data = []
    this.baseUrl = 'https://api.example.com'
  }

  // 使用箭头函数处理异步操作
  async fetchData() {
    try {
      const response = await fetch(this.baseUrl)
      const data = await response.json()

      // 这个例子用了forEach，forEach的thisArg默认是undefined，在非严格模式下，this会被包装为globalThis，在严格模式下，this会被包装为undefined
      data.forEach(function (item) {
        console.log('this', this)
        this.processItem(item)
      }, this)

      // 使用箭头函数保持 this 上下文
      data.forEach((item) => {
        this.processItem(item)
      })
    }
    catch (error) {
      this.handleError(error)
    }
  }

  // 使用箭头函数处理事件
  setupWebSocket() {
    this.ws = new WebSocket('ws://example.com')

    this.ws.onmessage = (event) => {
      // 保持 this 上下文
      this.handleMessage(event.data)
    }
  }

  processItem(item) {
    this.data.push(item)
  }

  handleError(error) {
    console.error('Error:', error)
  }

  handleMessage(data) {
    console.log('Received:', data)
  }
}

const service = new DataService()
service.fetchData()
