/*
 * @Description: 我的收藏模組控制器
 */
const collectDao = require('../models/dao/collectDao');
const productDao = require('../models/dao/productDao');
const checkLogin = require('../middleware/checkLogin');

module.exports = {
  /**
   * 新增收藏
   * @param {Object} ctx
   */
  AddCollect: async ctx => {
    let { user_id, product_id } = ctx.request.body;

    // 校驗使用者是否登入
    if (!checkLogin(ctx, user_id)) {
      return;
    }

    // 判斷該使用者的收藏清單是否有該商品
    let tempCollect = await collectDao.FindCollect(user_id, product_id);

    if (tempCollect.length > 0) {
      ctx.body = {
        code: '003',
        msg: '該商品已經新增收藏，請到我的收藏查看'
      }
      return;
    }

    // 取得當前時間戳
    const timeTemp = new Date().getTime();
    try {
      // 把收藏商品資訊插入資料庫
      const result = await collectDao.AddCollect(user_id, product_id, timeTemp);
      // 插入成功
      if (result.affectedRows === 1) {
        ctx.body = {
          code: '001',
          msg: '新增收藏成功'
        }
        return;
      }
    } catch (error) {
      reject(error);
    }

    ctx.body = {
      code: '002',
      msg: '新增收藏失敗'
    }
  },
  /**
   * 獲取使用者的所有收藏商品訊息
   * @param {Object} ctx
   */
  GetCollect: async ctx => {
    let { user_id } = ctx.request.body;
    // 校驗使用者是否登入
    if (!checkLogin(ctx, user_id)) {
      return;
    }
    // 獲取所有收藏資訊
    const collect = await collectDao.GetCollect(user_id);

    // 該使用者沒有收藏的商品,直接回訊息
    if (collect.length == 0) {
      ctx.body = {
        code: '002',
        msg: '該使用者沒有收藏的商品'
      }
      return;
    }

    let collectList = [];
    // 產生收藏商品的詳細資料列表
    for (let i = 0; i < collect.length; i++) {
      const temp = collect[i];
      // 獲取每個商品詳細信息
      const product = await productDao.GetProductById(temp.product_id);
      collectList.push(product[0]);
    }

    ctx.body = {
      code: '001',
      collectList: collectList
    }
  },
  /**
   * 刪除使用者的收藏商品訊息
   * @param {Object} ctx
   */
  DeleteCollect: async ctx => {
    let { user_id, product_id } = ctx.request.body;
    // 校驗使用者是否登入
    if (!checkLogin(ctx, user_id)) {
      return;
    }

    // 判斷該使用者的收藏清單是否有該商品
    let tempCollect = await collectDao.FindCollect(user_id, product_id);

    if (tempCollect.length > 0) {
      // 如果存在則刪除
      try {
        const result = await collectDao.DeleteCollect(user_id, product_id);
        // 判斷是否刪除成功
        if (result.affectedRows === 1) {
          ctx.body = {
            code: '001',
            msg: '刪除收藏成功'
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
        msg: '該商品不在收藏列表'
      }
    }
  }
}