import Theme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import './custom.css'

export default {
  extends: Theme,
  setup() {
    const route = useRoute()

    const initZoom = () => {
      // 为所有图片添加 zoomable 类
      const images = document.querySelectorAll('.main img')
      images.forEach((img) => {
        if (!img.closest('.no-zoom')) {
          img.setAttribute('data-zoomable', 'true')
        }
      })

      // 初始化 medium-zoom
      mediumZoom('[data-zoomable]', {
        background: 'var(--vp-c-bg)',
        margin: 24
      })
    }

    onMounted(() => {
      initZoom()
    })

    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  },
  enhanceApp({ app }) {
    if (typeof window !== 'undefined') {
      console.log('Browser environment detected')

      const loadMermaid = () => {
        return new Promise((resolve) => {
          if (window.mermaid) {
            console.log('Mermaid already loaded')
            resolve(window.mermaid)
            return
          }

          console.log('Loading Mermaid from CDN...')
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
          script.onload = () => {
            console.log('Mermaid loaded successfully')
            window.mermaid.initialize({
              startOnLoad: false,
              theme: 'default',
              securityLevel: 'loose'
            })
            resolve(window.mermaid)
          }
          script.onerror = () => {
            console.error('Failed to load Mermaid')
            resolve(null)
          }
          document.head.appendChild(script)
        })
      }

      const renderMermaid = async () => {
        console.log('Attempting to render Mermaid...')
        const mermaid = await loadMermaid()

        if (!mermaid) {
          console.error('Mermaid not available')
          return
        }

        setTimeout(() => {
          const wrappers = document.querySelectorAll('.mermaid')
          console.log(`Found ${wrappers.length} mermaid elements`)

          wrappers.forEach((wrapper, index) => {
            const code = decodeURIComponent(wrapper.getAttribute('data-code') || '')
            if (!code) return

            const id = 'mermaid-' + index + '-' + Date.now()
            console.log(`Rendering diagram ${index + 1} with id: ${id}`)
            console.log(`Code: ${code}`)

            mermaid.render(id, code).then(({ svg }) => {
              console.log(`Diagram ${index + 1} rendered successfully`)
              wrapper.innerHTML = svg
            }).catch((error) => {
              console.error(`Error rendering diagram ${index + 1}:`, error)
            })
          })
        }, 300)
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          console.log('DOMContentLoaded fired')
          renderMermaid()
        })
      } else {
        console.log('DOM already loaded')
        renderMermaid()
      }

      document.addEventListener('vitepress:routeChange', () => {
        console.log('vitepress:routeChange fired')
        renderMermaid()
      })
    }
  }
}