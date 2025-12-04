# Web Socket

## 1. 背景：HTTP 的短板

在 WebSocket 出现之前，如果服务器数据更新了，想要即时通知客户端（如股票走势、聊天室），通常只能通过以下方式：

*   **轮询 (Polling)**：浏览器每隔几秒请求一次服务器。“有数据吗？” “没有”。缺点：浪费带宽，服务器压力大。
*   **长轮询 (Long Polling)**：浏览器请求服务器，服务器 Hold 住连接，直到有数据才返回。缺点：仍需要频繁建立连接。

这些都是“**被动**”的，因为 HTTP 协议是**单向**的，只能由客户端发起。

## 2. WebSocket 简介

WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行**全双工通讯**的协议。
*   **全双工**：客户端可以发给服务器，服务器也可以主动发给客户端。
*   **持久连接**：一旦握手成功，连接保持，直到一方断开。
*   **轻量级头**：数据包头部很小，通信效率高。

## 3. API 使用

```javascript
// 1. 创建连接
var ws = new WebSocket("wss://echo.websocket.org");

// 2. 连接打开回调
ws.onopen = function(evt) { 
  console.log("Connection open ..."); 
  ws.send("Hello WebSockets!");
};

// 3. 接收消息回调
ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
  ws.close();
};

// 4. 连接关闭回调
ws.onclose = function(evt) {
  console.log("Connection closed.");
};
```

## 4. 面试高频点

### 心跳检测 (Heartbeat)
虽然 WebSocket 是持久连接，但受限于网络波动或防火墙策略，连接可能会断开。需要一种机制来保活。
*   **原理**：客户端每隔一段时间（如 30s）向服务器发送一个 `ping` 消息，服务器收到后回复 `pong`。
*   **目的**：确认连接是否正常，如果超时未收到回复，则认为连接断开，触发重连。

### 断线重连
在 `onclose` 或 `onerror` 事件触发时，尝试重新创建 WebSocket 连接。通常采用**指数退避算法**（1s, 2s, 4s, 8s...）来决定重连的间隔，避免网络拥堵时瞬间产生大量重连请求。

### vs HTTP Keep-Alive
*   **HTTP Keep-Alive**：只是复用 TCP 连接发送多个 HTTP 请求，本质还是 Request-Response 模式，服务器不能主动推。
*   **WebSocket**：真正的双向数据流。

