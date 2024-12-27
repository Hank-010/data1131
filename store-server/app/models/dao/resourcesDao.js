/*
 * @Description: 資源模組資料持久層
 */
const db = require('./db.js');

module.exports = {
  // 連接資料庫取得輪播圖數據
  Carousel: async () => {
    const sql = 'select * from carousel';
    return await db.query(sql, []);
  }
}