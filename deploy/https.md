# HTTPS 配置

## 简介

HTTPS（Hyper Text Transfer Protocol Secure）是以安全为目标的 HTTP 通道，在 HTTP 的基础上通过传输加密和身份认证保证了传输过程的安全性。

## SSL/TLS 证书

### 证书类型

- **DV（Domain Validation）**：域名验证，适合个人网站
- **OV（Organization Validation）**：组织验证，适合企业网站
- **EV（Extended Validation）**：扩展验证，适合金融、电商等

### 免费证书

#### Let's Encrypt

Let's Encrypt 是一个免费、自动化、开放的证书颁发机构。

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

#### 阿里云免费证书

在阿里云 SSL 证书控制台申请免费 DV 证书。

#### 腾讯云免费证书

在腾讯云 SSL 证书控制台申请免费 DV 证书。

## Nginx 配置 HTTPS

### 基本配置

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 优化配置

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## Node.js 配置 HTTPS

### 使用内置 https 模块

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private.key'),
  cert: fs.readFileSync('path/to/certificate.crt')
};

const server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Hello, HTTPS!');
});

server.listen(443, () => {
  console.log('HTTPS server running on port 443');
});
```

### 使用 Koa

```javascript
const Koa = require('koa');
const https = require('https');
const fs = require('fs');

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello, HTTPS!';
});

const options = {
  key: fs.readFileSync('path/to/private.key'),
  cert: fs.readFileSync('path/to/certificate.crt')
};

https.createServer(options, app.callback()).listen(443);
```

## CDN HTTPS 配置

### 阿里云 CDN

1. 在 CDN 控制台上传 SSL 证书
2. 开启 HTTPS 加速
3. 配置 HTTP/2
4. 设置强制跳转 HTTPS

### 腾讯云 CDN

1. 在 CDN 控制台配置 HTTPS 证书
2. 开启 HTTP/2
3. 配置强制跳转

## 自动化部署

### 使用 GitHub Actions 自动续期

```yaml
name: Renew SSL Certificate

on:
  schedule:
    - cron: '0 0 1 * *' # 每月执行一次

jobs:
  renew:
    runs-on: ubuntu-latest
    steps:
      - name: Install Certbot
        run: |
          sudo apt-get update
          sudo apt-get install certbot
      
      - name: Renew Certificate
        run: sudo certbot renew
        
      - name: Reload Nginx
        run: sudo systemctl reload nginx
```

## 安全最佳实践

### 1. 使用强加密套件

```nginx
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
```

### 2. 启用 HSTS

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 3. 禁用不安全的协议

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
```

### 4. 启用 OCSP Stapling

```nginx
ssl_stapling on;
ssl_stapling_verify on;
```

### 5. 定期更新证书

设置自动续期，避免证书过期。

## 相关链接

- [Let's Encrypt 官网](https://letsencrypt.org/)
- [Nginx SSL 配置文档](https://nginx.org/en/docs/http/configuring_https_servers.html)
- [SSL Labs 测试工具](https://www.ssllabs.com/ssltest/)