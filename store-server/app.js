/*
 * @Description: app資訊
 */
const Koa = require('koa');
const KoaStatic = require('koa-static');
const KoaBody = require('koa-body');
const Session = require('koa-session');

let { Port, staticDir } = require('./config');

let app = new Koa();

// 處理異常
const error = require('./app/middleware/error');
app.use(error);

// 為靜態資源請求重寫url
const rewriteUrl = require('./app/middleware/RewriteUrl');
app.use(rewriteUrl);
// 使用koa-static處理靜態資源
app.use(KoaStatic(staticDir));

// session
const CONFIG = require('./app/middleware/session');
app.keys = ['session app keys'];
app.use(Session(CONFIG, app));

// 判斷是否登入
const isLogin = require('./app/middleware/isLogin');
app.use(isLogin);

app.use(async (ctx, next) => {
  ctx.state.user = ctx.session.user;
  await next();
});

// 處理請求體數據
const koaBodyConfig = require('./app/middleware/koaBodyConfig');
app.use(KoaBody(koaBodyConfig));

// 使用路由中介軟體
const Routers = require('./app/routers');
app.use(Routers.routes()).use(Routers.allowedMethods());

app.listen(Port, () => {
  console.log(`伺服器啟動在${ Port }端口`);
});









const mysql = require('mysql');

// 創建資料庫連接池
const dbConfig = {
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'hank1022', // 確保這裡是你的正確密碼
  database: 'storeDB'
};

const pool = mysql.createPool(dbConfig);

// 測試連接
pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL 連接失敗: ', err.message);
  } else {
    console.log('MySQL 連接成功！');
    connection.release(); // 釋放連接
  }
});
