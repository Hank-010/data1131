/*
 * @Description: 我的收藏模組資料持久層
 */
const db = require('./db.js');

module.exports = {
  // 連結資料庫,把收藏商品資訊插入資料庫
  AddCollect: async (user_id, product_id, timeTemp) => {
    const sql = 'insert into collect values(null,?,?,?)';
    return await db.query(sql, [user_id, product_id, timeTemp]);
  },
  // 連結資料庫,取得使用者的所有收藏商品訊息
  GetCollect: async (user_id) => {
    const sql = 'select * from collect where user_id=?';
    return await db.query(sql, user_id);
  },
  // 連結資料庫,取得使用者的某個收藏商品訊息
  FindCollect: async (user_id, product_id) => {
    const sql = 'select * from collect where user_id=? and product_id=?';
    return await db.query(sql, [user_id, product_id]);
  },
  // 連結資料庫,刪除使用者的某個收藏商品訊息
  DeleteCollect: async (user_id, product_id) => {
    const sql = 'delete from collect where user_id=? and product_id=?';
    return await db.query(sql, [user_id, product_id]);
  }
}