# OSS 部署

## 简介

OSS（Object Storage Service）对象存储服务是一种海量、安全、低成本、高可靠的云存储服务，适合存放任意类型的文件。

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

// 下载文件
async function downloadFile() {
  try {
    const result = await client.get('object-key', 'local-file-path');
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

// 删除文件
async function deleteFile() {
  try {
    const result = await client.delete('object-key');
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}
```

### 静态网站托管

```javascript
// 设置静态网站托管
async function setWebsite() {
  try {
    const result = await client.putBucketWebsite('your-bucket-name', {
      index: 'index.html',
      error: 'error.html'
    });
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}
```

## 腾讯云 COS

### 安装 SDK

```bash
npm install cos-nodejs-sdk-v5
```

### 基本使用

```javascript
const COS = require('cos-nodejs-sdk-v5');

const cos = new COS({
  SecretId: 'your-secret-id',
  SecretKey: 'your-secret-key'
});

// 上传文件
cos.uploadFile({
  Bucket: 'your-bucket-name',
  Region: 'your-region',
  Key: 'object-key',
  FilePath: 'local-file-path'
}, function(err, data) {
  console.log(err || data);
});
```

## 部署流程

### 1. 构建项目

```bash
npm run build
```

### 2. 上传到 OSS

```bash
# 使用 ossutil 命令行工具
ossutil cp -r ./dist oss://your-bucket-name/
```

### 3. 配置 CDN 加速

在 OSS 控制台配置 CDN 加速域名。

## 自动化部署

### 使用 GitHub Actions

```yaml
name: Deploy to OSS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to OSS
        uses: manyuanrong/setup-ossutil@v2.0
        with:
          endpoint: oss-cn-hangzhou.aliyuncs.com
          access-key-id: ${{ secrets.OSS_ACCESS_KEY_ID }}
          access-key-secret: ${{ secrets.OSS_ACCESS_KEY_SECRET }}
          
      - run: ossutil cp -rf ./dist oss://your-bucket-name/
```

## 相关链接

- [阿里云 OSS 文档](https://help.aliyun.com/product/31815.html)
- [腾讯云 COS 文档](https://cloud.tencent.com/document/product/436)