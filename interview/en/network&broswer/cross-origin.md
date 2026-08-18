### Cross-Origin Solutions
Cross-origin refers to accessing resources between different origins under the browser’s same-origin policy.

#### 1. CORS (Cross-Origin Resource Sharing)
##### 1.1 Basic configuration
```javascript
// Server-side configuration
app.use(cors({
  origin: 'https://example.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Response header settings
res.setHeader('Access-Control-Allow-Origin', 'https://example.com');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
res.setHeader('Access-Control-Allow-Credentials', 'true');
```

##### 1.2 Preflight requests
```javascript
// Handle OPTIONS requests
app.options('/api/data', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://example.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.status(204).end();
});
```

#### 2. JSONP
##### 2.1 Basic implementation
```javascript
// Client
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

// Usage example
jsonp('https://api.example.com/data', function(data) {
  console.log(data);
});

// Server
app.get('/api/data', (req, res) => {
  const callback = req.query.callback;
  const data = { message: 'Hello World' };
  res.send(`${callback}(${JSON.stringify(data)})`);
});
```

#### 3. Proxy server
##### 3.1 Node.js proxy
```javascript
// Use http-proxy-middleware
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/api', createProxyMiddleware({
  target: 'https://api.example.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  }
}));

// Use an Express proxy
app.use('/api', (req, res) => {
  const targetUrl = 'https://api.example.com' + req.url;
  request(targetUrl).pipe(res);
});
```

##### 3.2 Nginx proxy
```nginx
# Nginx configuration
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
##### 4.1 Basic implementation
```javascript
// Client
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

// Server
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
##### 5.1 Basic usage
```javascript
// Send a message
window.parent.postMessage({
  type: 'message',
  data: 'Hello from iframe'
}, 'https://parent.example.com');

// Receive a message
window.addEventListener('message', (event) => {
  if (event.origin === 'https://parent.example.com') {
    console.log('Received:', event.data);
  }
});
```

#### 6. Best practices
1. Prefer CORS
2. Configure security policy carefully
3. Handle preflight requests
4. Use a proxy server
5. Consider performance impact
6. Implement error handling
7. Monitor cross-origin requests
8. Optimize request strategy
9. Handle Cookie issues
10. Implement security checks

#### 7. Common interview questions
1. **Why cross-origin problems happen**
   - Same-origin policy
   - Security restrictions
   - Browser implementation
   - Application scenarios

2. **Pros and cons of different solutions**
   - CORS
   - JSONP
   - Proxy server
   - WebSocket

3. **How to choose a solution**
   - Security requirements
   - Performance considerations
   - Compatibility needs
   - Implementation complexity

#### 8. Commonly missed follow-ups (cross-origin)

##### 8.1 When does a preflight (OPTIONS) fire
- The method is not GET/HEAD/POST (e.g. PUT/DELETE/PATCH).
- Or the request includes custom headers.
- Or `Content-Type` is not a simple value (e.g. `application/json` usually triggers it).

##### 8.2 Common CORS configuration pitfalls
1. `Access-Control-Allow-Origin: *` cannot be used together with `Allow-Credentials: true`.
2. Passing preflight does not mean the actual request will succeed — business auth still applies.
3. Frontend `withCredentials`, backend CORS, and Cookie SameSite must be aligned together.

##### 8.3 Why we say “cross-origin is a browser restriction, not a server restriction”
Server-to-server requests are not subject to the same-origin policy; SOP is a browser security model.  
So in many cases a BFF/proxy layer can architecturally avoid frontend cross-origin issues.

##### 8.4 Fast interview answer
Start with the principle (same-origin policy), then the main solution (CORS), then alternatives and boundaries (proxy, WebSocket, postMessage).
