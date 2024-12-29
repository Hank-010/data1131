<!--
 * @Description: 專案根組件
  -->
<template>
  <div id="app" name="app">
    <el-container>
      <!-- 頂部導覽列 -->
      <div class="topbar">
        <div class="nav">
          <ul>
            <li v-if="this.$store.getters.getUser.userLevel === 3">
              <router-link to="/userManagement">使用者管理</router-link>
            </li>
            <li v-if="this.$store.getters.getUser.userLevel >= 2">
              <router-link to="/productManagement">商品管理</router-link>
            </li>
            <li v-if="this.$store.getters.getUser.userLevel >= 2">
              <el-button type="text" @click="registerProduct = true">商品註冊</el-button>
            </li>
            <li v-if="!this.$store.getters.getUser">
              <el-button type="text" @click="login">登入</el-button>
              <span class="sep">|</span>
              <el-button type="text" @click="register = true">註冊</el-button>
            </li>
            <li v-else>
              歡迎
              <el-popover placement="top" width="180" v-model="visible">
                <p>確定退出登入嗎？</p>
                <div style="text-align: right; margin: 10px 0 0">
                  <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="logout">確定</el-button>
                </div>
                <el-button type="text" slot="reference">{{this.$store.getters.getUser.userName}}</el-button>
              </el-popover>
            </li>
            <li>
              <router-link to="/order">我的訂單</router-link>
            </li>
            <li>
              <router-link to="/collect">我的收藏</router-link>
            </li>
            <li :class="getNum > 0 ? 'shopCart-full' : 'shopCart'">
              <router-link to="/shoppingCart">
                <i class="el-icon-shopping-cart-full"></i> 購物車
                <span class="num">({{getNum}})</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <!-- 頂部導覽列END -->

      <!-- 頂欄容器 -->
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          active-text-color="#409eff"
          router
        >
          <div class="logo">
            <router-link to="/">
              <img src="./assets/imgs/logo.png" alt />
            </router-link>
          </div>
          <el-menu-item index="/">首頁</el-menu-item>
          <el-menu-item index="/goods">全部商品</el-menu-item>
          <el-menu-item index="/about">關於我們</el-menu-item>

          <div class="so">
            <el-input placeholder="請輸入搜尋內容" v-model="search">
              <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
            </el-input>
          </div>
        </el-menu>
      </el-header>
      <!-- 頂欄容器END -->

      <!-- 登入模組 -->
      <MyLogin></MyLogin>
      <!-- 註冊模組 -->
      <MyRegister :register="register" @fromChild="isRegister"></MyRegister>
      <!-- 商品註冊模組 -->
      <ProductRegister :registerProduct="registerProduct" @fromChild="isRegisterProduct"></ProductRegister>

      <!-- 主要區域容器 -->
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
      <!-- 主要區域容器END -->

      <!-- 底欄容器 -->
      <el-footer>
        <div class="footer">
          <div class="ng-promise-box">
            <div class="ng-promise">
              <p class="text">
                <a class="icon1" href="javascript:;">7天無理由退換貨</a>
                <a class="icon2" href="javascript:;">滿1000元免運費</a>
                <a class="icon3" style="margin-right: 0" href="javascript:;">100%品質保證</a>
              </p>
            </div>
          </div>
          <div class="github">
            <a href="https://github.com/Hank-010/data1131" target="_blank">
              <div class="github-but"></div>
            </a>
          </div>
          <div class="mod_help">
            <p>
              <router-link to="/">首頁</router-link>
              <span>|</span>
              <router-link to="/goods">全部商品</router-link>
              <span>|</span>
              <router-link to="/about">關於我們</router-link>
            </p>
            <p class="coty">商城版權所有 &copy; 1999-2077</p>
          </div>
        </div>
      </el-footer>
      <!-- 底欄容器END -->
    </el-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";

