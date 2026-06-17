---
title: ttn-cli 安装/使用
---

# ttn-cli 安装/使用

## 安装

### 全局安装

```bash
npm install -g ttn-cli
```

或使用 pnpm：

```bash
pnpm add -g ttn-cli
```

### 验证安装

安装完成后，可以通过以下命令验证是否安装成功：

```bash
ttn --version
```

或查看帮助信息：

```bash
ttn --help
```

## 基本使用

### 前置准备
- 域名
    1. 前端项目的域名：
        使用 ttn-cli 创建前端项目，需要先购买域名。ttn-cli 支持 线上和预发 部署。
        我自己的项目是购买了一个域名 snapposter.top 用作线上版本，然后申请了子域名 dev.snapposter.top 用作预发版本。
    2. 脚手架后端域名：我的测试域名是 ttncli.xyz

- OSS
    购买 OSS，项目打包后的静态资源上传到 OSS 了。并且在 OSS 中创建了两个bucket：ttn-cli、ttn-cli-dev

- 云服务器
    1. 脚手架后端需要部署在云服务器上。
    2. 前端项目的 index.html 是部署在云服务器上的，然后拉取了 OSS 的静态资源。
    3. 配置系统也是需要部署在云服务器上的。
    理论上最好的设计是上述三部分分别部署在不同的云服务器上。我的测试 demo 是在同一台服务器上，然后用 nginx 区分。

- CDN
    购买 CDN，将 OSS 上的静态资源缓存到 CDN 上。
    项目发布到 CDN 上后，用户访问时会从 CDN 上获取静态资源，而不是从 OSS 上获取。

### 初始化项目

在一个空目录下执行：

```bash
ttn init
```

### 项目发布
在发布项目之前，需要修改 ossConfig.json 文件，因为我的 demo 的 OSS 链接中有域名，所以需要在这个文件配置。
```javascript
{
    "domain": "snapposter.top",
    "previewDomain": "dev.snapposter.top"
}
```
- 线上版本发布
```bash
ttn publish
```
- 预发版本发布
```bash
ttn publish --pre
```
## 更新与卸载

### 更新到最新版本

```bash
npm update -g ttn-cli
```

### 卸载

```bash
npm uninstall -g ttn-cli
```