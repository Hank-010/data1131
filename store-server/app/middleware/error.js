/*
 * @Description: 全域錯誤處理中介軟體
 */
module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.log(error);
    ctx.body = {
      code: '500',
      msg: '伺服器未知錯誤'
    }
  }
}