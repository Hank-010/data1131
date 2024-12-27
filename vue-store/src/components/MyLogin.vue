<!--
 * @Description: 登入組件
  -->
<template>
  <div id="myLogin">
    <el-dialog title="登入" width="300px" center :visible.sync="isLogin">
      <el-form :model="LoginUser" :rules="rules" status-icon ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="name">
          <el-input prefix-icon="el-icon-user-solid" placeholder="請輸入帳號" v-model="LoginUser.name"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="請輸入密碼"
            v-model="LoginUser.pass"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="Login" style="width:100%;">登入</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  name: "MyLogin",
  data() {
    // 使用者名稱的校驗方法
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("請輸入使用者名稱"));
      }
      // 使用者名稱以字母開頭,長度在5-16之間,允許字母數字底線
      const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
      if (userNameRule.test(value)) {
        this.$refs.ruleForm.validateField("checkPass");
        return callback();
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
    return {
      LoginUser: {
        name: "",
        pass: ""
      },
      // 使用者資訊校驗規則,validator(校驗方法),trigger(觸發方式),blur為在元件 Input 失去焦點時觸發
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  computed: {
    // 取得vuex中的showLogin，控制登入元件是否顯示
    isLogin: {
      get() {
        return this.$store.getters.getShowLogin;
      },
      set(val) {
        this.$refs["ruleForm"].resetFields();
        this.setShowLogin(val);
      }
    }
  },
  methods: {
    ...mapActions(["setUser", "setShowLogin"]),
    Login() {
      // 透過element自訂表單校驗規則，校驗使用者輸入的使用者資訊
      this.$refs["ruleForm"].validate(valid => {
        //如果透過校驗開始登入
        if (valid) {
          this.$axios
            .post("/api/users/login", {
              userName: this.LoginUser.name,
              password: this.LoginUser.pass
            })
            .then(res => {
              // “001”代表登入成功，其他的均為失敗
              if (res.data.code === "001") {
                // 隱藏登入組件
                this.isLogin = false;
                // 登入資訊存到本地
                let user = JSON.stringify(res.data.user);
                localStorage.setItem("user", user);
                // 登入資訊存到vuex
                this.setUser(res.data.user);
                // 彈出通知框提示登入成功訊息
                this.notifySucceed(res.data.msg);
              } else {
                // 清空輸入框的校驗狀態
                this.$refs["ruleForm"].resetFields();
                // 彈出通知框提示登入失敗訊息
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