export default {
  beforeUpdate() {
    this.activeIndex = this.$route.path;
  },
  data() {
    return {
      activeIndex: "", // 頭部導覽列選取的標籤
      search: "", // 搜索條件
      register: false, // 是否顯示註冊組件
      registerProduct: false, // 是否顯示商品註冊組件
      visible: false // 是否登出登入
    };
  },
  created() {
    // 取得瀏覽器localStorage，判斷使用者是否已登入
    if (localStorage.getItem("user")) {
      // 如果已經登入，設定vuex登入狀態
      this.setUser(JSON.parse(localStorage.getItem("user")));
    }
  },
  computed: {
    ...mapGetters(["getUser", "getNum"])
  },
  watch: {
    // 獲取vuex的登入狀態
    getUser: function(val) {
      if (val === "") {
        // 使用者沒有登入
        this.setShoppingCart([]);
      } else {
        // 使用者已登入,取得該使用者的購物車信息
        this.$axios
          .post("/api/user/shoppingCart/getShoppingCart", {
            user_id: val.user_id
          })
          .then(res => {
            if (res.data.code === "001") {
              // 001 為成功, 更新vuex購物車狀態
              this.setShoppingCart(res.data.shoppingCartData);
            } else {
              // 提示失敗訊息
              this.notifyError(res.data.msg);
            }
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
    }
  },
  methods: {
    ...mapActions(["setUser", "setShowLogin", "setShoppingCart"]),
    login() {
      // 點選登入按鈕, 透過變更vuex的showLogin值顯示登入元件
      this.setShowLogin(true);
    },
    // 退出登入
    logout() {
      this.visible = false;
      // 清空本地登入訊息
      localStorage.setItem("user", "");
      // 清空vuex登入訊息
      this.setUser("");
      this.notifySucceed("成功退出登入");
      this.$router.push({ path: "/" });
      setTimeout(() => {
        location.reload();
      }, 50);
    },
    // 接收註冊子組件傳過來的數據
    isRegister(val) {
      this.register = val;
    },
    // 接收商品註冊子組件傳過來的數據
    isRegisterProduct(val) {
      this.registerProduct = val;
      // if (!val) {
      //   setTimeout(() => {
      //   location.reload();
      // }, 50);
      // }
    },
    // 點擊搜尋按鈕
    searchClick() {
      if (this.search != "") {
        // 跳到全部商品頁面,並傳遞搜尋條件
        this.$router.push({ path: "/goods", query: { search: this.search } });
        this.search = "";
      }
    }
  }
};
</script>

<style>
/* 全局CSS */
* {
  padding: 0;
  margin: 0;
  border: 0;
  list-style: none;
}
#app .el-header {
  padding: 0;
}
#app .el-main {
  min-height: 300px;
  padding: 20px 0;
}
#app .el-footer {
  padding: 0;
}
a,
a:hover {
  text-decoration: none;
}
/* 全局CSS END */

/* 頂部導覽列CSS */
.topbar {
  height: 40px;
  background-color: #3d3d3d;
  margin-bottom: 20px;
}
.topbar .nav {
  width: 1225px;
  margin: 0 auto;
}
.topbar .nav ul {
  float: right;
}
.topbar .nav li {
  float: left;
  height: 40px;
  color: #b0b0b0;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  margin-left: 20px;
}
.topbar .nav .sep {
  color: #b0b0b0;
  font-size: 12px;
  margin: 0 5px;
}
.topbar .nav li .el-button {
  color: #b0b0b0;
}
.topbar .nav .el-button:hover {
  color: #fff;
}
.topbar .nav li a {
  color: #b0b0b0;
}
.topbar .nav a:hover {
  color: #fff;
}
.topbar .nav .shopCart {
  width: 120px;
  background: #424242;
}
.topbar .nav .shopCart:hover {
  background: #fff;
}
.topbar .nav .shopCart:hover a {
  color: #ff6700;
}
.topbar .nav .shopCart-full {
  width: 120px;
  background: #ff6700;
}
.topbar .nav .shopCart-full a {
  color: white;
}
/* 頂部導覽列CSS END */

/* 頂欄容器CSS */
.el-header .el-menu {
  max-width: 1225px;
  margin: 0 auto;
}
.el-header .logo {
  height: 60px;
  width: 189px;
  float: left;
  margin-right: 100px;
}
.el-header .so {
  margin-top: 10px;
  width: 300px;
  float: right;
}
/* 頂欄容器CSS END */

/* 底欄容器CSS */
.footer {
  width: 100%;
  text-align: center;
  background: #2f2f2f;
  padding-bottom: 20px;
}
.footer .ng-promise-box {
  border-bottom: 1px solid #3d3d3d;
  line-height: 145px;
}
.footer .ng-promise-box {
  margin: 0 auto;
  border-bottom: 1px solid #3d3d3d;
  line-height: 145px;
}
.footer .ng-promise-box .ng-promise p a {
  color: #fff;
  font-size: 20px;
  margin-right: 210px;
  padding-left: 44px;
  height: 40px;
  display: inline-block;
  line-height: 40px;
  text-decoration: none;
  background: url("./assets/imgs/us-icon.png") no-repeat left 0;
}
.footer .github {
  height: 50px;
  line-height: 50px;
  margin-top: 20px;
}
.footer .github .github-but {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  background: url("./assets/imgs/github.png") no-repeat;
}
.footer .mod_help {
  text-align: center;
  color: #888888;
}
.footer .mod_help p {
  margin: 20px 0 16px 0;
}

.footer .mod_help p a {
  color: #888888;
  text-decoration: none;
}
.footer .mod_help p a:hover {
  color: #fff;
}
.footer .mod_help p span {
  padding: 0 22px;
}
/* 底欄容器CSS END */
</style>