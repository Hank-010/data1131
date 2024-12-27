<!--
 * @Description: 商品註冊組件
  -->
  <template>
    <div id="registerProduct">
      <el-dialog title="註冊商品" width="400px" center :visible.sync="isRegisterProduct">
        <el-form
          :model="RegisterProduct"
          :rules="rules"
          status-icon
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <el-form-item prop="product_name">
            <el-input
              prefix-icon="el-icon-goods"
              placeholder="請輸入商品名稱"
              v-model="RegisterProduct.product_name"
            ></el-input>
          </el-form-item>
  
          <el-form-item prop="product_title">
            <el-input
              prefix-icon="el-icon-document"
              placeholder="請輸入商品標題"
              v-model="RegisterProduct.product_title"
            ></el-input>
          </el-form-item>
  
          <el-form-item prop="product_intro">
            <el-input
              prefix-icon="el-icon-info"
              placeholder="請輸入商品介紹"
              v-model="RegisterProduct.product_intro"
            ></el-input>
          </el-form-item>
  
          <el-form-item prop="product_price">
            <el-input
              prefix-icon="el-icon-price-tag"
              placeholder="請輸入商品價格"
              v-model="RegisterProduct.product_price"
            ></el-input>
          </el-form-item>
  
          <el-form-item prop="product_selling_price">
            <el-input
              prefix-icon="el-icon-discount"
              placeholder="請輸入銷售價格"
              v-model="RegisterProduct.product_selling_price"
            ></el-input>
          </el-form-item>
  
          <el-form-item prop="product_num">
            <el-input
              prefix-icon="el-icon-box"
              placeholder="請輸入商品庫存"
              v-model="RegisterProduct.product_num"
            ></el-input>
          </el-form-item>
  
          <el-form-item>
            <el-button size="medium" type="primary" @click="ProductRegister" style="width: 100%;">
              註冊商品
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </template>

<script>
export default {
  name: "ProductRegister",
  props: ["registerProduct"],
  data() {
    // 商品名稱的校驗方法
    let validateName = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("請輸入商品名稱"));
      }
      // 商品名稱長度在30字之間
      if (value.length > 30) {
        return callback(new Error("長度需在 30 字以內"));
      }
      // 校驗內容是否符合規範（允許擴展字符集）
      const nameRule = /^[\u4e00-\u9fa5a-zA-Z0-9，。！？、；：“”‘’（）《》【】[\]{}|+\-/*<>@#$%^&=.~(),?!:;"'\s]{1,30}$/;
      if (nameRule.test(value)) {
        this.$refs.ruleForm.validateField("checkPass");
        return callback();
      } else {
        return callback(
          new Error("只能包含中文、英文、數字及常見符號")
        );
      }
    };
    // 商品標題的校驗方法
    let validateTitle = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("請輸入商品標題"));
      }
      //  商品標題長度在200字之間
      if (value.length > 30) {
        return callback(new Error("長度需在 30 字以內"));
      }
      // 校驗內容是否符合規範（允許擴展字符集）
      const titleRule = /^[\u4e00-\u9fa5a-zA-Z0-9，。！？、；：“”‘’（）《》【】[\]{}|+\-/*<>@#$%^&=.~(),?!:;"'\s]{1,30}$/;
      if (titleRule.test(value)) {
        this.$refs.ruleForm.validateField("checkPass");
        return callback();
      } else {
        return callback(
          new Error("只能包含中文、英文、數字及常見符號")
        );
      }
    };
    // 商品介紹的校驗方法
    let validateIntro = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("請輸入商品介紹"));
      }
      // 商品介紹長度在200字之間
      if (value.length > 200) {
        return callback(new Error("長度需在 200 字以內"));
      }
      // 校驗內容是否符合規範（允許擴展字符集）
      const introRule = /^[\u4e00-\u9fa5a-zA-Z0-9，。！？、；：“”‘’（）《》【】[\]{}|+\-/*<>@#$%^&=.~(),?!:;"'\s]{1,30}$/;
      if (introRule.test(value)) {
        this.$refs.ruleForm.validateField("checkPass");
        return callback();
      } else {
        return callback(
          new Error("只能包含中文、英文、數字及常見符號")
        );
      }
    };
    // 商品價格的校驗方法
    let validatePrice = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("請輸入商品價格"));
      }
      // 價格需為正整數
      const priceRule = /^\d+$/;
      if (priceRule.test(value)) {
        this.$refs.ruleForm.validateField("checkPass");
        return callback();
      } else {
        return callback(
          new Error("價格需為正整數")
        );
      }
    };
    // 銷售價格的校驗方法
    let validateSellingPrice = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("請輸入銷售價格"));
      }
      // 銷售價格需為正整數
      const sellingPriceRule = /^\d+$/;
      if (sellingPriceRule.test(value)) {
        this.$refs.ruleForm.validateField("checkPass");
        return callback();
      } else {
        return callback(
          new Error("字母開頭,長度6-18之間,允許字母數字與底線")
        );
      }
    };
    // 商品庫存的校驗方法
    let validateNum = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("請輸入商品庫存"));
      }
      // 庫存需為非負整數
      const numRule = /^\d+$/;
      if (numRule.test(value)) {
        this.$refs.ruleForm.validateField("checkPass");
        return callback();
      } else {
        return callback(
          new Error("庫存需為非負整數")
        );
      }
    };
    return {
      isRegisterProduct: false,
      RegisterProduct: {
        product_name: "",
        product_title: "",
        product_intro: "",
        product_price: "",
        product_selling_price: "",
        product_num: ""
      },
      rules: {
        product_name: [{ validator: validateName, trigger: "blur" }],
        product_title: [{ validator: validateTitle, trigger: "blur" }],
        product_intro: [{ validator: validateIntro, trigger: "blur" }],
        product_price: [{ validator: validatePrice, trigger: "blur" }],
        product_selling_price: [{ validator: validateSellingPrice, trigger: "blur" }],
        product_num: [{ validator: validateNum, trigger: "blur" }]
      }
    };
  },
  watch: {
    registerProduct(val) {
      if (val) {
        this.isRegisterProduct = val;
      }
    },
    isRegisterProduct(val) {
      if (!val) {
        this.$refs["ruleForm"].resetFields();
        this.$emit("fromChild", val);
      }
    },
  },
  methods: {
    ProductRegister() {
      // 透過element自訂表單校驗規則，校驗使用者輸入的使用者資訊
      this.$refs["ruleForm"].validate(valid => {
        // 如果透過校驗開始註冊
        if (valid) {
          this.$axios
            .post("/api/product/addNewProduct", {
              product_name: this.RegisterProduct.product_name,
              product_title: this.RegisterProduct.product_title,
              product_intro: this.RegisterProduct.product_intro,
              product_price: this.RegisterProduct.product_price,
              product_selling_price: this.RegisterProduct.product_selling_price,
              product_num: this.RegisterProduct.product_num,
            })
            .then(res => {
              // “001”代表註冊成功，其他的均為失敗
              if (res.data.code === "001") {
                // 隱藏註冊組件
                this.isRegisterProduct = false;
                // 彈出通知框提示註冊成功訊息
                this.notifySucceed(res.data.msg);
              } else {
                // 彈出通知框提示註冊失敗訊息
                this.notifyError(res.data.msg);
              }
            })
            .catch(err => {
              return Promise.reject(err);
            });
        } else {
          return false;
        }
      });
    }
  },
};
</script>
<style>
</style>