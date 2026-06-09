# 二次开发

## 项目结构

ttn-cli 采用 monorepo 架构，基于 pnpm + lerna 搭建：

```
ttn-cli/
├── packages/
│   ├── core/           # 核心功能模块
│   ├── create/          # 项目创建模块
│   └── deploy/          # 部署模块
├── lerna.json
├── package.json
└── pnpm-workspace.yaml
```

## 开发环境设置

### 1. 克隆项目

```bash
git clone <repository-url>
cd ttn-cli
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发模式

```bash
pnpm dev
```

## 添加新功能

### 创建新的包

```bash
lerna create @ttn-cli/your-package
```

### 添加依赖

```bash
pnpm add <package-name> --filter @ttn-cli/your-package
```

## 发布流程

```bash
# 构建所有包
pnpm build

# 发布到 npm
lerna publish
```

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进 ttn-cli！