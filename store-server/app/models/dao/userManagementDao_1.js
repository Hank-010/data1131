/*
 * @Description: 使用者管理模組資料持久層
 */
const db = require('./db.js');

module.exports = {
  // 連結資料庫，取得 userLevel == 0 的所有使用者訊息
  GetUsersWithLevel0: async () => {
    const sql = 'SELECT * FROM users WHERE userLevel=0';
    return await db.query(sql);
  },

  // 連結資料庫,取得使用者的所有訊息
  GetUser: async () => {
    const sql = 'select * from users';
    return await db.query(sql);
  },

  // 連結資料庫,刪除某個使用者的訊息
  DeleteUser: async (user_id) => {
    const sql = 'delete from users where user_id=?';
    return await db.query(sql, user_id);
  }
}