import Vue from 'vue'
import Router from 'vue-router'
// import store from '@/store'
const Cart = () => import('@/components/Cart')
const GoodList = () => import('@/components/GoodList')
const Order = () => import('@/components/Order')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      name: 'goods',
      component: GoodList
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    },
    {
      path: '/order',
      name: 'order',
      component: Order
    }
  ]
})
