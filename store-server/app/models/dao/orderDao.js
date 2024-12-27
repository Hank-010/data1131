/*
 * @Description: 訂單模組資料持久層
 */
const db = require('./db.js');

module.exports = {
  // 連接資料庫獲取所有的訂單id
  GetOrderGroup: async (user_id) => {
    // let sql = 'select order_id from orders where user_id = ? group by order_id desc';
    let sql = 'select DISTINCT order_id from orders where user_id = ? order by order_id desc';
    return await db.query(sql, user_id);
  },
  // 連接資料庫以獲取所有的訂單詳細信息
  GetOrder: async (user_id) => {
    let sql = 'select * from orders where user_id =? order by order_time desc';
    return await db.query(sql, user_id);
  },
  // 連接資料庫插入訂單信息
  AddOrder: async (length, data) => {
    const placeholders = Array(length).fill("(null,?,?,?,?,?,?,?)").join(",");
    const sql = `
        INSERT INTO orders (
        id, order_id, user_id, product_id, product_num, product_price, order_time, total_price
        ) VALUES ${placeholders}
    `;
    return await db.query(sql, data);
  }
}