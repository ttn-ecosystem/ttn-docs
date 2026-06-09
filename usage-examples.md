# 使用示例

## 创建新项目

使用 ttn-cli 创建新项目非常简单：

```bash
ttn create my-project
```

这将启动交互式命令行界面，引导你选择项目模板和配置选项。

## 可用的项目模板

ttn-cli 提供了多种项目模板：

- **Vue 3 + TypeScript** - 适用于 Vue 3 项目开发
- **React + TypeScript** - 适用于 React 项目开发
- **Node.js 后端项目** - 适用于后端服务开发

## 项目部署

ttn-cli 支持将项目部署到不同的环境：

```bash
ttn deploy --env production
```

## 更多帮助

要查看所有可用的命令和选项，运行：

```bash
ttn --help
```