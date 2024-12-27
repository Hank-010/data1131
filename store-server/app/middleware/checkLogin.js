/*
 * @Description: 判斷是否登入(session中的使用者id與請求體傳過來的使用者id是否一致)
 */

/**
 * 校驗使用者是否登入
 * @param {Object} ctx
 * @param {int} user_id
 * @returns
 */
module.exports = function (ctx, user_id) {
  // 判斷請求傳遞的使用者id 與 session中的使用者id是否一致
  if (user_id != ctx.session.user.user_id) {
    ctx.body = {
      code: '401',
      msg: '使用者名稱沒有登入，請登入後再操作'
    }
    return false;
  }
  return true;
}