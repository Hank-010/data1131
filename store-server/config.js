/*
 * @Description: 全域設定資訊
 */
const path = require('path');

module.exports = {
  Port: 3000, // 啟動連接埠
  staticDir: path.resolve('./public'), // 靜態資源路徑
  uploadDir: path.join(__dirname, path.resolve('public/')), // 上傳檔案路徑
  // 資料庫連線設定
  dbConfig: {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'hank1022',
    database: 'storeDB'
  }
}

