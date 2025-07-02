import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 性能优化配置
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    // 启用压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 启用源码映射（生产环境可选）
    sourcemap: false,
    // 设置块大小警告限制
    chunkSizeWarningLimit: 1000,
  },
  // 开发服务器优化
  server: {
    // 启用热更新
    hmr: true,
    // 设置端口
    port: 3000,
    // 启用自动打开浏览器
    open: true,
  },
  // 预构建优化
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // 资源处理优化
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  // 定义全局常量
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
})
