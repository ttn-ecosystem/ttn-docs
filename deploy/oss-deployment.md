# OSS 部署

## 对象存储服务
上传的每个文件，实际上都被当成一个 Object（对象） 存储，而不是传统文件系统中的文件。
- 传统文件存储
```
路径：/home/project/dist/index.html

文件系统会维护：
├── home
│   ├── project
│   │   ├── dist
│   │   │   └── index.html
```
访问的时候：
```
路径查找 -> inode(索引节点，记录文件元信息) -> 磁盘块 -> 读取文件
```
- OSS 存储不关心目录
```
snapposter.top/0.0.1/index.html

在 oss 内部：
{
  "snapposter.top/0.0.1/index.html": "...html...",
  "snapposter.top/0.0.1/main.js": "...js..."
}
```
- OSS 文件上传
```
上传: index.html
执行：ossutil cp index.html oss://ttn-cli/
流程：客户端 -> HTTPS -> OSS接入层 -> 元数据服务 -> 存储节点
```
元数据，保存到元数据集群。
```json
{
  "bucket": "ttn-cli",
  "key": "index.html",
  "size": 1024,
  "etag": "abc123",
  "contentType": "text/html"
}
```
文件数据，保存到存储集群。
```html
<html>
hello
</html>
```
- OSS 可以无限扩容
  传统服务器 500GB，如果满了，扩盘 / 换机器。
  OSS：底层运行多台机器，系统自动决定在哪台机器上存储。分布式存储的扩容 = 加机器，而不是扩盘。

- OSS 高可用
  在 OSS 上存储文件之后，文件会被复制到多个存储节点上，以确保高可用。如果某个存储节点故障，文件可以继续从其他存储节点读取。

- OSS 和 SSH 比较
```
OSS 并不是因为 HTTP 比 SSH 快，而是因为 OSS 背后是大规模分布式存储集群，
并且天然结合 CDN，能够支撑远超单机文件系统的容量和并发访问能力。
```

## 阿里云 OSS

### 安装 SDK
```bash
npm install ali-oss
```

### 基本使用

```javascript
const OSS = require('ali-oss');

const client = new OSS({
  region: 'your-region',
  accessKeyId: 'your-access-key-id',
  accessKeySecret: 'your-access-key-secret',
  bucket: 'your-bucket-name'
});

// 上传文件
async function uploadFile() {
  try {
    const result = await client.put('object-key', 'local-file-path');
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}
```
## ttn-cli 中 OSS 密钥存储 TODO 待完善
```
CLI 登录
     │
     ▼
请求：
POST /sts/token

后端：
生成临时Token

返回：
AccessKeyId
AccessKeySecret
SecurityToken

CLI：
直接上传OSS
```