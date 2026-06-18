# PM2 进程管理

## 简介

PM2 是一个 Node.js 进程管理器，具有负载均衡、自动重启、日志管理、监控等功能，是生产环境中运行 Node.js 应用的首选工具。

## 安装

```bash
# 使用 npm 安装
npm install -g pm2

# 使用 yarn 安装
yarn global add pm2

# 查看版本
pm2 -v
```

## 基本命令

### 启动应用

```bash
# 启动应用
pm2 start app.js

# 指定应用名称
pm2 start app.js --name my-app

# 使用配置文件启动
pm2 start ecosystem.config.js

# 启动时设置环境变量
pm2 start app.js --name my-app --env production

# 集群模式启动（利用多核 CPU）
pm2 start app.js -i max

# 指定实例数量
pm2 start app.js -i 4
```

### 停止应用

```bash
# 停止指定应用
pm2 stop my-app

# 停止所有应用
pm2 stop all

# 重启应用
pm2 restart my-app

# 热重启（零停机）
pm2 reload my-app

# 重新加载所有应用
pm2 reload all
```

### 查看状态

```bash
# 查看所有进程状态
pm2 status

# 查看指定进程详情
pm2 show my-app

# 监控面板（实时）
pm2 monit

# 查看日志
pm2 logs

# 查看指定应用日志
pm2 logs my-app

# 实时日志流
pm2 logs my-app --stream

# 查看最近 100 行日志
pm2 logs --lines 100
```

### 删除应用

```bash
# 删除指定应用
pm2 delete my-app

# 删除所有应用
pm2 delete all
```

## 配置文件

### ecosystem.config.js

```javascript
module.exports = {
  apps: [
    {
      name: 'ttn-backend',
      script: './app.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: true,
      ignore_watch: [
        'node_modules',
        'logs',
        '.git'
      ],
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true
    }
  ]
}
```

### 配置项说明

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| name | 应用名称 | 无 |
| script | 启动脚本路径 | 无 |
| instances | 实例数量 | 1 |
| exec_mode | 执行模式：cluster 或 fork | fork |
| env | 开发环境变量 | 无 |
| env_production | 生产环境变量 | 无 |
| watch | 是否监听文件变化自动重启 | false |
| ignore_watch | 忽略监听的文件/目录 | [] |
| max_memory_restart | 内存超过此值自动重启 | 150M |
| log_date_format | 日志时间格式 | YYYY-MM-DD HH:mm Z |
| error_file | 错误日志路径 | ~/.pm2/logs/ |
| out_file | 输出日志路径 | ~/.pm2/logs/ |
| merge_logs | 合并集群模式下的日志 | false |

## 进程管理

### 集群模式

```bash
# 启动集群模式（自动利用所有 CPU 核心）
pm2 start app.js -i max

# 启动指定数量的实例
pm2 start app.js -i 4

# 动态调整实例数量
pm2 scale my-app 6

# 查看集群状态
pm2 jlist
```

### 负载均衡

PM2 集群模式内置负载均衡，采用轮询策略分配请求到各个实例。

```bash
# 查看负载均衡状态
pm2 status
```

### 健康检查

```javascript
module.exports = {
  apps: [
    {
      name: 'ttn-backend',
      script: './app.js',
      instances: 'max',
      exec_mode: 'cluster',
      max_restarts: 10,
      restart_delay: 4000,
      kill_timeout: 3000,
      wait_ready: true,
      listen_timeout: 10000
    }
  ]
}
```

## 监控和日志

### PM2 Plus（云端监控）

```bash
# 注册账号
pm2 plus login

# 连接到云端监控
pm2 link <secret-key> <public-id>

# 查看监控仪表盘
pm2 dashboard
```

### 日志管理

```bash
# 查看实时日志
pm2 logs

# 查看指定应用日志
pm2 logs my-app

# 查看错误日志
pm2 logs my-app --err

# 日志轮转（安装 pm2-logrotate）
pm2 install pm2-logrotate

# 配置日志轮转
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

## 开机自启

### Linux / macOS

```bash
# 生成启动脚本
pm2 startup

# 保存当前进程列表
pm2 save

# 查看自启配置
pm2 startup list

# 禁用自启
pm2 unstartup
```

### Windows

```bash
# 安装 pm2-windows-service
npm install -g pm2-windows-service

# 安装服务
pm2-service-install

# 启动服务
pm2 start app.js
pm2 save
```

## 部署工作流

### 简单部署脚本

```bash
#!/bin/bash

# 进入项目目录
cd /var/www/ttn-backend

# 拉取最新代码
git pull origin main

# 安装依赖
npm install --production

# 重启应用
pm2 reload ttn-backend

echo "Deployment completed successfully"
```

### 配合 CI/CD

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
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
          pm2 reload ttn-backend
```

## 常见问题

### Q: PM2 启动后进程立即退出

```bash
# 查看错误日志
pm2 logs my-app --err

# 检查应用是否有未捕获的异常
pm2 start app.js --node-args="--unhandled-rejections=strict"
```

### Q: 如何查看应用占用的内存

```bash
# 查看内存使用
pm2 monit

# 查看详细信息
pm2 show my-app
```

### Q: 如何设置环境变量

```bash
# 启动时设置
pm2 start app.js --env production

# 使用配置文件
# 在 ecosystem.config.js 中配置 env 和 env_production
```

### Q: 如何在集群模式下共享状态

集群模式下每个实例是独立进程，需要使用外部存储（如 Redis）来共享状态：

```javascript
const Redis = require('redis');
const client = Redis.createClient();

// 使用 Redis 存储共享数据
await client.set('shared-key', 'shared-value');
const value = await client.get('shared-key');
```

## 相关链接

- [PM2 官方文档](https://pm2.keymetrics.io/)
- [PM2 GitHub](https://github.com/Unitech/pm2)
- [PM2 Logrotate](https://github.com/keymetrics/pm2-logrotate)