# 服务端部署

## 简介

服务端部署是将应用程序发布到生产环境的过程，包括服务器配置、应用部署、监控等环节。

## 部署方式

### 传统部署

#### 1. 服务器准备

```bash
# 更新系统
sudo apt-get update && sudo apt-get upgrade

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
sudo npm install -g pm2
```

#### 2. 代码部署

```bash
# 克隆代码
git clone your-repo-url
cd your-project

# 安装依赖
npm install --production

# 启动应用
pm2 start app.js --name myapp
```

#### 3. Nginx 配置

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker 部署

#### 1. 创建 Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### 2. 构建和运行

```bash
# 构建镜像
docker build -t myapp:latest .

# 运行容器
docker run -d -p 3000:3000 --name myapp myapp:latest
```

## PM2 常用命令

```bash
# 启动应用
pm2 start app.js

# 查看应用列表
pm2 list

# 查看日志
pm2 logs myapp

# 重启应用
pm2 restart myapp

# 停止应用
pm2 stop myapp

# 删除应用
pm2 delete myapp

# 监控
pm2 monit
```

## 环境变量管理

创建 `.env` 文件：

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://user:password@localhost:3306/mydb
```

使用 `dotenv` 加载：

```javascript
require('dotenv').config();
```

## SSL 证书配置

使用 Let's Encrypt：

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

## 监控和日志

### 日志管理

```bash
# 使用 PM2 日志
pm2 logs

# 日志轮转
pm2 install pm2-logrotate
```

### 性能监控

```bash
# PM2 监控
pm2 monit

# 或使用 PM2 Plus
pm2 link <secret_key> <public_key>
```

## 相关链接

- [PM2 官方文档](https://pm2.keymetrics.io/)
- [Docker 官方文档](https://docs.docker.com/)
- [Nginx 官方文档](https://nginx.org/en/docs/)