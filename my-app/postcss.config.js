export default {
  plugins: {
    // 自动添加浏览器前缀
    autoprefixer: {},
    // 在生产环境下压缩CSS
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: 'default',
      },
    } : {}),
  },
} 