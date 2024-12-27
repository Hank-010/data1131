/*
 * @Description: 路由配置
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [

  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../components/Error.vue')
  },
  {
    path: '/goods',
    name: 'Goods',
    component: () => import('../views/Goods.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/goods/details',
    name: 'Details',
    component: () => import('../views/Details.vue')
  },
  {
    path: '/shoppingCart',
    name: 'ShoppingCart',
    component: () => import('../views/ShoppingCart.vue'),
    meta: {
      requireAuth: true // 需要驗證登入狀態
    }
  },
  {
    path: '/collect',
    name: 'Collect',
    component: () => import('../views/Collect.vue'),
    meta: {
      requireAuth: true // 需要驗證登入狀態
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/Order.vue'),
    meta: {
      requireAuth: true // 需要驗證登入狀態
    }
  },
  {
    path: '/confirmOrder',
    name: 'ConfirmOrder',
    component: () => import('../views/ConfirmOrder.vue'),
    meta: {
      requireAuth: true // 需要驗證登入狀態
    }
  },
  {
    path: '/userManagement',
    name: 'UserManagement',
    component: () => import('../views/UserManagement.vue'),
    meta: {
      requireAuth: true // 需要驗證登入狀態
    }
  },
  {
    path: '/productManagement',
    name: 'ProductManagement',
    component: () => import('../views/ProductManagement.vue'),
    meta: {
      requireAuth: true // 需要驗證登入狀態
    }
  }
]

const router = new Router({
  // base: '/dist',
  // mode: 'history',
  routes
})

// 由於Vue-router在3.1之後把$router.push()方法改為了Promise。
// 所以假如沒有回呼函數，錯誤訊息就會交給全域的路由錯誤處理。
// vue-router先報了一個Uncaught(in promise)的錯誤(因為push沒加回調)，
// 然後再點選路由的時候才會觸發NavigationDuplicated的錯誤(路由出現的錯誤，全域錯誤處理印了出來)。
// 禁止全域路由錯誤處理列印
const originalPush = Router.prototype.push;
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export default router
