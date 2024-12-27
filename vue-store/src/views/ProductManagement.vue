<!--
 * @Description: 商品管理頁面元件
  -->
<template>
  <div class="productManagement">
    <div class="productManagement-header">
      <div class="productManagement-title">
        <i class="el-icon-product" style="color: #ff6700;"></i>
        商品管理
        <!-- <a href="javascript:void(0);" @click="register = true" class="btn-base btn-primary">新增使用者</a> -->
      </div>
      <!-- <MyRegister :register="register" @fromChild="isRegister"></MyRegister> -->
    </div>
    <div class="content">
      <div class="goods-list" v-if="productManagementList.length > 0">
        <MyProductList :list="productManagementList" :isDelete="true"></MyProductList>
      </div>
      <!-- 使用者清單為空的時候顯示的內容 -->
      <div v-else class="productManagement-empty">
        <div class="empty">
          <h2>沒有任何商品！</h2>
          <p>快去添加吧！</p>
        </div>
      </div>
      <!-- 使用者清單為空的時候顯示的內容END -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // register: false,
      productManagementList: [] // 原始使用者資料
    };
  },
  activated() {
    this.fetchProductManagementList();
  },
  methods: {
    // 獲取使用者管理列表
    fetchProductManagementList() {
      // 取得使用者數據
      this.$axios
        .post("/api/user/product/getProductManagement", {
          user_id: this.$store.getters.getUser.user_id
        })
        .then(res => {
          if (res.data.code === "001") {
            this.productManagementList = res.data.productManagementList;
          } 
        })
        .catch(err => {
        return Promise.reject(err);
      });
    // },
    // isRegister(val) {
    //   this.register = val;
    //   if (!val) {
    //     // 當註冊成功時，重新獲取列表或刷新頁面
    //     this.fetchProductManagementList();
    //   }
    }
  }
};
</script>


<style>
.productManagement {
  background-color: #f5f5f5;
}
.productManagement .productManagement-header {
  height: 64px;
  background-color: #fff;
  border-bottom: 2px solid #ff6700;
}
.productManagement .productManagement-header .productManagement-title {
  width: 1225px;
  margin: 0 auto;
  height: 64px;
  line-height: 58px;
  font-size: 28px;
}
.productManagement .productManagement-header .productManagement-title .btn-base {
  display: inline-block;
  width: 120px; /* 按鈕寬度 */
  height: 28px; /* 按鈕高度 */
  border: 1px solid #ff6700; /* 預設邊框顏色 */
  font-size: 16px; /* 字體大小 */
  line-height: 28px; /* 垂直置中 */
  text-align: center; /* 水平置中 */
  background-color: #ff6700; /* 按鈕背景 */
  color: #fff; /* 文字顏色 */
  cursor: pointer; /* 指針樣式 */
  text-decoration: none; /* 去掉下劃線 */
  transform: translate(10px, -5px);
}
.productManagement .productManagement-header .productManagement-title .btn-base:hover {
  background-color: #e65c00; /* 背景顏色加深 */
  border-color: #e65c00; /* 邊框顏色加深 */
}
.productManagement .content {
  padding: 20px 0;
  width: 1225px;
  margin: 0 auto;
}
.productManagement .content .goods-list {
  margin-left: -13.7px;
  overflow: hidden;
}
/* 使用者清單為空的時候顯示的內容CSS */
.productManagement .productManagement-empty {
  width: 1225px;
  margin: 0 auto;
}
.productManagement .productManagement-empty .empty {
  height: 280px;
  padding: 0 0 130px 558px;
  margin: 65px 0 0;
  background: url(../assets/imgs/cart-empty.png) no-repeat 124px 0;
  color: #b0b0b0;
  overflow: hidden;
}
.productManagement .productManagement-empty .empty h2 {
  margin: 70px 0 15px;
  font-size: 36px;
}
.productManagement .productManagement-empty .empty p {
  margin: 0 0 20px;
  font-size: 20px;
}
</style>
