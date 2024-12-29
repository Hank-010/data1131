<!--
 * @Description: 確認訂單頁面組件
  -->
<template>
  <div class="confirmOrder">
    <!-- 頭部 -->
    <div class="confirmOrder-header">
      <div class="header-content">
        <p>
          <i class="el-icon-s-order"></i>
        </p>
        <p>確認訂單</p>
      </div>
    </div>
    <!-- 頭部END -->

    <!-- 主要内容容器 -->
    <div class="content">
      <!-- 選擇地址 -->
      <div class="section-address">
        <p class="title">收貨地址</p>
        <div class="address-body">
          <ul>
            <li
              :class="{ 'in-section': item.id === confirmAddress }"
              v-for="item in address"
              :key="item.id"
              @click="setAddress(item.id)"
            >
              <h2>{{ item.name }}</h2>
              <p class="phone">{{ item.phone }}</p>
              <p class="address">{{ item.address }}</p>
            </li>
            <li class="add-address">
              <i class="el-icon-circle-plus-outline"></i>
              <p>新增地址</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 選擇地址END -->

      <!-- 商品及優惠券 -->
      <div class="section-goods">
        <p class="title">商品及優惠券</p>
        <div class="goods-list">
          <ul>
            <li v-for="item in getCheckGoods" :key="item.id">
              <img :src="$target + item.productImg" alt="商品圖"/>
              <span class="pro-name">{{ item.productName }}</span>
              <span class="pro-price">{{ item.price }}元 x {{ item.num }}</span>
              <span class="pro-total">{{ item.price * item.num }}元</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 商品及優惠券END -->

      <!-- 配送方式 -->
      <div class="section-shipment">
        <p class="title">配送方式</p>
        <!-- <p class="shipment">郵寄</p> -->
        <p class="shipment" v-for="method in shipmentMethods" :key="method.id">
          {{ method.name }}
        </p>
      </div>
      <!-- 配送方式END -->

      <!-- 發票 -->
      <div class="section-invoice">
        <p class="title">發票</p>
        <p class="invoice">電子發票</p>
        <p class="invoice">個人</p>
        <p class="invoice">商品明细</p>
      </div>
      <!-- 發票END -->

      <!-- 結算列表 -->
      <div class="section-count">
        <div class="money-box">
          <ul>
            <li>
              <span class="title">商品件數：</span>
              <span class="value">{{ getCheckNum }}件</span>
            </li>
            <li>
              <span class="title">商品總價：</span>
              <span class="value">{{ getTotalPrice }}元</span>
            </li>
            <li>
              <span class="title">活動優惠：</span>
              <span class="value">-{{ activityDiscount || 0 }}元</span>
            </li>
            <li>
              <span class="title">優惠券抵扣：</span>
              <span class="value">-{{ couponDiscount || 0 }}元</span>
            </li>
            <li>
              <span class="title">運費：</span>
              <span class="value">{{ shippingFee || 0 }}元</span>
            </li>
            <li class="total">
              <span class="title">應付總額：</span>
              <span class="value">
                <span class="total-price">{{ totalAmount }}</span>元
              </span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 結算列表END -->

      <!-- 結算導航 -->
      <div class="section-bar">
        <div class="btn">
          <router-link to="/shoppingCart" class="btn-base btn-return">返回購物車</router-link>
          <a href="javascript:void(0);" @click="addOrder" class="btn-base btn-primary">結算</a>
        </div>
      </div>
      <!-- 結算導航END -->
    </div>
    <!-- 主要内容容器END -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
