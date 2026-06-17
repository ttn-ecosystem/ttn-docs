# koa-generator

## 简介

koa-generator 是一个用于快速生成 Koa 项目结构的工具。

## 安装

```bash
npm install -g koa-generator
```

## 使用方法

### 创建项目

```bash
koa2 myproject
```

### 项目结构

```
myproject/
├── bin/
│   └── www
├── public/
│   ├── images/
│   ├── javascripts/
│   └── stylesheets/
├── routes/
│   ├── index.js
│   └── users.js
├── views/
│   ├── error.pug
│   ├── index.pug
│   └── layout.pug
├── app.js
└── package.json
```

## 常用命令

- `npm start` - 启动项目
- `npm test` - 运行测试

## 相关链接

- [Koa 官方文档](https://koajs.com/)