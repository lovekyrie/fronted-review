### HTTP/HTTPS Protocol
HTTP (Hypertext Transfer Protocol) and HTTPS (HTTP Secure) are the most commonly used protocols in web applications.

#### 1. HTTP Basics
##### 1.1 Request Methods
```http
# GET request
GET /api/users HTTP/1.1
Host: api.example.com
Accept: application/json

# POST request
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 123

{
  "name": "John Doe",
  "email": "john@example.com"
}

# PUT request
PUT /api/users/123 HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 123

{
  "name": "John Doe",
  "email": "john@example.com"
}

# DELETE request
DELETE /api/users/123 HTTP/1.1
Host: api.example.com
```

##### 1.2 Status Codes
```http
# 2xx Success
200 OK
201 Created
204 No Content

# 3xx Redirection
301 Moved Permanently
302 Found
304 Not Modified

# 4xx Client error
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found

# 5xx Server error
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
```

#### 2. HTTP Characteristics
##### 2.1 Stateless
```http
# Each request is independent
GET /api/users HTTP/1.1
Host: api.example.com
Cookie: session=abc123

# Use cookies to keep state
Set-Cookie: session=abc123; Path=/; HttpOnly
```

##### 2.2 Request/Response Format
```http
# Request format
GET /api/users HTTP/1.1
Host: api.example.com
Accept: application/json
User-Agent: Mozilla/5.0
Connection: keep-alive

# Response format
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
##### 3.1 Encryption Process
```plaintext
1. The client initiates an HTTPS request
2. The server returns a certificate
3. The client verifies the certificate
4. A symmetric key is generated
5. The symmetric key is encrypted with the public key
6. The server decrypts it with the private key
7. Subsequent communication is encrypted with the symmetric key
```

##### 3.2 Certificate Configuration
```nginx
# Nginx HTTPS configuration
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

#### 4. Performance Optimization
##### 4.1 Cache Control
```http
# Cache headers
Cache-Control: max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT
```

##### 4.2 Compression
```http
# Request compression
Accept-Encoding: gzip, deflate, br

# Response compression
Content-Encoding: gzip
```

#### 5. Security
##### 5.1 Security Headers
```http
# Security response headers
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

##### 5.2 Cross-Origin
```http
# CORS response headers
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Credentials: true
```

#### 6. Common Interview Questions
1. **Differences between HTTP and HTTPS**
   - Security
   - Encryption
   - Port numbers
   - Certificate requirements

2. **HTTP status code categories**
   - 2xx success
   - 3xx redirection
   - 4xx client error
   - 5xx server error

3. **How to optimize HTTP performance**
   - Use caching
   - Enable compression
   - Use a CDN
   - Reduce the number of requests

#### 7. High-Frequency Extra: HTTP/1.1 / HTTP/2 / HTTP/3

##### 7.1 Key Differences
- **HTTP/1.1**: A text protocol. A common issue is head-of-line blocking (requests queue on the same connection).
- **HTTP/2**: Binary framing + multiplexing + header compression (HPACK).
- **HTTP/3**: Built on QUIC (UDP). Connection migration and loss resilience are better on weak networks.

##### 7.2 HTTP/3 (QUIC) in Depth

**Why QUIC can solve head-of-line blocking**

TCP head-of-line blocking: HTTP/1.1 tried pipelining to avoid serializing requests on the same connection, but HTTP/2 multiplexing is still constrained by TCP — when one packet is lost, all streams wait for retransmission.

QUIC (UDP Quick Internet Congestion Control) solves this:
- QUIC implements its own congestion control in user space and does not rely on UDP itself
- QUIC streams are **fully independent**; packet loss on one stream does not affect others
- Connection Migration: switching networks does not require rebuilding the connection (via Connection ID)

```plaintext
HTTP/1.1: HOL blocking (serial requests)
HTTP/2:    Multiplexing (but still affected by TCP packet loss)
HTTP/3:    Multiplexing (streams are independent; loss only affects that stream)
```

##### 7.3 TLS 1.3 Handshake

**Improvements over TLS 1.2**
- Handshake reduced from 2-RTT to 1-RTT (or 0-RTT)
- Insecure cipher suites removed
- Forward Secrecy became mandatory

**1-RTT handshake**
```
Client                          Server
  │                               │
  │── ClientHello (supported cipher suites) ─→│
  │                               │
  │←── ServerHello (selected cipher suite) ─│
  │←── Certificate + ServerParams ─│
  │                               │
  │── Client Finished ───────────→│
  │                               │
  Encrypted application data      Encrypted application data
```

**0-RTT (Resumption)**
- Prerequisite: a previous connection exists and a PSK (Pre-Shared Key) is held
- Encrypted data can be sent on the first round trip, but there is a replay-attack risk
- Suitable for: scenarios where the server is already known (e.g. CDN preconnect)

> **Interview follow-up**: Is TLS 1.3 0-RTT safe? — There is a replay risk (an attacker can intercept and replay 0-RTT data), but that does not mean it is unsafe. It is suitable for scenarios that are not sensitive to replay.

##### 7.4 Connection Reuse in Depth

| Mechanism | How it works | Problem |
|------|------|------|
| **HTTP/1.1 keep-alive** | Reuses a TCP connection to reduce handshake cost | Only one request can be handled at a time (serial) |
| **HTTP/1.1 pipeline** | Queues multiple requests on the same connection | HOL blocking; the server must respond in order |
| **HTTP/2 multiplexing** | Binary framing; multiple streams share one TCP connection | Packet loss at the TCP layer still blocks all streams |
| **HTTP/3 QUIC** | Each stream is independent and unaffected by loss on others | Relatively new; needs network and CDN support |

##### 7.5 Interview Answer Template

First explain “the core problem HTTP upgrades solve”, then “mechanism differences across versions”, and finally “prerequisites for production use”.

Key chain:
- HTTP/1.1 → HOL blocking → HTTP/2 → multiplexing but limited by TCP → HTTP/3 → independent streams

> Suggested extra sentence: In real projects, HTTP/3 gains are more obvious on weak and mobile networks; on wired networks, HTTP/2 is usually enough.

#### 8. High-Frequency Extra: Easy-to-Mix HTTP Points

1. `301` (permanent redirect) and `302` (temporary redirect) have different cache semantics.
2. `401` means unauthenticated; `403` means authenticated but not authorized.
3. `GET` is usually used for idempotent reads, `POST` for submissions; whether a request is idempotent ultimately depends on server semantics.

#### 9. High-Frequency Extra: Why HTTPS Is More Secure

- Confidentiality: symmetric encryption protects the payload.
- Integrity: prevents a man-in-the-middle from tampering with messages.
- Authentication: verifies the server identity via the certificate chain.

> In interviews, add one more sentence: HTTPS does not prevent business-logic vulnerabilities; it protects the transport path.
