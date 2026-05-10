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

##### 7.2 HTTP/3（QUIC）深度

**QUIC 为什么能解决队头阻塞**

TCP 的队头阻塞问题：HTTP/1.1 用管线化（pipelining）试图解决同连接串行，但 HTTP/2 的多路复用仍然受制于 TCP——当一个数据包丢包，所有流都要等待重传。

QUIC（UDP Quick Internet Congestion Control）解决了这个问题：
- QUIC 在用户态实现自己的拥塞控制，不依赖 UDP 本身
- QUIC 的流（stream）之间**完全独立**，一个流丢包不影响其他流
- 连接迁移（Connection Migration）：切换网络时不需要重建连接（通过 Connection ID）

```plaintext
HTTP/1.1：队头阻塞（串行请求）
HTTP/2：    多路复用（但受 TCP 丢包影响）
HTTP/3：    多路复用（流间独立，丢包只影响对应流）
```

##### 7.3 TLS 1.3 握手流程

**相比 TLS 1.2 的改进**
- 握手从 2-RTT 减少到 1-RTT（或 0-RTT）
- 去掉不安全的加密套件
- 前向保密（Forward Secrecy）成为强制要求

**1-RTT 握手**
```
Client                          Server
  │                               │
  │── ClientHello (支持的密码套件) ─→│
  │                               │
  │←── ServerHello (选中的密码套件) ─│
  │←── Certificate + ServerParams ─│
  │                               │
  │── Client Finished ───────────→│
  │                               │
  应用数据加密通信                  应用数据加密通信
```

**0-RTT（Resumption）**
- 前提：之前建立过连接，持有 PSK（Pre-Shared Key）
- 第一次往返就可以发送加密数据，但有重放攻击风险
- 适合：已知服务器的场景（如 CDN 预连接）

> **面试追问**：TLS 1.3 0-RTT 安全吗？——存在重放风险（攻击者截获并重放 0-RTT 数据），但不等于不安全，适合对重放不敏感的场景。

##### 7.4 连接复用深度对比

| 机制 | 原理 | 问题 |
|------|------|------|
| **HTTP/1.1 keep-alive** | TCP 连接复用，减少建连开销 | 同一时刻只能处理一个请求（串行） |
| **HTTP/1.1 pipeline** | 同一连接上排队发送多个请求 | 队头阻塞，服务器必须按序返回 |
| **HTTP/2 multiplexing** | 二进制分帧，多个流共享一个 TCP 连接 | TCP 层面的丢包仍会阻塞所有流 |
| **HTTP/3 QUIC** | 每个流独立，不受其他流丢包影响 | 相对较新，需要网络和 CDN 支持 |

##### 7.5 面试表达模板

先讲“HTTP 升级解决的核心问题”，再讲“各版本机制差异”，最后说“落地前提”。

关键链路：
- HTTP/1.1 → 队头阻塞 → HTTP/2 → 多路复用但受 TCP 限制 → HTTP/3 → 流间独立

> 建议补一句：实际项目中，HTTP/3 的收益在弱网和移动网络下更明显，固网环境下 HTTP/2 通常已经足够。

#### 8. 高频补充：HTTP 常见易混点

1. `301`（永久重定向）与 `302`（临时重定向）缓存语义不同。
2. `401` 是未认证，`403` 是已认证但无权限。
3. `GET` 通常用于幂等读取，`POST` 通常用于提交；但是否幂等本质取决于服务端语义。

#### 9. 高频补充：HTTPS 为什么更安全

- 机密性：对称加密保护传输内容。
- 完整性：防止中间人篡改报文。
- 身份认证：通过证书链验证服务端身份。

> 面试里建议补一句：HTTPS 不能防业务逻辑漏洞，它保护的是传输链路。