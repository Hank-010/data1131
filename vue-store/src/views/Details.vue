<!--
 * @Description: 商品詳情頁面組件
  -->
<template>
  <div id="details">
    <!-- 頭部 -->
    <div class="page-header">
      <div class="title">
        <p>{{productDetails.product_name}}</p>
        <div class="list">
          <ul>
            <li>
              <router-link to>概述</router-link>
            </li>
            <li>
              <router-link to>參數</router-link>
            </li>
            <li>
              <router-link to>使用者評價</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 頭部END -->

    <!-- 主要内容 -->
    <div class="main">
      <!-- 左側商品輪播圖 -->
      <div class="block">
        <el-carousel height="560px" v-if="productPicture.length>1">
          <el-carousel-item v-for="item in productPicture" :key="item.id">
            <img style="height:560px;" :src="$target + item.product_picture" :alt="item.intro" />
          </el-carousel-item>
        </el-carousel>
        <div v-if="productPicture.length==1">
          <img
            style="height:560px;"
            :src="$target + productPicture[0].product_picture"
            :alt="productPicture[0].intro"
          />
        </div>
      </div>
      <!-- 左側商品輪播圖END -->

      <!-- 右側內容區 -->
      <div class="content">
        <h1 class="name">{{productDetails.product_name}}</h1>
        <p class="intro">{{productDetails.product_intro}}</p>
        <p class="store">北科自營</p>
        <div class="price">
          <span>{{productDetails.product_selling_price}}元</span>
          <span
            v-show="productDetails.product_price != productDetails.product_selling_price"
            class="del"
          >{{productDetails.product_price}}元</span>
        </div>
        <div class="pro-list">
          <span class="pro-name">{{productDetails.product_name}}</span>
          <span class="pro-price">
            <span>{{productDetails.product_selling_price}}元</span>
            <span
              v-show="productDetails.product_price != productDetails.product_selling_price"
              class="pro-del"
            >{{productDetails.product_price}}元</span>
          </span>
          <p class="price-sum">總計 : {{productDetails.product_selling_price}}元</p>
        </div>
        <!-- 內容區底部按鈕 -->
        <div class="button">
          <el-button class="shop-cart" :disabled="dis" @click="addShoppingCart">加入購物車</el-button>
          <el-button class="like" @click="addCollect">喜歡</el-button>
        </div>
        <!-- 內容區底部按鈕END -->
        <div class="pro-policy">
          <ul>
            <li>
              <i class="el-icon-circle-check"></i> 北科自營
            </li>
            <li>
              <i class="el-icon-circle-check"></i> 北科出貨
            </li>
            <li>
              <i class="el-icon-circle-check"></i> 7天無理由退貨
            </li>
            <li>
              <i class="el-icon-circle-check"></i> 7天價格保護
            </li>
          </ul>
        </div>
      </div>
      <!-- 右側內容區END -->
    </div>
    <!-- 主要内容END -->
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      dis: false, // 控制“加入購物車按鈕是否可用”
      productID: "", // 商品id
      productDetails: "", // 商品詳細信息
      productPicture: "" // 商品圖片
    };
  },
  // 透過路由獲取商品id
  activated() {
    if (this.$route.query.productID != undefined) {
      this.productID = this.$route.query.productID;
    }
  },
  watch: {
    // 監聽商品id的變化，請求後端取得商品數據
    productID: function(val) {
      this.getDetails(val);
      this.getDetailsPicture(val);
    }
  },
  methods: {
    ...mapActions(["unshiftShoppingCart", "addShoppingCartNum"]),
    // 獲取商品詳細信息
    getDetails(val) {
      this.$axios
        .post("/api/product/getDetails", {
          productID: val
        })
        .then(res => {
          this.productDetails = res.data.Product[0];
        })
        .catch(err => {
          return Promise.reject(err);
        });
    },
    // 取得商品圖片
    getDetailsPicture(val) {
      this.$axios
        .post("/api/product/getDetailsPicture", {
          productID: val
        })
        .then(res => {
          this.productPicture = res.data.ProductPicture;
        })
        .catch(err => {
          return Promise.reject(err);
        });
    },
    // 加入購物車
    addShoppingCart() {
      // 判斷是否登入,沒有登入則顯示登入元件
      if (!this.$store.getters.getUser) {
        this.$store.dispatch("setShowLogin", true);
        return;
      }
      this.$axios
        .post("/api/user/shoppingCart/addShoppingCart", {
          user_id: this.$store.getters.getUser.user_id,
          product_id: this.productID
        })
        .then(res => {
          switch (res.data.code) {
            case "001":
              // 新加入購物車成功
              this.unshiftShoppingCart(res.data.shoppingCartData[0]);
              this.notifySucceed(res.data.msg);
              break;
            case "002":
              // 該商品已經在購物車，數量+1
              this.addShoppingCartNum(this.productID);
              this.notifySucceed(res.data.msg);
              break;
            case "003":
              // 商品數量達限購數量
              this.dis = true;
              this.notifyError(res.data.msg);
              setTimeout(() => {
                location.reload(); // 重新整理頁面
              }, 1000);
              break;
            default:
              this.notifyError(res.data.msg);
          }
        })
        .catch(err => {
          return Promise.reject(err);
        });
    },
    addCollect() {
      // 判斷是否登入,沒有登入則顯示登入元件
      if (!this.$store.getters.getUser) {
        this.$store.dispatch("setShowLogin", true);
        return;
      }
      this.$axios
        .post("/api/user/collect/addCollect", {
          user_id: this.$store.getters.getUser.user_id,
          product_id: this.productID
        })
        .then(res => {
          if (res.data.code == "001") {
            // 新增收藏成功
            this.notifySucceed(res.data.msg);
          } else {
            // 新增收藏失敗
            this.notifyError(res.data.msg);
          }
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }
  }
};
</script>
<style>
/* 頭部CSS */
#details .page-header {
  height: 64px;
  margin-top: -20px;
  z-index: 4;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  -webkit-box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
}
#details .page-header .title {
  width: 1225px;
  height: 64px;
  line-height: 64px;
  font-size: 18px;
  font-weight: 400;
  color: #212121;
  margin: 0 auto;
}
#details .page-header .title p {
  float: left;
}
#details .page-header .title .list {
  height: 64px;
  float: right;
}
#details .page-header .title .list li {
  float: left;
  margin-left: 20px;
}
#details .page-header .title .list li a {
  font-size: 14px;
  color: #616161;
}
#details .page-header .title .list li a:hover {
  font-size: 14px;
  color: #ff6700;
}
/* 頭部CSS END */

