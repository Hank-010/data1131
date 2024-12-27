/*
 * @Description: 全域登入攔截器
 */
module.exports = async (ctx, next) => {
  if (ctx.url.startsWith('/user/')) {
    if (!ctx.session.user) {
      ctx.body = {
        code: '401',
        msg: '使用者沒有登入，請登入後再操作'
      }
      return;
    }
  }
  await next();
}