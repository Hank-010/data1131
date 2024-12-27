<!--
 * @Description: 首頁元件
  -->
<template>
  <div class="home" id="home" name="home">
    <!-- 輪播圖 -->
    <div class="block">
      <el-carousel height="460px">
        <el-carousel-item v-for="item in carousel" :key="item.carousel_id">
          <img style="height:460px;" :src="$target + item.imgPath" :alt="item.describes" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 輪播圖END -->
    <div class="main-box">
      <div class="main">
        <!-- 手機商品展示區域 -->
        <div class="phone">
          <div class="box-hd">
            <div class="title">手機</div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <router-link to>
                <img :src="$target +'public/imgs/homepage/phone.png'" />
              </router-link>
            </div>
            <div class="list">
              <MyList :list="phoneList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
        <!-- 手機商品展示區域END -->

        <!-- 家電商品展示區域 -->
        <div class="appliance" id="promo-menu">
          <div class="box-hd">
            <div class="title">家電</div>
            <div class="more" id="more">
              <MyMenu :val="2" @fromChild="getChildMsg">
                <span slot="1">熱門</span>
                <span slot="2">電視影音</span>
              </MyMenu>
            </div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <ul>
                <li>
                  <img :src="$target +'public/imgs/homepage/appliance-promo1.png'" />
                </li>
                <li>
                  <img :src="$target +'public/imgs/homepage/appliance-promo2.png'" />
                </li>
              </ul>
            </div>
            <div class="list">
              <MyList :list="applianceList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
        <!-- 家電商品展示區域END -->

        <!-- 配件商品展示區域 -->
        <div class="accessory" id="promo-menu">
          <div class="box-hd">
            <div class="title">配件</div>
            <div class="more" id="more">
              <MyMenu :val="3" @fromChild="getChildMsg2">
                <span slot="1">熱門</span>
                <span slot="2">保護套</span>
                <span slot="3">充電器</span>
              </MyMenu>
            </div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <ul>
                <li>
                  <img :src="$target +'public/imgs/homepage/accessory-promo1.png'" alt />
                </li>
                <li>
                  <img :src="$target +'public/imgs/homepage/accessory-promo2.png'" alt />
                </li>
              </ul>
            </div>
            <div class="list">
              <MyList :list="accessoryList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
        <!-- 配件商品展示區域END -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      carousel: "", // 輪播圖數據
      phoneList: "", // 手機商品列表
      miTvList: "", // 電視商品列表
      applianceList: "", // 家電商品列表
      applianceHotList: "", //熱門家電商品列表
      accessoryList: "", //配件商品列表
      accessoryHotList: "", //熱門配件商品列表
      protectingShellList: "", // 保護套商品列表
      chargerList: "", //充電器商品列表
      applianceActive: 1, // 家電目前選取的商品分類
      accessoryActive: 1 // 配件目前選取的商品分類
    };
  },
  watch: {
    // 家電目前選取的商品分類，回應不同的商品數據
    applianceActive: function(val) {
      // 頁面初始化的時候把applianceHotList(熱門家電商品列表)直接賦值給applianceList(家電商品列表)
      // 所以在切換商品清單時判斷applianceHotList是否為空,為空則是第一次切換,把applianceList賦值給applianceHotList
      if (this.applianceHotList == "") {
        this.applianceHotList = this.applianceList;
      }
      if (val == 1) {
        // 1為熱門商品
        this.applianceList = this.applianceHotList;
        return;
      }
      if (val == 2) {
        // 2為電視商品
        this.applianceList = this.miTvList;
        return;
      }
    },
    accessoryActive: function(val) {
      // 頁面初始化的時候把accessoryHotList(熱門配件商品清單)直接賦值給accessoryList(配件商品清單)
      // 所以在切換商品清單時判斷accessoryHotList是否為空,為空則是第一次切換,把accessoryList賦值給accessoryHotList 
      if (this.accessoryHotList == "") {
        this.accessoryHotList = this.accessoryList;
      }
      if (val == 1) {
        // 1為熱門商品
        this.accessoryList = this.accessoryHotList;
        return;
      }
      if (val == 2) {
        // 2為保護套商品
        this.accessoryList = this.protectingShellList;
        return;
      }
      if (val == 3) {
        // 3為充電器商品
        this.accessoryList = this.chargerList;
        return;
      }
    }
  },
  created() {
    // 取得輪播圖數據
    this.$axios
      .post("/api/resources/carousel", {})
      .then(res => {
        this.carousel = res.data.carousel;
      })
      .catch(err => {
        return Promise.reject(err);
      });
    // 取得各類商品數據
    this.getPromo("手機", "phoneList");
    this.getPromo("電視機", "miTvList");
    this.getPromo("保護套", "protectingShellList");
    this.getPromo("充電器", "chargerList");
    this.getPromo(
      ["電視機", "空調", "洗衣機"],
      "applianceList",
      "/api/product/getHotProduct"
    );
    this.getPromo(
      ["保護套", "保護膜", "充電器", "行動電源"],
      "accessoryList",
      "/api/product/getHotProduct"
    );
  },
  methods: {
    // 取得家電模組子組件傳過來的數據
    getChildMsg(val) {
      this.applianceActive = val;
    },
    // 取得配件模組子組件傳過來的數據
    getChildMsg2(val) {
      this.accessoryActive = val;
    },
    // 取得各類商品資料方法封裝
    getPromo(categoryName, val, api) {
      api = api != undefined ? api : "/api/product/getPromoProduct";
      this.$axios
        .post(api, {
          categoryName
        })
        .then(res => {
          this[val] = res.data.Product;
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }
  }
};
</script>
<style scoped>
@import "../assets/css/index.css";
</style>