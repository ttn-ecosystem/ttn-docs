# ttn-cli 后端部署

## 简介

ttn-cli 后端部署是 ttn-cli 工具链的重要组成部分，提供了自动化的后端项目部署能力。

## 部署方式

### 1. 传统服务器部署

#### 准备工作

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
sudo npm install -g pm2

# 安装 Nginx
sudo apt-get install nginx
```

#### 部署脚本

```javascript
// deploy.js
const { execSync } = require('child_process');
const fs = require('fs');

class BackendDeploy {
  constructor(config) {
    this.config = config;
    this.deployPath = config.deployPath || '/var/www/app';
    this.backupPath = config.backupPath || '/var/backups/app';
  }
  
  // 部署前检查
  preDeploy() {
    console.log('Running pre-deploy checks...');
    
    // 检查必要文件
    const requiredFiles = ['package.json', 'app.js'];
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Required file missing: ${file}`);
      }
    }
    
    // 检查环境变量
    if (!process.env.NODE_ENV) {
      throw new Error('NODE_ENV is not set');
    }
    
    console.log('Pre-deploy checks passed');
  }
  
  // 安装依赖
  installDependencies() {
    console.log('Installing dependencies...');
    execSync('npm install --production', { stdio: 'inherit' });
    console.log('Dependencies installed');
  }
  
  // 构建项目
  build() {
    console.log('Building project...');
    if (fs.existsSync('npm run build')) {
      execSync('npm run build', { stdio: 'inherit' });
    }
    console.log('Build completed');
  }
  
  // 备份当前版本
  backup() {
    const timestamp = Date.now();
    const backupDir = path.join(this.backupPath, `backup-${timestamp}`);
    
    console.log(`Creating backup at ${backupDir}...`);
    execSync(`mkdir -p ${backupDir}`);
    execSync(`cp -r ${this.deployPath}/* ${backupDir}/`);
    console.log('Backup created');
  }
  
  // 部署
  deploy() {
    console.log('Deploying application...');
    
    // 停止应用
    execSync(`pm2 stop ${this.config.appName}`, { stdio: 'inherit' });
    
    // 复制文件
    execSync(`rsync -av --exclude='node_modules' ./ ${this.deployPath}/`, { stdio: 'inherit' });
    
    // 安装生产依赖
    execSync(`cd ${this.deployPath} && npm install --production`, { stdio: 'inherit' });
    
    // 启动应用
    execSync(`pm2 start ${this.deployPath}/app.js --name ${this.config.appName}`, { stdio: 'inherit' });
    
    console.log('Deployment completed');
  }
  
  // 回滚
  rollback(version) {
    const backupDir = path.join(this.backupPath, version);
    
    if (!fs.existsSync(backupDir)) {
      throw new Error(`Backup not found: ${version}`);
    }
    
    console.log(`Rolling back to ${version}...`);
    
    // 停止应用
    execSync(`pm2 stop ${this.config.appName}`, { stdio: 'inherit' });
    
    // 恢复文件
    execSync(`cp -r ${backupDir}/* ${this.deployPath}/`, { stdio: 'inherit' });
    
    // 启动应用
    execSync(`pm2 restart ${this.config.appName}`, { stdio: 'inherit' });
    
    console.log('Rollback completed');
  }
  
  // 完整部署流程
  async fullDeploy() {
    try {
      this.preDeploy();
      this.installDependencies();
      this.build();
      this.backup();
      this.deploy();
      console.log('Full deployment completed successfully');
    } catch (error) {
      console.error('Deployment failed:', error.message);
      process.exit(1);
    }
  }
}

module.exports = BackendDeploy;
```

### 2. Docker 部署

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: ttn-backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    restart: unless-stopped
    networks:
      - app-network
    
  nginx:
    image: nginx:alpine
    container_name: ttn-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

#### 部署脚本

```bash
#!/bin/bash

# 构建镜像
docker build -t ttn-backend:latest .

# 停止旧容器
docker-compose down

# 启动新容器
docker-compose up -d

# 清理旧镜像
docker image prune -f

echo "Deployment completed"
```

### 3. Kubernetes 部署

#### Deployment 配置

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ttn-backend
  labels:
    app: ttn-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ttn-backend
  template:
    metadata:
      labels:
        app: ttn-backend
    spec:
      containers:
      - name: ttn-backend
        image: ttn-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: ttn-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### Service 配置

```yaml
apiVersion: v1
kind: Service
metadata:
  name: ttn-backend-service
spec:
  selector:
    app: ttn-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

## CI/CD 集成

### GitHub Actions

```yaml
name: Deploy Backend

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
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/ttn-backend
          git pull origin main
          npm install --production
          pm2 restart ttn-backend
```

## 监控和日志

### PM2 监控

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs ttn-backend

# 监控面板
pm2 monit

# 设置开机自启
pm2 startup
pm2 save
```

### 日志管理

```javascript
// 使用 winston 日志库
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## 安全配置

### 环境变量管理

```bash
# .env 文件
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://user:password@localhost:3306/dbname
JWT_SECRET=your-secret-key
```

### Nginx 反向代理

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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 相关链接

- [PM2 文档](https://pm2.keymetrics.io/)
- [Docker 文档](https://docs.docker.com/)
- [Kubernetes 文档](https://kubernetes.io/zh/docs/)
- [Nginx 文档](https://nginx.org/en/docs/)