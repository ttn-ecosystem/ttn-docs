import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/ttn-docs/',
  title: "ttn-cli",
  description: "A VitePress Site",
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
    config: (md) => {
      const defaultFence = md.renderer.rules.fence
      md.renderer.rules.fence = function(tokens, idx, options, env, self) {
        const token = tokens[idx]
        const info = token.info.trim()
        if (info === 'mermaid') {
          const code = token.content.trim()
          const lines = code.split('\n').map(line => line.trim()).filter(line => line)
          return '<div class="mermaid" data-code="' + encodeURIComponent(lines.join('\n')) + '"></div>'
        }
        return defaultFence.apply(this, arguments)
      }
    }
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '示例', link: '/markdown-examples' }
    ],
    sidebar: [
      {
        text: '示例',
        items: [
          { text: 'Markdown 示例', link: '/markdown-examples' },
          { text: '运行时 API 示例', link: '/api-examples' }
        ]
      }
    ]
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [],
        sidebar: [
          { text: 'ttn-cli 介绍', link: '/guide/introduction/ttn-cli' },
          { text: 'ttn-cli 安装/使用', link: '/guide/introduction/install-usage' },
          { text: 'ttn-cli 执行流程', link: '/guide/introduction/architecture-diagram' },
          {
            text: '脚手架章节',
            items: [
              { text: '前端脚手架运行原理', link: '/markdown-examples' },
              { text: '脚手架指令', link: '/api-examples' },
              { text: '使用 lerna 开发脚手架', link: '/markdown-examples' },
              { text: '本地开发调试脚手架', link: '/markdown-examples' },
              { text: '脚手架发布', link: '/markdown-examples' }
            ]
          },
          {
            text: '项目模版章节',
            link: '/guide/introduction/project-template.md'
          },
          {
            text: 'ttn-cli server 章节',
            items: [
              { text: 'koa-generator', link: '/guide/introduction/koa-generator' },
              { text: 'mysql', link: '/guide/introduction/mysql' },
              { text: 'websocket', link: '/guide/introduction/websocket' },
              { text: '服务端部署', link: '/guide/introduction/server-deployment' }
            ]
          },
          {
            text: 'Node.js 章节',
            items: [
              { text: 'Node.js 工具包', link: '/markdown-examples' },
              { text: '多进程开发', link: '/api-examples' }
            ]
          },
          {
            text: '云构建章节',
            items: [
              { text: '构建项目', link: '/markdown-examples' },
              { text: '构建项目依赖', link: '/api-examples' }
            ]
          },
          {
            text: '云发布章节',
            items: [
              { text: 'OSS 部署', link: '/deploy/oss-deployment' },
              { text: 'CDN', link: '/deploy/cdn' },
              { text: 'https', link: '/deploy/https' },
              { text: '秒级回滚', link: '/deploy/rollback' },
              { text: 'ttn-cli 后端部署', link: '/deploy/backend-deployment' }
            ]
          }
        ]
      }
    },
    'en': {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Examples', link: '/en/markdown-examples' }
        ],
        sidebar: [
          {
            text: 'Examples',
            items: [
              { text: 'Markdown Examples', link: '/en/markdown-examples' },
              { text: 'Runtime API Examples', link: '/en/api-examples' }
            ]
          }
        ]
      }
    }
  }
})