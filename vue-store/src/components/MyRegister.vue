<!--
 * @Description: 使用者註冊組件
  -->
<template>
  <div id="register">
    <el-dialog title="註冊" width="300px" center :visible.sync="isRegister">
      <el-form
        :model="RegisterUser"
        :rules="rules"
        status-icon
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="name">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="請輸入帳號"
            v-model="RegisterUser.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="請輸入密碼"
            v-model="RegisterUser.pass"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="請再次輸入密碼"
            v-model="RegisterUser.confirmPass"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="Register" style="width:100%;">註冊</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "MyRegister",
  props: ["register"],
  data() {
    // 使用者名稱的校驗方法
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("請輸入使用者名稱"));
      }
      // 使用者名稱以字母開頭,長度在5-16之間,允許字母數字下劃線
      const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
      if (userNameRule.test(value)) {
        // 判斷資料庫中是否已經存在該使用者名
        this.$axios
          .post("/api/users/findUserByName", {
            userName: this.RegisterUser.name
          })
          .then(res => {
            // “001”代表使用者名稱不存在，可註冊
            if (res.data.code == "001") {
              this.$refs.ruleForm.validateField("checkPass");
              return callback();
            } else {
              return callback(new Error(res.data.msg));
            }
          })
          .catch(err => {
            return Promise.reject(err);
          });
      } else {
        return callback(new Error("字母開頭,長度5-16之間,允許字母數字底線"));
      }
    };
    // 密碼的校驗方法
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("請輸入密碼"));
      }
      // 密碼以字母開頭,長度在6-18之間,允許字母數字與底線
      const passwordRule = /^[a-zA-Z]\w{5,17}$/;
      if (passwordRule.test(value)) {
        this.$refs.ruleForm.validateField("checkPass");
        return callback();
      } else {
        return callback(
          new Error("字母開頭,長度6-18之間,允許字母數字與底線")
        );
      }
    };
    // 確認密碼的校驗方法
    let validateConfirmPass = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("請輸入確認密碼"));
      }
      // 校驗是否與密碼一致
      if (this.RegisterUser.pass != "" && value === this.RegisterUser.pass) {
        this.$refs.ruleForm.validateField("checkPass");
        return callback();
      } else {
        return callback(new Error("兩次輸入的密碼不一致"));
      }
    };
    return {
      isRegister: false, // 控制註冊組件是否顯示
      RegisterUser: {
        name: "",
        pass: "",
        confirmPass: ""
      },
      // 使用者資訊校驗規則,validator(校驗方法),trigger(觸發方式),blur為在元件 Input 失去焦點時觸發
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        confirmPass: [{ validator: validateConfirmPass, trigger: "blur" }]
      }
    };
  },
  watch: {
    // 監聽父元件傳過來的register變量，設定this.isRegister的值
    register: function(val) {
      if (val) {
        this.isRegister = val;
      }
    },
    // 監聽this.isRegister變數的值，更新父元件register變數的值
    isRegister: function(val) {
      if (!val) {
        this.$refs["ruleForm"].resetFields();
        this.$emit("fromChild", val);
      }
    }
  },
  methods: {
    Register() {
      // 透過element自訂表單校驗規則，校驗使用者輸入的使用者資訊
      this.$refs["ruleForm"].validate(valid => {
        // 如果透過校驗開始註冊
        if (valid) {
          this.$axios
            .post("/api/users/register", {
              userName: this.RegisterUser.name,
              password: this.RegisterUser.pass
            })
            .then(res => {
              // “001”代表註冊成功，其他的均為失敗
              if (res.data.code === "001") {
                // 隱藏註冊組件
                this.isRegister = false;
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
  }
};
</script>
<style>
</style>