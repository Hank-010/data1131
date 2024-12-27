<!--
 * @Description: 全部商品頁面組件(包括全部商品,商品分類,商品搜尋)
  -->
<template>
  <div class="goods" id="goods" name="goods">
    <!-- 麵包屑 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/">首頁</el-breadcrumb-item>
        <!-- <el-breadcrumb-item @click="reloadPage">全部商品</el-breadcrumb-item> -->
        <el-breadcrumb-item>全部商品</el-breadcrumb-item>
        <el-breadcrumb-item v-if="search">搜索</el-breadcrumb-item>
        <el-breadcrumb-item v-else>分類</el-breadcrumb-item>
        <el-breadcrumb-item v-if="search">{{search}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 麵包屑END -->

    <!-- 分類標籤 -->
    <div class="nav">
      <div class="product-nav">
        <div class="title">分類</div>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane
            v-for="item in categoryList"
            :key="item.category_id"
            :label="item.category_name"
            :name="''+item.category_id"
          />
        </el-tabs>
      </div>
    </div>
    <!-- 分類標籤END -->

    <!-- 主要内容區 -->
    <div class="main">
      <div class="list">
        <MyList :list="product" v-if="product.length>0"></MyList>
        <div v-else class="none-product">抱歉沒找到相關的商品，看看其他的商品</div>
      </div>
      <!-- 分頁 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          @current-change="currentChange"
        ></el-pagination>
      </div>
      <!-- 分頁END -->
    </div>
    <!-- 主要内容區END -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      categoryList: "", //分類列表
      categoryID: [], // 分類id
      product: "", // 商品列表
      productList: "",
      total: 0, // 商品总量
      pageSize: 15, // 每頁顯示的商品數量
      currentPage: 1, //目前頁碼
      activeName: "-1", // 分類列表目前選取的id
      search: "" // 搜尋條件
    };
  },
  created() {
    // 取得分類列表
    this.getCategory();
  },
  activated() {
    this.activeName = "-1"; // 初始化分類列表目前選取的id為-1
    this.total = 0; // 初始化商品總量為0
    this.currentPage = 1; //初始化當前頁碼為1
    // 如果路由沒有傳遞參數，預設為顯示全部商品
    if (Object.keys(this.$route.query).length == 0) {
      this.categoryID = [];
      this.activeName = "0";
      return;
    }
    // 如果路由傳遞了categoryID，則顯示對應的分類商品
    if (this.$route.query.categoryID != undefined) {
      this.categoryID = this.$route.query.categoryID;
      if (this.categoryID.length == 1) {
        this.activeName = "" + this.categoryID[0];
      }
      return;
    }
    // 如果路由傳遞了search，則為搜索，顯示對應的分類商品
    if (this.$route.query.search != undefined) {
      this.search = this.$route.query.search;
    }
  },
  watch: {
    // 監聽點擊了哪個分類標籤，透過修改分類id，回應對應的商品
    activeName: function(val) {
      if (val == 0) {
        this.categoryID = [];
      }
      if (val > 0) {
        this.categoryID = [Number(val)];
      }
      // 初始化商品總量和當前頁碼
      this.total = 0;
      this.currentPage = 1;
      // 更新地址欄鏈接，方便刷新頁面可以回到原來的頁面
      this.$router.push({
        path: "/goods",
        query: { categoryID: this.categoryID }
      });
    },
    // 監聽搜尋條件，回應對應的商品
    search: function(val) {
      if (val != "") {
        this.getProductBySearch(val);
      }
    },
    // 監聽分類id，回應相應的商品
    categoryID: function() {
      this.getData();
      this.search = "";
    },
    // 監聽路由變化，更新路由傳遞了搜尋條件
    $route: function(val) {
      if (val.path == "/goods") {
        if (val.query.search != undefined) {
          this.activeName = "-1";
          this.currentPage = 1;
          this.total = 0;
          this.search = val.query.search;
        }
      }
    }
  },
  methods: {
    // 回到頂部
    backtop() {
      const timer = setInterval(function() {
        const top = document.documentElement.scrollTop || document.body.scrollTop;
        const speed = Math.floor(-top / 5);
        document.documentElement.scrollTop = document.body.scrollTop =
          top + speed;

        if (top === 0) {
          clearInterval(timer);
        }
      }, 20);
    },
    // 頁碼變化呼叫currentChange方法
    currentChange(currentPage) {
      this.currentPage = currentPage;
      if (this.search != "") {
        this.getProductBySearch();
      } else {
        this.getData();
      }
      this.backtop();
    },
    // 向後端請求分類列表數據
    getCategory() {
      this.$axios
        .post("/api/product/getCategory", {})
        .then(res => {
          const val = {
            category_id: 0,
            category_name: "全部"
          };
          const cate = res.data.category;
          cate.unshift(val);
          this.categoryList = cate;
        })
        .catch(err => {
          return Promise.reject(err);
        });
    },
    // 向後端請求全部商品或分類商品數據
    getData() {
      // 如果分類清單為空則請求全部商品數據，否則請求分類商品數據
      const api =
        this.categoryID.length == 0
          ? "/api/product/getAllProduct"
          : "/api/product/getProductByCategory";
      this.$axios
        .post(api, {
          categoryID: this.categoryID,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          this.product = res.data.Product;
          this.total = res.data.total;
        })
        .catch(err => {
          return Promise.reject(err);
        });
    },
    // 透過搜尋條件向後端請求商品數據
    getProductBySearch() {
      this.$axios
        .post("/api/product/getProductBySearch", {
          search: this.search,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          this.product = res.data.Product;
          this.total = res.data.total;
        })
        .catch(err => {
          return Promise.reject(err);
        });
    },
    // 重新整理頁面
    // reloadPage() {
    //   location.reload();
    // }
  }
};
</script>

<style scoped>
.goods {
  background-color: #f5f5f5;
}
/* 麵包屑CSS */
.el-tabs--card .el-tabs__header {
  border-bottom: none;
}
.goods .breadcrumb {
  height: 50px;
  background-color: white;
}
.goods .breadcrumb .el-breadcrumb {
  width: 1225px;
  line-height: 30px;
  font-size: 16px;
  margin: 0 auto;
}
/* 麵包屑CSS END */

/* 分類標籤CSS */
.goods .nav {
  background-color: white;
}
.goods .nav .product-nav {
  width: 1225px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
}
.nav .product-nav .title {
  width: 50px;
  font-size: 16px;
  font-weight: 700;
  float: left;
}
/* 分類標籤CSS END */

/* 主要内容區CSS */
.goods .main {
  margin: 0 auto;
  max-width: 1225px;
}
.goods .main .list {
  min-height: 650px;
  padding-top: 14.5px;
  margin-left: -13.7px;
  overflow: auto;
}
.goods .main .pagination {
  height: 50px;
  text-align: center;
}
.goods .main .none-product {
  color: #333;
  margin-left: 13.7px;
}
/* 主要内容區CSS END */
</style>