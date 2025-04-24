### 浏览器缓存机制
浏览器缓存分为强缓存和协商缓存，用于提高网页加载速度和减少服务器压力。

#### 1. 强缓存
##### 1.1 基本概念
```http
# 强缓存响应头
Cache-Control: max-age=31536000
Expires: Wed, 21 Oct 2023 07:28:00 GMT
```

##### 1.2 缓存控制
```http
# 禁止缓存
Cache-Control: no-store

# 强制验证
Cache-Control: no-cache

# 私有缓存
Cache-Control: private

# 公共缓存
Cache-Control: public

# 最大过期时间
Cache-Control: max-age=3600

# 共享最大过期时间
Cache-Control: s-maxage=3600
```

#### 2. 协商缓存
##### 2.1 基本概念
```http
# 请求头
If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# 响应头
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

##### 2.2 验证过程
```http
# 第一次请求
GET /index.html HTTP/1.1
Host: example.com

HTTP/1.1 200 OK
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Content-Length: 1234

# 第二次请求
GET /index.html HTTP/1.1
Host: example.com
If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

HTTP/1.1 304 Not Modified
```

#### 3. 缓存流程
##### 3.1 强缓存流程
```plaintext
1. 浏览器发起请求
2. 检查强缓存是否过期
   - 未过期：直接使用缓存
   - 已过期：进入协商缓存
3. 返回缓存内容
```

##### 3.2 协商缓存流程
```plaintext
1. 浏览器发起请求
2. 检查协商缓存
   - 资源未修改：返回304
   - 资源已修改：返回200和新资源
3. 更新缓存
```

#### 4. 缓存策略
##### 4.1 静态资源
```http
# HTML文件
Cache-Control: no-cache

# CSS/JS文件
Cache-Control: max-age=31536000

# 图片文件
Cache-Control: max-age=31536000
```

##### 4.2 动态资源
```http
# API响应
Cache-Control: no-store

# 用户数据
Cache-Control: private, no-cache
```

#### 5. 最佳实践
1. 合理设置缓存时间
2. 使用版本号或哈希
3. 区分静态和动态资源
4. 实现缓存更新机制
5. 处理缓存失效
6. 考虑CDN缓存
7. 监控缓存命中率
8. 优化缓存策略
9. 处理缓存冲突
10. 实现缓存预热

#### 6. 常见面试题
1. **强缓存和协商缓存的区别**
   - 验证方式
   - 响应状态
   - 使用场景
   - 性能影响

2. **如何选择合适的缓存策略**
   - 资源类型
   - 更新频率
   - 用户需求
   - 服务器负载

3. **如何处理缓存问题**
   - 缓存穿透
   - 缓存击穿
   - 缓存雪崩
   - 缓存更新 