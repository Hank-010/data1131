/*
 * @Description: 使用者模組資料持久層
 */
const db = require('./db.js');

module.exports = {
  // 連接資料庫根據使用者名稱和密碼查詢使用者訊息
  Login: async (userName, password) => {
    const sql = 'select * from users where userName = ? and password = ?';
    return await db.query(sql, [userName, password]);
  },
  // 連接資料庫,根據使用者id查詢使用者訊息
  FindUserById: async (user_id) => {
    const sql = 'select * from users where user_id = ?';
    return await db.query(sql, user_id);
  },
  // 連接資料庫根據使用者名稱查詢使用者訊息
  FindUserByName: async (userName) => {
    const sql = 'select * from users where userName = ?';
    return await db.query(sql, userName);
  },
  // 連接資料庫插入使用者訊息
  Register: async (userName, password, registerTime) => {
    const sql = `
    insert into users (userName, password, registerTime, userLevel) values(?,?,?,1)`;
    return await db.query(sql, [userName, password, registerTime]);
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