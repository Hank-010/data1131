/*
 * @Description: 商品模組資料持久層
 */
const db = require('./db.js');

module.exports = {
  // 連接資料庫取得商品分類
  GetCategory: async () => {
    const sql = "select * from category";
    return await db.query(sql, []);
  },
  // 連接資料庫依商品分類名稱取得分類id
  GetCategoryId: async (categoryName) => {
    const sql = "select * from category where category_name = ?";
    const category = await db.query(sql, [categoryName]);
    return category[0].category_id;
  },
  // 連接資料庫,根據商品分類id取得首頁展示的商品信息
  GetPromoProduct: async (categoryID) => {
    const sql = `
        SELECT p.*, pp.product_picture 
        FROM product p 
        LEFT JOIN (
            SELECT product_id, MIN(product_picture) AS product_picture 
            FROM product_picture 
            GROUP BY product_id
        ) pp 
        ON p.product_id = pp.product_id 
        WHERE p.category_id = ? 
        ORDER BY p.product_sales DESC 
        LIMIT 7
    `;
    return await db.query(sql, [categoryID]);
  },
  // 連接資料庫,分頁獲取所有的商品信息
  GetAllProduct: async (offset = 0, rows = 0) => {
    let sql = `
        SELECT p.*, pp.product_picture 
        FROM product p 
        LEFT JOIN (
            SELECT product_id, MIN(product_picture) AS product_picture 
            FROM product_picture 
            GROUP BY product_id
        ) pp 
        ON p.product_id = pp.product_id
    `;
    if (rows != 0) {
        sql += ` LIMIT ${offset}, ${rows}`;
    }
    return await db.query(sql, []);
  },
  // 連接資料庫,根據商品分類id,分頁獲取商品信息
  GetProductByCategory: async (categoryID, offset = 0, rows = 0) => {
    let sql = `
        SELECT p.*, pp.product_picture 
        FROM product p 
        LEFT JOIN (
            SELECT product_id, MIN(product_picture) AS product_picture 
            FROM product_picture 
            GROUP BY product_id
        ) pp 
        ON p.product_id = pp.product_id 
        WHERE p.category_id = ?
    `;
    for (let i = 0; i < categoryID.length - 1; i++) {
        sql += " OR p.category_id = ?";
    }
    if (rows != 0) {
        sql += ` ORDER BY p.product_sales DESC LIMIT ${offset}, ${rows}`;
    }
    return await db.query(sql, categoryID);
  },
  // 連接資料庫,根據搜尋條件,分頁獲取商品信息
  GetProductBySearch: async (search, offset = 0, rows = 0) => {
    let sql = `
        SELECT p.*, pp.product_picture 
        FROM product p 
        LEFT JOIN (
            SELECT product_id, MIN(product_picture) AS product_picture 
            FROM product_picture 
            GROUP BY product_id
        ) pp 
        ON p.product_id = pp.product_id 
        WHERE p.product_name LIKE "%${search}%" 
           OR p.product_title LIKE "%${search}%" 
           OR p.product_intro LIKE "%${search}%"
    `;
    if (rows != 0) {
        sql += ` ORDER BY p.product_sales DESC LIMIT ${offset}, ${rows}`;
    }
    return await db.query(sql, []);
  },
  // 連接資料庫,根據商品id,取得商品詳細信息
  GetProductById: async (id) => {
    const sql = `
        SELECT p.*, pp.product_picture 
        FROM product p 
        LEFT JOIN (
            SELECT product_id, MIN(product_picture) AS product_picture 
            FROM product_picture 
            GROUP BY product_id
        ) pp 
        ON p.product_id = pp.product_id 
        WHERE p.product_id = ?
    `;
    return await db.query(sql, [id]);
  },
  // 連接資料庫,根據賣家id,取得商品詳細信息
  // GetProductBySellerId: async (id) => {
  //   const sql = `
  //       SELECT p.*, pp.product_picture 
  //       FROM product p 
  //       LEFT JOIN (
  //           SELECT product_id, MIN(product_picture) AS product_picture 
  //           FROM product_picture 
  //           GROUP BY product_id
  //       ) pp 
  //       ON p.product_id = pp.product_id 
  //       WHERE p.seller_id = ?
  //   `;
  //   return await db.query(sql, [id]);
  // },
  GetProductBySellerId: async (user_id) => {
      const sql = 'select * from product where seller_id=?';
      return await db.query(sql, user_id);
    },
  // 連接資料庫,根據商品id,取得商品圖片
  GetDetailsPicture: async (productID) => {
    const sql = "select * from product_picture where product_id = ? ";
    return await db.query(sql, productID);
  },
  // 連接資料庫插入新商品訊息
  AddProduct: async (product_name, product_title, product_intro, product_price, product_selling_price, product_num) => {
    const sql = `
      INSERT INTO product (
        product_name, category_id, product_title, product_intro, seller_id, 
        product_price, product_selling_price, product_num, product_sales
      ) VALUES (?, 9, ?, ?, 1, ?, ?, ?, 0)
    `;
    return await db.query(sql, [
      product_name, product_title, product_intro,
      product_price, product_selling_price, product_num
    ]);
  },
  // 連結資料庫,刪除某個使用者的某個商品
  DeleteProductByUserId: async (user_id, product_id) => {
    const sql = 'delete from product where user_id=? and product_id=?';
    return await db.query(sql, [user_id, product_id]);
  }
}