export default {
  name: "ConfirmOrder",
  data() {
    return {// 虛擬數據
      confirmAddress: 1, // 選擇的地址id
      address: [// 地址列表
        { id: 1, name: "陳同學", phone: "0984256357", address: "台灣 台北市 中正區 ***" },
        { id: 2, name: "王同學", phone: "0964185372", address: "台灣 新北市 新店區 ***" },
        // { id: 3, name: "李同學", phone: "0931285674", address: "台灣 桃園市 中壢區 ***" }
      ],
      shipmentMethods: [
        { id: 1, name: "宅配   " },
        // { id: 2, name: "超商取貨   " },
        // { id: 3, name: "貨到付款" }
      ],
      activityDiscount: 0, // 活動優惠
      couponDiscount: 0, // 優惠券抵扣
      // shippingFee: 50 // 運費
    };
  },
  created() {
    // 如果沒有勾選購物車商品直接進入確認訂單頁面,提示訊息並返回購物車
    if (this.getCheckNum < 1) {
      this.notifyError("請勾選商品後再結算");
      this.$router.push({ path: "/shoppingCart" });
    }
  },
  computed: {
    // 結算的商品數量; 結算商品總計; 結算商品資訊
    ...mapGetters(["getCheckNum", "getTotalPrice", "getCheckGoods"]),  
    shippingFee() { // 動態計算運費
      return this.getTotalPrice >= 1000 ? 0 : 50;
    },
    totalAmount() { // 計算應付總額
      return (
        this.getTotalPrice - this.activityDiscount - this.couponDiscount + this.shippingFee
      );
    }
  },
  methods: {
    ...mapActions(["deleteShoppingCart"]),
    addOrder() {
      this.$axios
        .post("/api/user/order/addOrder", {
          user_id: this.$store.getters.getUser.user_id,
          products: this.getCheckGoods,
          total_price: this.totalAmount
        })
        .then(res => {
          let products = this.getCheckGoods;
          switch (res.data.code) {
            // “001”代表結算成功
            case "001":
              for (let i = 0; i < products.length; i++) {
                const temp = products[i];
                // 刪除已經結算的購物車商品
                this.deleteShoppingCart(temp.id);
              }
              // 提示結算結果
              this.notifySucceed(res.data.msg);
              // 跳轉我的訂單頁面
              this.$router.push({ path: "/order" });
              break;
            default:
              // 提示失敗訊息
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
<style scoped>
.confirmOrder {
  background-color: #f5f5f5;
  padding-bottom: 20px;
}
/* 頭部CSS */
.confirmOrder .confirmOrder-header {
  background-color: #fff;
  border-bottom: 2px solid #ff6700;
  margin-bottom: 20px;
}
.confirmOrder .confirmOrder-header .header-content {
  width: 1225px;
  margin: 0 auto;
  height: 80px;
}
.confirmOrder .confirmOrder-header .header-content p {
  float: left;
  font-size: 28px;
  line-height: 80px;
  color: #424242;
  margin-right: 20px;
}
.confirmOrder .confirmOrder-header .header-content p i {
  font-size: 45px;
  color: #ff6700;
  line-height: 80px;
}
/* 頭部CSS END */

/* 主要内容容器CSS */
.confirmOrder .content {
  width: 1225px;
  margin: 0 auto;
  padding: 48px 0 0;
  background-color: #fff;
}

/* 选择地址CSS */
.confirmOrder .content .section-address {
  margin: 0 48px;
  overflow: hidden;
}
.confirmOrder .content .section-address .title {
  color: #333;
  font-size: 18px;
  line-height: 20px;
  margin-bottom: 20px;
}
.confirmOrder .content .address-body li {
  float: left;
  color: #333;
  width: 220px;
  height: 178px;
  border: 1px solid #e0e0e0;
  padding: 15px 24px 0;
  margin-right: 17px;
  margin-bottom: 24px;
}
.confirmOrder .content .address-body .in-section {
  border: 1px solid #ff6700;
}
.confirmOrder .content .address-body li h2 {
  font-size: 18px;
  font-weight: normal;
  line-height: 30px;
  margin-bottom: 10px;
}
.confirmOrder .content .address-body li p {
  font-size: 14px;
  color: #757575;
}
.confirmOrder .content .address-body li .address {
  padding: 10px 0;
  max-width: 180px;
  max-height: 88px;
  line-height: 22px;
  overflow: hidden;
}
.confirmOrder .content .address-body .add-address {
  text-align: center;
  line-height: 30px;
}
.confirmOrder .content .address-body .add-address i {
  font-size: 30px;
  padding-top: 50px;
  text-align: center;
}
/* 選擇地址CSS END */

/* 商品及優惠券CSS */
.confirmOrder .content .section-goods {
  margin: 0 48px;
}
.confirmOrder .content .section-goods p.title {
  color: #333;
  font-size: 18px;
  line-height: 40px;
}
.confirmOrder .content .section-goods .goods-list {
  padding: 5px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}
.confirmOrder .content .section-goods .goods-list li {
  padding: 10px 0;
  color: #424242;
  overflow: hidden;
}
.confirmOrder .content .section-goods .goods-list li img {
  float: left;
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.confirmOrder .content .section-goods .goods-list li .pro-name {
  float: left;
  width: 650px;
  line-height: 30px;
}
.confirmOrder .content .section-goods .goods-list li .pro-price {
  float: left;
  width: 150px;
  text-align: center;
  line-height: 30px;
}
.confirmOrder .content .section-goods .goods-list li .pro-status {
  float: left;
  width: 99px;
  height: 30px;
  text-align: center;
  line-height: 30px;
}
.confirmOrder .content .section-goods .goods-list li .pro-total {
  float: left;
  width: 190px;
  text-align: center;
  color: #ff6700;
  line-height: 30px;
}
/* 商品及優惠券CSS END */

/* 配送方式CSS */
.confirmOrder .content .section-shipment {
  margin: 0 48px;
  padding: 25px 0;
  border-bottom: 1px solid #e0e0e0;
  overflow: hidden;
}
.confirmOrder .content .section-shipment .title {
  float: left;
  width: 150px;
  color: #333;
  font-size: 18px;
  line-height: 38px;
}
.confirmOrder .content .section-shipment .shipment {
  float: left;
  line-height: 38px;
  font-size: 14px;
  color: #ff6700;
}
/* 配送方式CSS END */

/* 發票CSS */
.confirmOrder .content .section-invoice {
  margin: 0 48px;
  padding: 25px 0;
  border-bottom: 1px solid #e0e0e0;
  overflow: hidden;
}
.confirmOrder .content .section-invoice .title {
  float: left;
  width: 150px;
  color: #333;
  font-size: 18px;
  line-height: 38px;
}
.confirmOrder .content .section-invoice .invoice {
  float: left;
  line-height: 38px;
  font-size: 14px;
  margin-right: 20px;
  color: #ff6700;
}
/* 發票CSS END */

/* 結算列表CSS */
.confirmOrder .content .section-count {
  margin: 0 48px;
  padding: 20px 0;
  overflow: hidden;
}
.confirmOrder .content .section-count .money-box {
  float: right;
  text-align: right;
}
.confirmOrder .content .section-count .money-box .title {
  float: left;
  width: 126px;
  height: 30px;
  display: block;
  line-height: 30px;
  color: #757575;
}
.confirmOrder .content .section-count .money-box .value {
  float: left;
  min-width: 105px;
  height: 30px;
  display: block;
  line-height: 30px;
  color: #ff6700;
}
.confirmOrder .content .section-count .money-box .total .title {
  padding-top: 15px;
}
.confirmOrder .content .section-count .money-box .total .value {
  padding-top: 10px;
}
.confirmOrder .content .section-count .money-box .total-price {
  font-size: 30px;
}
/* 結算列表CSS END */

/* 結算導航CSS */
.confirmOrder .content .section-bar {
  padding: 20px 48px;
  border-top: 2px solid #f5f5f5;
  overflow: hidden;
}
.confirmOrder .content .section-bar .btn {
  float: right;
}
.confirmOrder .content .section-bar .btn .btn-base {
  float: left;
  margin-left: 30px;
  width: 158px;
  height: 38px;
  border: 1px solid #b0b0b0;
  font-size: 14px;
  line-height: 38px;
  text-align: center;
}
.confirmOrder .content .section-bar .btn .btn-return {
  color: rgba(0, 0, 0, 0.27);
  border-color: rgba(0, 0, 0, 0.27);
}
.confirmOrder .content .section-bar .btn .btn-primary {
  background: #ff6700;
  border-color: #ff6700;
  color: #fff;
}
/* 結算導航CSS */

/* 主要内容容器CSS END */
</style>