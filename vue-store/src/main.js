/*
 * 入口文件
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 全域函數及變數
import Global from './Global';
Vue.use(Global);

import Axios from 'axios';
Vue.prototype.$axios = Axios;

// 全域請求攔截器
Axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    // 跳轉error頁面
    router.push({ path: "/error" });
    return Promise.reject(error);
  }
);

// 全域響應攔截器
Axios.interceptors.response.use(
  res => {
    if (res.data.code === "401") {
      // 401表示沒有登入
      // 提示沒有登入
      Vue.prototype.notifyError(res.data.msg);
      // 修改vuex的showLogin狀態,顯示登入元件
      store.dispatch("setShowLogin", true);
    }
    if (res.data.code === "500") {
      // 500表示伺服器異常
      // 跳轉error頁面
      router.push({ path: "/error" });
    }
    return res;
  },
  error => {
    // 跳轉error頁面
    router.push({ path: "/error" });
    return Promise.reject(error);
  }
);

// 全域攔截器,在進入需要使用者權限的頁面前校驗是否已登入
router.beforeResolve((to, from, next) => {
  const loginUser = store.state.user.user;
  // 判斷路由是否設定對應校驗使用者權限
  if (to.meta.requireAuth) {
    if (!loginUser) {
      // 沒有登入，顯示登入元件
      store.dispatch("setShowLogin", true);
      if (from.name == null) {
        // 此時，是在頁面沒有加載，直接在地址欄輸入鏈接，進入需要登入驗證的頁面
        next("/");
        return;
      }
      // 終止導航
      next(false);
      return;
    }
  }
  next();
});

// 相對時間過濾器,把時間戳記轉換成時間
// 格式: 2024-12-16 21:43:23
Vue.filter('dateFormat', (dataStr) => {
  var time = new Date(dataStr);
  function timeAdd0(str) {
    if (str < 10) {
      str = '0' + str;
    }
    return str;
  }
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '-' + timeAdd0(m) + '-' + timeAdd0(d) + ' ' + timeAdd0(h) + ':' + timeAdd0(mm) + ':' + timeAdd0(s);
});

// 全域元件
import MyMenu from './components/MyMenu';
Vue.component(MyMenu.name, MyMenu);
import MyList from './components/MyList';
Vue.component(MyList.name, MyList);
import MyLogin from './components/MyLogin';
Vue.component(MyLogin.name, MyLogin);
import MyRegister from './components/MyRegister';
Vue.component(MyRegister.name, MyRegister);
import UserList from './components/UserList';
Vue.component(UserList.name, UserList);
import ProductRegister from './components/ProductRegister';
Vue.component(ProductRegister.name, ProductRegister);
import MyProductList from './components/MyProductList';
Vue.component(MyProductList.name, MyProductList);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
