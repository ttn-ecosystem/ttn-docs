# WebSocket

## 简介

WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议。WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。

## 特点

- 全双工通信
- 较少的控制开销
- 保持连接状态
- 更强的实时性

## 基本使用

### 服务端（Node.js）

使用 `ws` 库：

```bash
npm install ws
```

```javascript
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('客户端已连接');
  
  ws.on('message', function incoming(message) {
    console.log('收到消息: %s', message);
    ws.send('服务器收到: ' + message);
  });
  
  ws.send('欢迎连接到 WebSocket 服务器');
});

console.log('WebSocket 服务器运行在 ws://localhost:8080');
```

### 客户端（浏览器）

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = function() {
  console.log('连接已建立');
  ws.send('Hello Server!');
};

ws.onmessage = function(event) {
  console.log('收到消息: ' + event.data);
};

ws.onerror = function(error) {
  console.error('WebSocket 错误: ' + error);
};

ws.onclose = function() {
  console.log('连接已关闭');
};
```

## Koa 集成

```bash
npm install koa-websocket
```

```javascript
const Koa = require('koa');
const websockify = require('koa-websocket');

const app = websockify(new Koa());

app.ws.use(function(ctx, next) {
  return next(ctx);
});

app.ws.use(function(ctx) {
  ctx.websocket.send('Hello World');
  ctx.websocket.on('message', function(message) {
    console.log(message);
  });
});

app.listen(3000);
```

## 相关链接

- [WebSocket MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
- [ws 库文档](https://github.com/websockets/ws)