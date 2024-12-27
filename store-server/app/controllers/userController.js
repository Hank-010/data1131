/*
 * @Description: 使用者模組控制器
 */
const rp = require('request-promise');
const userDao = require('../models/dao/userDao');
const { checkUserInfo, checkUserName } = require('../middleware/checkUserInfo');

module.exports = {

  /**
   * 使用者登入
   * @param {Object} ctx
   */
  Login: async ctx => {

    let { userName, password } = ctx.request.body;

    // 校驗使用者資訊是否符合規則
    if (!checkUserInfo(ctx, userName, password)) {
      return;
    }

    // 連接資料庫根據使用者名稱和密碼查詢使用者信息
    let user = await userDao.Login(userName, password);
    // 結果集長度為0則代表沒有該用戶
    if (user.length === 0) {
      ctx.body = {
        code: '004',
        msg: '使用者名稱或密碼錯誤'
      }
      return;
    }

    // 資料庫設定使用者名稱唯一
    // 結果集長度為1則代表存在該用戶
    if (user.length === 1) {

      const loginUser = {
        user_id: user[0].user_id,
        userName: user[0].userName,
        userLevel: user[0].userLevel
      };
      // 保存使用者信息到session
      ctx.session.user = loginUser;

      ctx.body = {
        code: '001',
        user: loginUser,
        msg: '登入成功'
      }
      return;
    }


    //資料庫設定使用者名稱唯一
    //若存在user.length != 1 || user.length!=0
    //回傳未知錯誤
    //正常不會出現
    ctx.body = {
      code: '500',
      msg: '未知錯誤'
    }
  },
  /**
   * 使用者登入
   * @param {Object} ctx
   */
  miniProgramLogin: async ctx => {
    const appid = 'wxeb6a44c58ffde6c6';
    const secret = '9c40f33cf627f2e3a42f38b25e0687cc';
    let { code } = ctx.request.body;

    const api = `https://api.weixin.qq.com/sns/jscode2session?appid=${ appid }&secret=${ secret }&js_code=${ code }&grant_type=authorization_code`;
    // 透過 wx.login 介面取得臨時登入憑證 code 後
    // 傳到開發者伺服器呼叫此介面完成登入流程。
    const res = await rp.get({
      json: true,
      uri: api
    })
    const { session_key, openid } = res;

    // 連接資料庫根據用戶名查詢用戶信息
    let user = await userDao.FindUserByName(openid);
    if (user.length === 0) {
      // 結果集長度為0則代表不存在該使用者,先註冊
      try {
        // 連接資料庫插入用戶信息
        let registerResult = await userDao.Register(openid, openid);
        if (registerResult.affectedRows === 1) {
          // 操作所影響的記錄行數為1,則代表註冊成功
          await login();// 登入
        }
      } catch (error) {
        console.log(error)
      }
    } else if (user.length === 1) {
      // 如果已經存在，直接登入
      await login();
    } else {
      ctx.body = {
        code: '500',
        msg: '未知错误'
      }
    }
    async function login () {
      // 連接資料庫根據使用者名稱和密碼查詢使用者信息
      let tempUser = await userDao.Login(openid, openid);
      if (tempUser.length === 0) {
        // 登入失敗
        ctx.body = {
          code: '004',
          msg: '登入失敗'
        }
        return;
      }
      if (tempUser.length === 1) {
        // 登入成功
        const loginUser = {
          user_id: tempUser[0].user_id,
          openId: openid,
          sessionKey: session_key
        };
        // 儲存使用者資訊到session
        ctx.session.user = loginUser;

        ctx.body = {
          code: '001',
          userId: tempUser[0].user_id,
          msg: '登入成功'
        }
        return;
      }
    }
  },
  /**
   * 查詢是否存在某個使用者名稱,用於註冊時前端校驗
   * @param {Object} ctx
   */
  FindUserByName: async ctx => {
    let { userName } = ctx.request.body;

    // 校驗使用者名稱是否符合規則
    if (!checkUserName(ctx, userName)) {
      return;
    }
    // 連接資料庫根據用戶名查詢用戶信息
    let user = await userDao.FindUserByName(userName);
    // 結果集長度為0則代表不存在該使用者,可註冊
    if (user.length === 0) {
      ctx.body = {
        code: '001',
        msg: '使用者名稱不存在，可註冊'
      }
      return;
    }

    //資料庫設定使用者名稱唯一
    //結果集長度為1則代表存在該使用者,不可以註冊
    if (user.length === 1) {
      ctx.body = {
        code: '004',
        msg: '使用者名稱已經存在，不能註冊'
      }
      return;
    }

    
    //資料庫設定使用者名稱唯一，
    //若存在user.length != 1 || user.length!=0
    //回傳未知錯誤
    //正常不會出現
    ctx.body = {
      code: '500',
      msg: '未知錯誤'
    }
  },
  Register: async ctx => {
    let { userName, password } = ctx.request.body;

    // 校驗使用者資訊是否符合規則
    if (!checkUserInfo(ctx, userName, password)) {
      return;
    }
    // 連接資料庫根據使用者名查詢使用者資訊
    // 先判断该使用者是否存在
    let user = await userDao.FindUserByName(userName);

    if (user.length !== 0) {
      ctx.body = {
        code: '004',
        msg: '使用者名已經存在，不能註冊'
      }
      return;
    }

    try {
      // 獲取當前時間
      let registerTime = new Date(); // JavaScript Date 對象表示當前時間
      // 連接資料庫插入使用者資訊
      let registerResult = await userDao.Register(userName, password, registerTime);
      // 連接資料庫插入使用者資訊
      // let registerResult = await userDao.Register(userName, password);
      // 操作所影響的記錄行數為1,則代表註冊成功
      if (registerResult.affectedRows === 1) {
        ctx.body = {
          code: '001',
          msg: '註冊成功'
        }
        return;
      }
      // 否則失敗
      ctx.body = {
        code: '500',
        msg: '未知錯誤，註冊失敗'
      }
    } catch (error) {
      reject(error);
    }
  }
};