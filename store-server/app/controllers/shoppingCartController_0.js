/*
 * @Description: 購物車模組控制器
 */
const shoppingCartDao = require('../models/dao/shoppingCartDao');
const productDao = require('../models/dao/productDao');
const checkLogin = require('../middleware/checkLogin');

let methods = {
  /**
   * 產生購物車詳細信息
   * @param {Object} data
   */
  ShoppingCartData: async data => {
    let shoppingCartData = [];
    for (let i = 0; i < data.length; i++) {
      const temp = data[i];
      const product = await productDao.GetProductById(temp.product_id);

      let shoppingCartDataTemp = {
        id: temp.id,
        productID: temp.product_id,
        productName: product[0].product_name,
        productImg: product[0].product_picture,
        price: product[0].product_selling_price,
        num: temp.num,
        maxNum: Math.floor(product[0].product_num / 2),
        check: false
      };

      shoppingCartData.push(shoppingCartDataTemp);
    }
    return shoppingCartData;
  }
}

module.exports = {
  /**
   * 獲取購物車信息
   * @param {Object} ctx
   */
  GetShoppingCart: async ctx => {
    let { user_id } = ctx.request.body;
    // 校驗使用者是否登入
    if (!checkLogin(ctx, user_id)) {
      return;
    }
    // 獲取購物車信息
    const shoppingCart = await shoppingCartDao.GetShoppingCart(user_id);
    // 產生購物車詳細信息
    const data = await methods.ShoppingCartData(shoppingCart);

    ctx.body = {
      code: '001',
      shoppingCartData: data
    }
  },
  /**
   * 插入購物車訊息
   * @param {Object} ctx
   */
  AddShoppingCart: async ctx => {
    let { user_id, product_id } = ctx.request.body;
    // 校驗使用者是否登入
    if (!checkLogin(ctx, user_id)) {
      return;
    }
  
    // 獲取商品資訊
    const product = await productDao.GetProductById(product_id);
  
    if (product.length === 0) {
      ctx.body = {
        code: '006',
        msg: '商品不存在'
      };
      return;
    }
  
    const maxNum = Math.floor(product[0].product_num / 2); // 限購數量
    const sales = product[0].product_sales; // 已售數量
    const availableStock = product[0].product_num - sales; // 剩餘庫存
  
    // 判斷剩餘庫存是否足夠
    if (availableStock <= 0) {
      ctx.body = {
        code: '003',
        msg: `庫存不足，該商品已售罄`
      };
      return;
    }
  
    // 獲取購物車中的商品
    let tempShoppingCart = await shoppingCartDao.FindShoppingCart(user_id, product_id);
  
    // 判斷該用戶的購物車是否已有該商品
    if (tempShoppingCart.length > 0) {
      const tempNum = tempShoppingCart[0].num + 1;
  
      // 判斷是否超過限購數量
      if (tempNum > maxNum) {
        ctx.body = {
          code: '003',
          msg: '數量達到限購數量 ' + maxNum
        };
        return;
      }
  
      // 判斷剩餘庫存是否足夠
      if (tempNum > availableStock) {
        ctx.body = {
          code: '003',
          msg: `庫存不足，僅剩 ${availableStock} 件可購買`
        };
        return;
      }
  
      try {
        // 更新購物車訊息，把數量 +1
        const result = await shoppingCartDao.UpdateShoppingCart(tempNum, user_id, product_id);
  
        if (result.affectedRows === 1) {
          ctx.body = {
            code: '002',
            msg: '該商品已在購物車，數量 +1'
          };
          return;
        }
      } catch (error) {
        ctx.body = {
          code: '005',
          msg: '增加購物車失敗, 伺服器錯誤'
        };
        console.error(error);
        return;
      }
    } else {
      // 商品不在購物車中，新增到購物車
      try {
        const res = await shoppingCartDao.AddShoppingCart(user_id, product_id);
  
        if (res.affectedRows === 1) {
          ctx.body = {
            code: '001',
            msg: '加入購物車成功'
          };
          return;
        }
      } catch (error) {
        ctx.body = {
          code: '005',
          msg: '增加購物車失敗, 伺服器錯誤'
        };
        console.error(error);
        return;
      }
    }
  
    ctx.body = {
      code: '005',
      msg: '增加購物車失敗, 未知錯誤'
    };
  },
  
  /**
   * 刪除購物車訊息
   * @param {Object} ctx
   */
  DeleteShoppingCart: async ctx => {
    let { user_id, product_id } = ctx.request.body;
    // 校驗用戶是否登入
    if (!checkLogin(ctx, user_id)) {
      return;
    }

    // 判斷該用戶的購物車是否有該商品
    let tempShoppingCart = await shoppingCartDao.FindShoppingCart(user_id, product_id);

    if (tempShoppingCart.length > 0) {
      // 如果存在則刪除
      try {
        const result = await shoppingCartDao.DeleteShoppingCart(user_id, product_id);
        // 判斷是否刪除成功
        if (result.affectedRows === 1) {
          ctx.body = {
            code: '001',
            msg: '刪除購物車成功'
          }
          return;
        }
      } catch (error) {
        reject(error);
      }
    } else {
      // 不存在則回傳訊息
      ctx.body = {
        code: '002',
        msg: '該商品不在購物車'
      }
    }
  },
  /**
   * 更新購物車商品數量
   * @param {Object} ctx
   */
  UpdateShoppingCart: async ctx => {
    let { user_id, product_id, num } = ctx.request.body;
    // 校驗用戶是否登入
    if (!checkLogin(ctx, user_id)) {
      return;
    }
    // 判斷數量是否小於1
    if (num < 1) {
      ctx.body = {
        code: '004',
        msg: '數量不合法，最小數量為 1'
      };
      return;
    }

    // 判斷該用戶的購物車是否有該商品
    const tempShoppingCart = await shoppingCartDao.FindShoppingCart(user_id, product_id);

    if (tempShoppingCart.length > 0) {
      // 如果存在，判斷數量是否有變化
      if (tempShoppingCart[0].num === num) {
        ctx.body = {
          code: '003',
          msg: '數量沒有發生變化'
        };
        return;
      }    
      // 獲取商品信息
      const product = await productDao.GetProductById(product_id);
      const maxNum = Math.floor(product[0].product_num / 2); // 限購數量
      const sales = product[0].product_sales; // 已售出數量
      const availableStock = product[0].product_num - sales; // 剩餘庫存
      // 判斷是否超過限購數量
      if (num > maxNum) {
        ctx.body = {
          code: '004',
          msg: `數量達到限購數量，最多可購買 ${maxNum} 件`
        };
        return;
      }
  
      // 判斷剩餘庫存是否足夠
      if (num > availableStock) {
        ctx.body = {
          code: '004',
          msg: `庫存不足，僅剩 ${availableStock} 件可購買`
        };
        return;
      }

      try {
        // 修改購物車數量
        const result = await shoppingCartDao.UpdateShoppingCart(num, user_id, product_id);
        // 判斷是否修改成功
        if (result.affectedRows === 1) {
          ctx.body = {
            code: '001',
            msg: '修改購物車數量成功'
          };
          return;
        }
      } catch (error) {
        reject(error);
      }
    } else {
      // 購物車中不存在該商品
      ctx.body = {
        code: '002',
        msg: '該商品不在購物車'
      }
    }
  }
}