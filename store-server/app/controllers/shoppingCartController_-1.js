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

    let tempShoppingCart = await shoppingCartDao.FindShoppingCart(user_id, product_id);
    //判斷該使用者的購物車是否有該商品
    if (tempShoppingCart.length > 0) {
      //如果存在則把數量+1
      const tempNum = tempShoppingCart[0].num + 1;

      const product = await productDao.GetProductById(tempShoppingCart[0].product_id);
      const maxNum = Math.floor(product[0].product_num / 2);
      //判斷數量是否達限購數量
      if (tempNum > maxNum) {
        ctx.body = {
          code: '003',
          msg: '數量達到限購數量 ' + maxNum
        }
        return;
      }

      try {
        // 更新購物車訊息,把數量+1
        const result = await shoppingCartDao.UpdateShoppingCart(tempNum, user_id, product_id);

        if (result.affectedRows === 1) {
          ctx.body = {
            code: '002',
            msg: '該商品已在購物車，數量 +1'
          }
          return;
        }
      } catch (error) {
        reject(error);
      }
    } else {
      //不存在則添加
      try {
        // 新插入購物車信息
        const res = await shoppingCartDao.AddShoppingCart(user_id, product_id);
        // 判斷是否插入成功
        if (res.affectedRows === 1) {
          // 如果成功,取得該商品的購物車訊息
          const shoppingCart = await shoppingCartDao.FindShoppingCart(user_id, product_id);
          // 產生購物車詳細信息
          const data = await methods.ShoppingCartData(shoppingCart);

          ctx.body = {
            code: '001',
            msg: '加入購物車成功',
            shoppingCartData: data
          }
          return;
        }
      } catch (error) {
        reject(error);
      }
    }

    ctx.body = {
      code: '005',
      msg: '增加購物車失敗,未知錯誤'
    }
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
        msg: '數量不合法'
      }
      return;
    }
    // 判斷該用戶的購物車是否有該商品
    let tempShoppingCart = await shoppingCartDao.FindShoppingCart(user_id, product_id);

    if (tempShoppingCart.length > 0) {
      // 如果存在則修改

      // 判斷數量是否有變化
      if (tempShoppingCart[0].num == num) {
        ctx.body = {
          code: '003',
          msg: '數量沒有發生變化'
        }
        return;
      }
      const product = await productDao.GetProductById(product_id);
      const maxNum = Math.floor(product[0].product_num / 2);
      // 判斷數量是否達到限購數量
      if (num > maxNum) {
        ctx.body = {
          code: '004',
          msg: '數量達限購數量 ' + maxNum
        }
        return;
      }

      try {
        // 修改購物車資訊
        const result = await shoppingCartDao.UpdateShoppingCart(num, user_id, product_id);
        // 判斷是否修改成功
        if (result.affectedRows === 1) {
          ctx.body = {
            code: '001',
            msg: '修改購物車數量成功'
          }
          return;
        }
      } catch (error) {
        reject(error);
      }
    } else {
      //不存在則回傳訊息
      ctx.body = {
        code: '002',
        msg: '該商品不在購物車'
      }
    }
  }
}