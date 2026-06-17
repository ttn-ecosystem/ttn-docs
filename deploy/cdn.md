# CDN 内容分发网络

## 简介

CDN（Content Delivery Network）内容分发网络，通过将源站内容分发至靠近用户的加速节点，使用户可以就近获得所需的内容，解决 Internet 网络拥挤的状况，提高用户访问网站的响应速度和成功率。

## 工作原理

1. 用户向 CDN 节点请求内容
2. CDN 节点检查是否有缓存
3. 如果有缓存，直接返回给用户
4. 如果没有缓存，CDN 节点向源站请求内容
5. CDN 节点缓存内容并返回给用户

## 阿里云 CDN

### 基本配置

```javascript
const Core = require('@alicloud/pop-core');

const client = new Core({
  accessKeyId: 'your-access-key-id',
  accessKeySecret: 'your-access-key-secret',
  endpoint: 'https://cdn.aliyuncs.com',
  apiVersion: '2018-05-10'
});

// 刷新缓存
async function refreshCache(urls) {
  const params = {
    ObjectPath: urls.join('\n')
  };
  
  try {
    const result = await client.request('RefreshObjectCaches', params, {method: 'POST'});
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

// 预热缓存
async function preloadCache(urls) {
  const params = {
    Area: 'domestic',
    ObjectPath: urls.join('\n')
  };
  
  try {
    const result = await client.request('PushObjectCache', params, {method: 'POST'});
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}
```

## 腾讯云 CDN

### 安装 SDK

```bash
npm install tencentcloud-sdk-nodejs
```

### 基本使用

```javascript
const tencentcloud = require("tencentcloud-sdk-nodejs");

const CdnClient = tencentcloud.cdn.v20180606.Client;

const client = new CdnClient({
  credential: {
    secretId: "your-secret-id",
    secretKey: "your-secret-key",
  },
  region: "",
  profile: {
    httpProfile: {
      endpoint: "cdn.tencentcloudapi.com",
    },
  },
});

// 刷新 URL
async function purgeUrlsCache(urls) {
  const params = {
    Urls: urls
  };
  
  try {
    const result = await client.PurgeUrlsCache(params);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

// 刷新目录
async function purgePathsCache(paths) {
  const params = {
    Paths: paths,
    FlushType: 'flush'
  };
  
  try {
    const result = await client.PurgePathsCache(params);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}
```

## CDN 优化策略

### 缓存规则配置

```
# 静态资源长期缓存
*.js, *.css -> 缓存 1 年
*.jpg, *.png, *.gif -> 缓存 30 天
*.html -> 缓存 1 小时

# 动态资源不缓存
*.php, *.jsp -> 不缓存
```

### HTTP 头配置

```
Cache-Control: max-age=31536000
Expires: Thu, 31 Dec 2037 23:55:55 GMT
```

### Gzip 压缩

在 CDN 控制台开启 Gzip 压缩，减少传输大小。

## 性能监控

### 关键指标

- **命中率**：缓存命中率越高越好
- **响应时间**：平均响应时间
- **带宽**：峰值带宽和平均带宽
- **请求数**：总请求数和 QPS

### 监控脚本

```javascript
async function getMonitorData(domain, startTime, endTime) {
  const params = {
    DomainName: domain,
    StartTime: startTime,
    EndTime: endTime
  };
  
  try {
    const result = await client.DescribeDomainDetailDataByLayer(params);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}
```

## 部署流程

1. **配置源站**：设置 OSS 或服务器作为源站
2. **添加域名**：在 CDN 控制台添加加速域名
3. **配置 CNAME**：在域名解析中配置 CNAME 记录
4. **配置缓存规则**：根据文件类型设置缓存时间
5. **开启 HTTPS**：配置 SSL 证书
6. **测试验证**：验证 CDN 是否正常工作

## 相关链接

- [阿里云 CDN 文档](https://help.aliyun.com/product/27099.html)
- [腾讯云 CDN 文档](https://cloud.tencent.com/document/product/228)