/*
 * @Description: 全域變數
 */
exports.install = function (Vue) {
  // Vue.prototype.$target = "http://172.21.141.28:3000/"; // 線上後端位址
  Vue.prototype.$target = "http://localhost:3000/"; // 本地後端位址
  // 封裝提示成功的彈出框
  Vue.prototype.notifySucceed = function (msg) {
  this.$notify({
  title: "成功",
  message: msg,
  type: "success",
  offset: 100
  });
  };
  // 封裝提示失敗的彈出框
  Vue.prototype.notifyError = function (msg) {
  this.$notify.error({
  title: "錯誤",
  message: msg,
  offset: 100
  });
  };
  }