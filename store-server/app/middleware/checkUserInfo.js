/*
 * @Description: 校驗使用者資訊是否符合規則
 */
module.exports = {
  /**
   * 校驗使用者資訊是否符合規則
   * @param {Object} ctx
   * @param {string} userName
   * @param {string} password
   * @return: 
   */
  checkUserInfo: (ctx, userName = '', password = '') => {
    // userName = userName ? userName : '';
    // password = password ? password : '';
    // 判斷是否為空
    if (userName.length === 0 || password.length === 0) {
      ctx.body = {
        code: '002',
        msg: '使用者名稱或密碼不能為空'
      }
      return false;
    }
    // 使用者名稱校驗規則
    const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
    if (!userNameRule.test(userName)) {
      ctx.body = {
        code: '003',
        msg: '使用者名稱不合法(以字母開頭，5-16字符，只能包含字母數字底線)'
      }
      return false;
    }
    // 密碼驗證規則
    const passwordRule = /^[a-zA-Z]\w{5,17}$/;
    if (!passwordRule.test(password)) {
      ctx.body = {
        code: '003',
        msg: '密碼不合法(以字母開頭，長度在6~18之間，只能包含字母、數字和底線)'
      }
      return false;
    }

    return true;
  },
  /**
   * 校驗使用者名稱是否符合規則
   * @param {type} 
   * @return: 
   */
  checkUserName: (ctx, userName = '') => {
    // 判斷是否為空
    if (userName.length === 0) {
      ctx.body = {
        code: '002',
        msg: '使用者名稱不能為空'
      }
      return false;
    }
    // 使用者名稱校验规则
    const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
    if (!userNameRule.test(userName)) {
      ctx.body = {
        code: '003',
        msg: '使用者名稱不合法(以字母開頭，5-16字符，只能包含字母數字底線)'
      }
      return false;
    }

    return true;
  }
}