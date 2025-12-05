import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 部署到 GitHub Pages 默认域名 (weiwei929.github.io/MD_blog/) 时需要配置此路径
  // 如果将来绑定了自定义域名 (如 blog.weiwei.com)，请将此处改为 '/'
  base: '/MD_blog/',
})
