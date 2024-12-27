/*
 * @Description: 使用者管理模組控制器
 */
// const userManagementDao = require('../models/dao/userManagementDao');
const userDao = require('../models/dao/userDao');
const checkLogin = require('../middleware/checkLogin');

module.exports = {
  /**
   * 獲取所有的使用者訊息
   * @param {Object} ctx
   */
  GetUserManagement: async ctx => {
    let { user_id } = ctx.request.body;
    // 校驗使用者是否登入
    if (!checkLogin(ctx, user_id)) {
      return;
    }

    // 獲取所有的使用者資訊
    const userManagement = await userDao.GetUser();

    // 沒有使用者,直接回訊息
    if (userManagement.length == 0) {
      ctx.body = {
        code: '002',
        msg: '沒有符合條件的使用者'
      }
      return;
    }

    ctx.body = {
      code: '001',
      userManagementList: userManagement
    }
  },
  /**
   * 刪除使用者的訊息
   * @param {Object} ctx
   */
  DeleteUser: async ctx => {
    let { user_id } = ctx.request.body;

    // 判斷該使用者是否存在
    let tempUser = await userDao.FindUserById(user_id);

    if (tempUser.length > 0) {
      // 如果存在則刪除
      try {
        const result = await userDao.DeleteUser(user_id);
        // 判斷是否刪除成功
        if (result.affectedRows === 1) {
          ctx.body = {
            code: '001',
            msg: '刪除使用者成功'
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
        msg: '該使用者不存在'
      }
    }
  }
}