### 跨域解决方案
跨域是指浏览器同源策略限制下，不同源之间的资源访问。

#### 1. CORS（跨域资源共享）
##### 1.1 基本配置
```javascript
// 服务器端配置
app.use(cors({
  origin: 'https://example.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 响应头设置
res.setHeader('Access-Control-Allow-Origin', 'https://example.com');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
res.setHeader('Access-Control-Allow-Credentials', 'true');
```

##### 1.2 预检请求
```javascript
// 处理OPTIONS请求
app.options('/api/data', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://example.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.status(204).end();
});
```

#### 2. JSONP
##### 2.1 基本实现
```javascript
// 客户端
function jsonp(url, callback) {
  const script = document.createElement('script');
  const callbackName = 'jsonp_' + Math.random().toString(36).substr(2, 5);
  
  window[callbackName] = function(data) {
    callback(data);
    document.body.removeChild(script);
    delete window[callbackName];
  };
  
  script.src = `${url}?callback=${callbackName}`;
  document.body.appendChild(script);
}

// 使用示例
jsonp('https://api.example.com/data', function(data) {
  console.log(data);
});

// 服务器端
app.get('/api/data', (req, res) => {
  const callback = req.query.callback;
  const data = { message: 'Hello World' };
  res.send(`${callback}(${JSON.stringify(data)})`);
});
```

#### 3. 代理服务器
##### 3.1 Node.js代理
```javascript
// 使用http-proxy-middleware
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/api', createProxyMiddleware({
  target: 'https://api.example.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  }
}));

// 使用Express代理
app.use('/api', (req, res) => {
  const targetUrl = 'https://api.example.com' + req.url;
  request(targetUrl).pipe(res);
});
```

##### 3.2 Nginx代理
```nginx
# Nginx配置
server {
    listen 80;
    server_name example.com;

    location /api/ {
        proxy_pass https://api.example.com/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### 4. WebSocket
##### 4.1 基本实现
```javascript
// 客户端
const ws = new WebSocket('wss://api.example.com');

ws.onopen = () => {
  console.log('Connected to WebSocket');
  ws.send('Hello Server');
};

ws.onmessage = (event) => {
  console.log('Received:', event.data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// 服务器端
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send('Hello Client');
  });
});
```

#### 5. postMessage
##### 5.1 基本使用
```javascript
// 发送消息
window.parent.postMessage({
  type: 'message',
  data: 'Hello from iframe'
}, 'https://parent.example.com');

// 接收消息
window.addEventListener('message', (event) => {
  if (event.origin === 'https://parent.example.com') {
    console.log('Received:', event.data);
  }
});
```

#### 6. 最佳实践
1. 优先使用CORS
2. 合理配置安全策略
3. 处理预检请求
4. 使用代理服务器
5. 考虑性能影响
6. 实现错误处理
7. 监控跨域请求
8. 优化请求策略
9. 处理Cookie问题
10. 实现安全验证

#### 7. 常见面试题
1. **跨域问题的原因**
   - 同源策略
   - 安全限制
   - 浏览器实现
   - 应用场景

2. **不同解决方案的优缺点**
   - CORS
   - JSONP
   - 代理服务器
   - WebSocket

3. **如何选择解决方案**
   - 安全性要求
   - 性能考虑
   - 兼容性需求
   - 实现复杂度 