/* 主要内容CSS */
#details .main {
  width: 1225px;
  height: 560px;
  padding-top: 30px;
  margin: 0 auto;
}
#details .main .block {
  float: left;
  width: 560px;
  height: 560px;
}
#details .el-carousel .el-carousel__indicator .el-carousel__button {
  background-color: rgba(163, 163, 163, 0.8);
}
#details .main .content {
  float: left;
  margin-left: 25px;
  width: 640px;
}
#details .main .content .name {
  height: 30px;
  line-height: 30px;
  font-size: 24px;
  font-weight: normal;
  color: #212121;
}
#details .main .content .intro {
  color: #b0b0b0;
  padding-top: 10px;
}
#details .main .content .store {
  color: #ff6700;
  padding-top: 10px;
}
#details .main .content .price {
  display: block;
  font-size: 18px;
  color: #ff6700;
  border-bottom: 1px solid #e0e0e0;
  padding: 25px 0 25px;
}
#details .main .content .price .del {
  font-size: 14px;
  margin-left: 10px;
  color: #b0b0b0;
  text-decoration: line-through;
}
#details .main .content .pro-list {
  background: #f9f9fa;
  padding: 30px 60px;
  margin: 50px 0 50px;
}
#details .main .content .pro-list span {
  line-height: 30px;
  color: #616161;
}
#details .main .content .pro-list .pro-price {
  float: right;
}
#details .main .content .pro-list .pro-price .pro-del {
  margin-left: 10px;
  text-decoration: line-through;
}
#details .main .content .pro-list .price-sum {
  color: #ff6700;
  font-size: 24px;
  padding-top: 20px;
}
#details .main .content .button {
  height: 55px;
  margin: 10px 0 20px 0;
}
#details .main .content .button .el-button {
  float: left;
  height: 55px;
  font-size: 16px;
  color: #fff;
  border: none;
  text-align: center;
}
#details .main .content .button .shop-cart {
  width: 340px;
  background-color: #ff6700;
}
#details .main .content .button .shop-cart:hover {
  background-color: #f25807;
}

#details .main .content .button .like {
  width: 260px;
  margin-left: 40px;
  background-color: #b0b0b0;
}
#details .main .content .button .like:hover {
  background-color: #757575;
}
#details .main .content .pro-policy li {
  float: left;
  margin-right: 20px;
  color: #b0b0b0;
}
/* 主要内容CSS END */
</style>