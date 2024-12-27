/*
 * @Description: 使用者模組路由
 */
const Router = require('koa-router');
const userController = require('../../controllers/userController')

let userRouter = new Router();

userRouter
  .post('/users/login', userController.Login)
  .post('/users/miniProgramLogin', userController.miniProgramLogin)
  .post('/users/findUserByName', userController.FindUserByName)
  .post('/users/register', userController.Register)

module.exports = userRouter;