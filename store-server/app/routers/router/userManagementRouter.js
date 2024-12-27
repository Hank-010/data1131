/*
 * @Description: 使用者管理模組路由
 */
const Router = require('koa-router');
const userManagementController = require('../../controllers/userManagementController')

let userManagementRouter = new Router();

userManagementRouter
  .post('/user/userManagement/getUserManagement', userManagementController.GetUserManagement)
  .post('/user/userManagement/deleteUser', userManagementController.DeleteUser)

module.exports = userManagementRouter;