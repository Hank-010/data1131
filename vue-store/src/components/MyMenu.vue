<!--
 * @Description: 選單組件，用於首頁商品展示模組的右上角選單
  -->
<template>
  <div class="myMenu" id="myMenu">
    <ul>
      <li
        v-for="item in val"
        :key="item"
        :class="activeClass == item ? 'active':''"
        @mouseover="mouseover($event,item)"
      >
        <router-link to>
          <slot :name="item"></slot>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ["val"],
  name: "MyMenu",
  data() {
    return {
      activeClass: 1
    };
  },
  methods: {
    // 透過mouseover事件控制目前顯示的商品分類，1為該類別的熱門商品
    mouseover(e, val) {
      this.activeClass = val;
    }
  },
  watch: {
    // 向父元件傳過去目前要顯示的商品分類，從而更新商品列表
    activeClass: function(val) {
      this.$emit("fromChild", val);
    }
  }
};
</script>
<style scoped>
#myMenu li {
  float: left;
  margin-left: 30px;
}

#myMenu a:hover {
  color: #ff6700;
  border-bottom: 2px solid #ff6700;
}

#myMenu .active a {
  color: #ff6700;
  border-bottom: 2px solid #ff6700;
}
</style>