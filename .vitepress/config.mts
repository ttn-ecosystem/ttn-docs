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