/*
 * @Description: 匯總模組子路由
 */
const Router = require('koa-router');

let Routers = new Router();

const userRouter = require('./router/userRouter');
const resourcesRouter = require('./router/resourcesRouter');
const productRouter = require('./router/productRouter');
const shoppingCartRouter = require('./router/shoppingCartRouter');
const orderRouter = require('./router/orderRouter');
const collectRouter = require('./router/collectRouter');
const userManagementRouter = require('./router/userManagementRouter');

Routers.use(userRouter.routes());
Routers.use(resourcesRouter.routes());
Routers.use(productRouter.routes());
Routers.use(shoppingCartRouter.routes());
Routers.use(orderRouter.routes());
Routers.use(collectRouter.routes());
Routers.use(userManagementRouter.routes());

module.exports = Routers;