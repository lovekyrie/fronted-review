### HTTP/HTTPS协议
HTTP（超文本传输协议）和HTTPS（安全超文本传输协议）是Web应用中最常用的协议。

#### 1. HTTP基础
##### 1.1 请求方法
```http
# GET请求
GET /api/users HTTP/1.1
Host: api.example.com
Accept: application/json

# POST请求
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 123

{
  "name": "John Doe",
  "email": "john@example.com"
}

# PUT请求
PUT /api/users/123 HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 123

{
  "name": "John Doe",
  "email": "john@example.com"
}

# DELETE请求
DELETE /api/users/123 HTTP/1.1
Host: api.example.com
```

##### 1.2 状态码
```http
# 2xx 成功
200 OK
201 Created
204 No Content

# 3xx 重定向
301 Moved Permanently
302 Found
304 Not Modified

# 4xx 客户端错误
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found

# 5xx 服务器错误
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
```

#### 2. HTTP特性
##### 2.1 无状态
```http
# 每次请求都是独立的
GET /api/users HTTP/1.1
Host: api.example.com
Cookie: session=abc123

# 使用Cookie保持状态
Set-Cookie: session=abc123; Path=/; HttpOnly
```

##### 2.2 请求/响应格式
```http
# 请求格式
GET /api/users HTTP/1.1
Host: api.example.com
Accept: application/json
User-Agent: Mozilla/5.0
Connection: keep-alive

# 响应格式
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 123
Date: Mon, 23 May 2022 22:38:34 GMT
Server: nginx

{
  "users": [
    {
      "id": 1,
      "name": "John Doe"
    }
  ]
}
```

#### 3. HTTPS
##### 3.1 加密过程
```plaintext
1. 客户端发起HTTPS请求
2. 服务器返回证书
3. 客户端验证证书
4. 生成对称密钥
5. 使用公钥加密对称密钥
6. 服务器使用私钥解密
7. 使用对称密钥加密通信
```

##### 3.2 证书配置
```nginx
# Nginx HTTPS配置
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

#### 4. 性能优化
##### 4.1 缓存控制
```http
# 缓存头
Cache-Control: max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT
```

##### 4.2 压缩
```http
# 请求压缩
Accept-Encoding: gzip, deflate, br

# 响应压缩
Content-Encoding: gzip
```

#### 5. 安全
##### 5.1 安全头
```http
# 安全响应头
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

##### 5.2 跨域
```http
# CORS响应头
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Credentials: true
```

#### 6. 常见面试题
1. **HTTP和HTTPS的区别**
   - 安全性
   - 加密方式
   - 端口号
   - 证书要求

2. **HTTP状态码分类**
   - 2xx成功
   - 3xx重定向
   - 4xx客户端错误
   - 5xx服务器错误

3. **如何优化HTTP性能**
   - 使用缓存
   - 启用压缩
   - 使用CDN
   - 减少请求数 

#### 7. 高频补充：HTTP1.1 / HTTP2 / HTTP3

##### 7.1 关键差异
- **HTTP/1.1**：文本协议，常见问题是队头阻塞（同连接请求排队）。
- **HTTP/2**：二进制分帧 + 多路复用 + 头部压缩（HPACK）。
- **HTTP/3**：基于 QUIC（UDP），弱网下连接迁移和抗丢包能力更好。

##### 7.2 面试表达模板
先说“为什么升级”（性能与稳定性），再说“核心机制”（多路复用/QUIC），最后说“落地前提”（服务端与 CDN 支持）。

#### 8. 高频补充：HTTP 常见易混点

1. `301`（永久重定向）与 `302`（临时重定向）缓存语义不同。
2. `401` 是未认证，`403` 是已认证但无权限。
3. `GET` 通常用于幂等读取，`POST` 通常用于提交；但是否幂等本质取决于服务端语义。

#### 9. 高频补充：HTTPS 为什么更安全

- 机密性：对称加密保护传输内容。
- 完整性：防止中间人篡改报文。
- 身份认证：通过证书链验证服务端身份。

> 面试里建议补一句：HTTPS 不能防业务逻辑漏洞，它保护的是传输链路。