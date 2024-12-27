/*
 * @Description: 訂單模組控制器
 */
const orderDao = require('../models/dao/orderDao');
const shoppingCartDao = require('../models/dao/shoppingCartDao');
const productDao = require('../models/dao/productDao');
const checkLogin = require('../middleware/checkLogin');

module.exports = {
  /**
   * 獲取使用者的所有訂單信息
   * @param {Object} ctx
   */
  GetOrder: async ctx => {
    let { user_id } = ctx.request.body;
    // 校驗使用者是否登入
    if (!checkLogin(ctx, user_id)) {
      return;
    }
    // 獲取所有的訂單id
    const ordersGroup = await orderDao.GetOrderGroup(user_id);

    // 該使用者沒有訂單,直接回傳訊息
    if (ordersGroup.length == 0) {
      ctx.body = {
        code: '002',
        msg: '該使用者沒有訂單資訊'
      }
      return;
    }

    // 獲取所有的訂單詳細信息
    const orders = await orderDao.GetOrder(user_id);

    let ordersList = [];
    // 產生每個訂單的詳細資訊列表
    for (let i = 0; i < ordersGroup.length; i++) {
      const orderID = ordersGroup[i];
      let tempOrder = [];

      for (let j = 0; j < orders.length; j++) {
        const order = orders[j];

        if (orderID.order_id == order.order_id) {
          // 獲取每個商品詳細信息
          const product = await productDao.GetProductById(order.product_id);
          order.product_name = product[0].product_name;
          order.product_picture = product[0].product_picture;

          tempOrder.push(order);
        }
      }
      ordersList.push(tempOrder);
    }

    ctx.body = {
      code: '001',
      orders: ordersList
    }

  },
  /**
   * 新增使用者訂單資訊
   * @param {Object} ctx
   */
  AddOrder: async (ctx) => {
    let { user_id, products, total_price  } = ctx.request.body;
    // 校驗使用者是否登入
    if (!checkLogin(ctx, user_id)) {
      return;
    }

    // 取得當前時間戳
    const timeTemp = new Date().getTime();
    // 生成訂單id：使用者id+時間戳(string)
    const orderID = +("" + user_id + timeTemp);

    let data = [];
    // 根據資料庫表結構產生欄位信息
    for (let i = 0; i < products.length; i++) {
      const temp = products[i];
      let product = [orderID, user_id, temp.productID, temp.num, temp.price, timeTemp, total_price];
      data.push(...product);
    }

    try {
      // 把訂單資訊插入資料庫
      const result = await orderDao.AddOrder(products.length, data);

      // 插入成功
      if (result.affectedRows == products.length) {
        //删除購物車
        let rows = 0;
        for (let i = 0; i < products.length; i++) {
          const temp = products[i];
          const res = await shoppingCartDao.DeleteShoppingCart(user_id, temp.productID);
          rows += res.affectedRows;
        }
        //判斷刪除購物車是否成功
        if (rows != products.length) {
          ctx.body = {
            code: '002',
            msg: '購買成功,但購物車沒有更新成功'
          }
          return;
        }

        ctx.body = {
          code: '001',
          msg: '購買成功'
        }
      } else {
        ctx.body = {
          code: '004',
          msg: '購買失敗,未知原因'
        }
      }
    } catch (error) {
      // reject(error);
      ctx.body = {
        code: '500',
        msg: `資料庫操作失敗: ${error.message}`
      };
    }
  }
}