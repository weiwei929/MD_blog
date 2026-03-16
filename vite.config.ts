import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// GitHub Pages SPA：将 index.html 复制为 404.html，使任意路径都能加载应用
function ghPages404() {
  return {
    name: 'gh-pages-404',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist')
      const indexPath = path.join(outDir, 'index.html')
      const notFoundPath = path.join(outDir, '404.html')
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, notFoundPath)
        console.log('  ✓ 404.html created for GitHub Pages SPA')
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), ghPages404()],
  // 部署到 GitHub Pages 默认域名 (weiwei929.github.io/MD_blog/) 时需要配置此路径
  // 如果将来绑定了自定义域名 (如 blog.weiwei.com)，请将此处改为 '/'
  base: '/MD_blog/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'markdown': ['react-markdown', 'remark-gfm', 'rehype-highlight', 'rehype-raw'],
          'motion': ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
