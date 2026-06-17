# 秒级回滚

## 简介

秒级回滚是指在系统出现问题时，能够快速将系统恢复到上一个稳定版本的能力。这是保障系统稳定性和可用性的重要机制。

## 回滚策略

### 1. 版本管理

#### 使用 Git 标签

```bash
# 发布时打标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 回滚到指定版本
git checkout v0.9.0
```

#### 使用版本号

```javascript
// package.json
{
  "version": "1.0.0",
  "scripts": {
    "deploy": "node scripts/deploy.js",
    "rollback": "node scripts/rollback.js"
  }
}
```

### 2. 部署记录

```javascript
const fs = require('fs');
const path = require('path');

class DeploymentRecord {
  constructor() {
    this.recordFile = path.join(__dirname, 'deployments.json');
    this.records = this.loadRecords();
  }
  
  loadRecords() {
    try {
      const data = fs.readFileSync(this.recordFile, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }
  
  saveRecord(record) {
    this.records.unshift({
      ...record,
      timestamp: Date.now(),
      id: this.generateId()
    });
    
    // 只保留最近 10 次部署记录
    this.records = this.records.slice(0, 10);
    
    fs.writeFileSync(this.recordFile, JSON.stringify(this.records, null, 2));
  }
  
  getLatestStable() {
    return this.records.find(r => r.status === 'success');
  }
  
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
```

## PM2 回滚

### 使用 PM2 部署

```bash
# 部署新版本
pm2 start app.js --name myapp

# 保存当前进程列表
pm2 save

# 生成启动脚本
pm2 startup
```

### 回滚脚本

```javascript
const { execSync } = require('child_process');
const fs = require('fs');

class PM2Rollback {
  constructor(appName) {
    this.appName = appName;
    this.backupDir = '/var/backups/app';
  }
  
  // 备份当前版本
  backup(version) {
    const backupPath = path.join(this.backupDir, version);
    execSync(`mkdir -p ${backupPath}`);
    execSync(`cp -r ./node_modules ${backupPath}/`);
    execSync(`cp -r ./dist ${backupPath}/`);
    execSync(`cp package.json ${backupPath}/`);
    console.log(`Backup created: ${backupPath}`);
  }
  
  // 回滚到指定版本
  rollback(version) {
    const backupPath = path.join(this.backupDir, version);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup not found: ${version}`);
    }
    
    // 停止应用
    execSync(`pm2 stop ${this.appName}`);
    
    // 恢复文件
    execSync(`cp -r ${backupPath}/node_modules ./`);
    execSync(`cp -r ${backupPath}/dist ./`);
    execSync(`cp ${backupPath}/package.json ./`);
    
    // 重启应用
    execSync(`pm2 restart ${this.appName}`);
    
    console.log(`Rollback completed: ${version}`);
  }
  
  // 列出所有备份版本
  listBackups() {
    const backups = fs.readdirSync(this.backupDir);
    console.log('Available backups:');
    backups.forEach(backup => {
      console.log(`- ${backup}`);
    });
  }
}
```

## Docker 回滚

### 使用 Docker 镜像标签

```bash
# 构建并打标签
docker build -t myapp:latest .
docker tag myapp:latest myapp:v1.0.0

# 推送到仓库
docker push myapp:latest
docker push myapp:v1.0.0

# 回滚到指定版本
docker stop myapp-container
docker rm myapp-container
docker run -d --name myapp-container myapp:v0.9.0
```

### 使用 Docker Compose

```yaml
version: '3'
services:
  app:
    image: myapp:v1.0.0
    container_name: myapp-container
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

```bash
# 部署新版本
docker-compose up -d

# 回滚到上一版本
docker-compose down
# 修改 docker-compose.yml 中的镜像版本
docker-compose up -d
```

## Kubernetes 回滚

### 使用 kubectl

```bash
# 查看部署历史
kubectl rollout history deployment/myapp

# 回滚到上一版本
kubectl rollout undo deployment/myapp

# 回滚到指定版本
kubectl rollout undo deployment/myapp --to-revision=2

# 查看回滚状态
kubectl rollout status deployment/myapp
```

### 部署配置

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  revisionHistoryLimit: 10  # 保留的历史版本数
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:v1.0.0
        ports:
        - containerPort: 3000
```

## 自动化回滚脚本

```javascript
const { execSync } = require('child_process');

class AutoRollback {
  constructor(config) {
    this.appName = config.appName;
    this.healthCheckUrl = config.healthCheckUrl;
    this.maxRetries = config.maxRetries || 3;
  }
  
  // 健康检查
  async healthCheck() {
    try {
      const response = await fetch(this.healthCheckUrl);
      return response.ok;
    } catch (e) {
      return false;
    }
  }
  
  // 部署并监控
  async deploy(newVersion) {
    console.log(`Deploying version ${newVersion}...`);
    
    // 备份当前版本
    this.backup();
    
    // 部署新版本
    this.deployVersion(newVersion);
    
    // 健康检查
    for (let i = 0; i < this.maxRetries; i++) {
      const isHealthy = await this.healthCheck();
      
      if (isHealthy) {
        console.log('Deployment successful!');
        return true;
      }
      
      console.log(`Health check failed, retry ${i + 1}/${this.maxRetries}`);
      await this.sleep(5000);
    }
    
    // 健康检查失败，自动回滚
    console.log('Health check failed, rolling back...');
    this.rollback();
    return false;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## 最佳实践

### 1. 蓝绿部署

- 维护两套完全相同的生产环境
- 新版本部署到蓝环境，测试通过后切换流量
- 出现问题立即切换回绿环境

### 2. 金丝雀发布

- 先将新版本部署到小部分服务器
- 逐步扩大范围
- 出现问题立即回滚

### 3. 监控告警

- 设置应用性能监控
- 配置错误率告警
- 自动触发回滚

### 4. 定期演练

- 定期进行回滚演练
- 确保回滚流程可靠
- 记录回滚时间

## 相关链接

- [PM2 文档](https://pm2.keymetrics.io/)
- [Docker 文档](https://docs.docker.com/)
- [Kubernetes 文档](https://kubernetes.io/zh/docs/)