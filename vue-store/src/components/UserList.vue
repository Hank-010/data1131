<!--
 * @Description: 列表元件，用於管理使用者列表
  -->
<template>
  <div id="userList" class="userList">
    <ul>
      <li v-for="item in list" :key="item.user_id">
        <!-- <el-popover v-show="item.userLevel === 1" placement="top"> -->
        <el-popover v-if="item.userLevel !== 3" placement="top">
          <p>確定刪除嗎？</p>
          <div style="text-align: right; margin: 10px 0 0">
            <el-button type="primary" size="mini" @click="deleteUser(item.user_id)">確定</el-button>
          </div>
          <i class="el-icon-close delete" slot="reference" v-show="isDelete"></i>
        </el-popover>
        <!-- <router-link :to="{ path: '/goods/details', query: {productID:item.user_id} }"> -->
        <router-link :to="{ path: '/userManagement' }">
          <img :src="`${$target}public/imgs/user/user${item.userLevel}.jpg`" alt />
          <h2>{{ getRoleName(item.userLevel) }}</h2>
          <h3>{{item.userName}}</h3>
          <h4>密碼：{{item.password}}</h4>
          <h4>日期：{{ formatDate(item.registerTime) }}</h4>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "UserList",
  // list為父元件傳過來的使用者列表
  props: ["list", "isDelete"],
  data() {
    return {};
  },
  methods: {
    // 根據 userLevel 返回對應角色名稱
    getRoleName(userLevel) {
      const roles = ['訪客', '顧客', '賣家', '管理員'];
      return roles[userLevel] || '未知角色';
    },
    formatDate(dateTime) {
      if (!dateTime) return '';
      const date = new Date(dateTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從0開始
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    // 刪除使用者
    deleteUser(user_id) {
      this.$axios
        .post("/api/user/userManagement/deleteUser", {
          user_id: user_id
        })
        .then(res => {
          switch (res.data.code) {
            case "001":// 删除成功
              // 刪除刪除列表中的使用者訊息
              for (let i = 0; i < this.list.length; i++) {
                const temp = this.list[i];
                if (temp.user_id == user_id) {
                  this.list.splice(i, 1);
                }
              }
              // 提示刪除成功訊息
              this.notifySucceed(res.data.msg);
              break;
            default:
              // 提示刪除失敗訊息
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
.userList ul li {
  z-index: 1;
  float: left;
  width: 234px;
  height: 300px;
  padding: 10px 0;
  margin: 0 0 14.5px 13.7px;
  background-color: white;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  position: relative;
}
.userList ul li:hover {
  z-index: 2;
  -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  -webkit-transform: translate3d(0, -2px, 0);
  transform: translate3d(0, -2px, 0);
}
.userList ul li img {
  display: block;
  width: 160px;
  height: 130px;
  background: url(../assets/imgs/placeholder.png) no-repeat 50%;
  margin: 0 auto;
}
.userList ul li h2 {
  margin: 5px 10px;
  /* height: 25px; */
  font-size: 34px;
  font-weight: 400;
  color: #0f0070;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.userList ul li h3 {
  margin: 20px 10px 0;
  font-size: 30px;
  font-weight: 400;
  color: #333;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.userList ul li h4 {
  margin: 5px 10px;
  height: 25px;
  font-size: 18px;
  font-weight: 400;
  color: #7e7e7e;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
/* .userList ul li p {
  margin: 10px 10px 10px;
  text-align: center;
  color: #ff6700;
} */
/* .userList ul li p .del {
  margin-left: 0.5em;
  color: #b0b0b0;
  text-decoration: line-through;
} */
.userList #more {
  text-align: center;
  line-height: 280px;
}
.userList #more a {
  font-size: 18px;
  color: #333;
}
.userList #more a:hover {
  color: #ff6700;
}
.userList ul li .delete {
  position: absolute;
  top: 10px;
  right: 10px;
  display: none;
}
.userList ul li:hover .delete {
  display: block
}
.userList ul li .delete:hover {
  color: #ff6700;
}
</style>