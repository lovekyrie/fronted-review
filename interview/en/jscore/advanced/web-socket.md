# WebSocket

## 1. Background: HTTP is a poor fit for push

Before WebSocket, if the server had new data (stock ticks, a chat room), the client usually had to poll:

*   **Polling**: the browser asks every few seconds. “Any data?” “No.” Wasteful and hard on the server.
*   **Long polling**: the browser asks and the server holds the request until data exists. You still reconnect often.

Both are **passive**. HTTP is **one-way**: only the client can start a request.

## 2. What WebSocket is

WebSocket is an HTML5 protocol for **full-duplex** communication over a single TCP connection.
*   **Full duplex**: the client can send, and the server can push.
*   **Persistent**: after the handshake, the connection stays up until one side closes it.
*   **Small headers**: frames are cheap, so it is efficient.

## 3. API

```javascript
// 1. Open a connection
var ws = new WebSocket("wss://echo.websocket.org");

// 2. Opened
ws.onopen = function(evt) { 
  console.log("Connection open ..."); 
  ws.send("Hello WebSockets!");
};

// 3. Message received
ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
  ws.close();
};

// 4. Closed
ws.onclose = function(evt) {
  console.log("Connection closed.");
};
```

## 4. High-frequency interview points

### Heartbeat
The connection is persistent, but networks and firewalls still drop it. You need a keep-alive.
*   **How**: every N seconds (e.g. 30s) the client sends `ping`; the server replies `pong`.
*   **Why**: if a reply times out, treat the socket as dead and reconnect.

### Reconnect
On `onclose` or `onerror`, open a new WebSocket. Use **exponential backoff** (1s, 2s, 4s, 8s…) so a flaky network does not stampede the server.

### vs HTTP Keep-Alive
*   **HTTP Keep-Alive**: reuses one TCP connection for many HTTP requests. Still request-response; the server cannot push.
*   **WebSocket**: a real bidirectional stream.
