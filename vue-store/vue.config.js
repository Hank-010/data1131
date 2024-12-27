/*
 * @Description: 設定檔
 */
module.exports = {
  publicPath: './',
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000/', // 本地後端地址
        // target: 'http://101.132.181.29:3000/', // 線上後端地址
        changeOrigin: true, //允許跨域
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}