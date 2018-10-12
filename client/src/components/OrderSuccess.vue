<template>
  <div class="order__success">
    <div class="order__create">
      <div class="order__create--image">
        <img src="/static/ok-2.png" alt="" height="100%">
      </div>
      <div>
        <h3>祝贺您！<br>您的订单已经生成！</h3>
        <p class="order__info">
          <span>订单号： {{orderInfo.orderId}}</span>
          <span class="order__info--money">实付金额： {{orderInfo.orderTotal|currency('￥')}}</span>
        </p>
        <div>
          <router-link to="/cart" class="order__create--btnl"><my-button type="danger">返回购物车列表</my-button></router-link>
          <router-link to="/"><my-button type="danger">返回商品列表</my-button></router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { currency } from '@/utils/currency'
import MyButton from '@/base/MyButton'
export default {
  components: {
    MyButton
  },
  filters: {
    currency: currency
  },
  props: {
    orderInfo: {}
  }
}
</script>
<style>
  .order__create {
    padding: 80px 0 50px 0;
    text-align: center;
    font-size: 1.3em;
    line-height: 30px;
  }
  .order__create--image {
    height: 130px;
    margin: 0 auto;
    margin-bottom: 60px;
  }
  .order__info {
    margin-top: 20px;
    margin-bottom: 40px;
    color: #999;
  }
  .order__create--btnl {
    padding-right: 20px;
  }
  .order__info--money {
    padding-left: 20px;
  }
</style>
