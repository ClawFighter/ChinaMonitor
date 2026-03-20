import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  server: {
    port: 7890,
    host: '0.0.0.0',  // 允许所有网络接口访问
    allowedHosts: [   // 允许的域名
      'chinamonitor.app',
      'www.chinamonitor.app',
      'lukewen2012.workers.dev',
      '142.171.135.20',
      'localhost',
      '127.0.0.1'
    ],
    proxy: {
      '/api/news': {
        target: 'http://127.0.0.1:3100',
        changeOrigin: true
      },
      '/api/weather': {
        target: 'http://127.0.0.1:3101',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 7890,
    host: '0.0.0.0',
    allowedHosts: [
      'chinamonitor.app',
      'www.chinamonitor.app'
    ]
  }
})
