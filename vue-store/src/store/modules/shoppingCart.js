/*
 * @Description: 購物車狀態模組
 */
export default {
  state: {
    shoppingCart: []
    // shoppingCart結構
    /* 
    shoppingCart = {
      id: "", // 購物車id
      productID: "", // 商品id
      productName: "", // 商品名稱
      productImg: "", // 商品圖片
      price: "", // 商品價格
      num: "", // 商品數量
      maxNum: "", // 商品限購數量
      check: false // 是否勾選
    } */
  },
  getters: {
    getShoppingCart (state) {
      // 取得購物車狀態
      return state.shoppingCart;
    },
    getNum (state) {
      // 購物車商品總數量
      let totalNum = 0;
      for (let i = 0; i < state.shoppingCart.length; i++) {
        const temp = state.shoppingCart[i];
        totalNum += temp.num;
      }
      return totalNum;
    },
    getIsAllCheck (state) {
      // 判斷是否全選
      let isAllCheck = true;
      for (let i = 0; i < state.shoppingCart.length; i++) {
        const temp = state.shoppingCart[i];
        // 只要有一個商品沒有勾選立即return false;
        if (!temp.check) {
          isAllCheck = false;
          return isAllCheck;
        }
      }
      return isAllCheck;
    },
    getCheckGoods (state) {
      // 取得勾選的商品訊息
      // 用於確認訂單頁面
      let checkGoods = [];
      for (let i = 0; i < state.shoppingCart.length; i++) {
        const temp = state.shoppingCart[i];
        if (temp.check) {
          checkGoods.push(temp);
        }
      }
      return checkGoods;
    },
    getCheckNum (state) {
      // 取得購物車勾選的商品數量
      let totalNum = 0;
      for (let i = 0; i < state.shoppingCart.length; i++) {
        const temp = state.shoppingCart[i];
        if (temp.check) {
          totalNum += temp.num;
        }
      }
      return totalNum;
    },
    getTotalPrice (state) {
      // 購物車勾選的商品總價格
      let totalPrice = 0;
      for (let i = 0; i < state.shoppingCart.length; i++) {
        const temp = state.shoppingCart[i];
        if (temp.check) {
          totalPrice += temp.price * temp.num;
        }
      }
      return totalPrice;
    }
  },
  mutations: {
    setShoppingCart (state, data) {
      // 設定購物車狀態
      state.shoppingCart = data;
    },
    unshiftShoppingCart (state, data) {
      // 新增購物車
      // 用於在商品詳情頁點擊新增購物車,後台新增成功後，更新vuex狀態
      state.shoppingCart.unshift(data);
    },
    updateShoppingCart (state, payload) {
      //  更新購物車
      //  可更新商品數量及是否勾選
      //  用於購物車點擊勾選及加減商品數量
      if (payload.prop == "num") {
        // 判斷效果的商品數量是否大於限購數量或小於1
        if (state.shoppingCart[payload.key].maxNum < payload.val) {
          return;
        }
        if (payload.val < 1) {
          return;
        }
      }
      // 根據商品在購物車的陣列的索引和屬性更改
      state.shoppingCart[payload.key][payload.prop] = payload.val;
    },
    addShoppingCartNum (state, productID) {
      // 增加購物車商品數量
      // 用於在商品詳情頁點擊添加購物車,後台返回002，“該商品已在購物車，數量 +1”，更新vuex的商品數量
      for (let i = 0; i < state.shoppingCart.length; i++) {
        const temp = state.shoppingCart[i];
        if (temp.productID == productID) {
          if (temp.num < temp.maxNum) {
            temp.num++;
          }
        }
      }
    },
    deleteShoppingCart (state, id) {
      // 根據購物車id刪除購物車商品
      for (let i = 0; i < state.shoppingCart.length; i++) {
        const temp = state.shoppingCart[i];
        if (temp.id == id) {
          state.shoppingCart.splice(i, 1);
        }
      }
    },
    checkAll (state, data) {
      // 點選全選按鈕，更改每個商品的勾選狀態
      for (let i = 0; i < state.shoppingCart.length; i++) {
        state.shoppingCart[i].check = data;
      }
    }
  },
  actions: {
    setShoppingCart ({ commit }, data) {
      commit('setShoppingCart', data);
    },
    unshiftShoppingCart ({ commit }, data) {
      commit('unshiftShoppingCart', data);
    },
    updateShoppingCart ({ commit }, payload) {
      commit('updateShoppingCart', payload);
    },
    addShoppingCartNum ({ commit }, productID) {
      commit('addShoppingCartNum', productID);
    },
    deleteShoppingCart ({ commit }, id) {
      commit('deleteShoppingCart', id);
    },
    checkAll ({ commit }, data) {
      commit('checkAll', data);
    }
  }
}