<template>
  <div class="order__wrapper">
    <div class="order__steps">
      <steps :active="stepActive"></steps>
    </div>
    <keep-alive>
      <component :is="currentComponent" @confirmOrder="confirmOrder" :orderInfo="orderInfo"></component>
    </keep-alive>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import Steps from '@/base/Steps'
import OrderConfirm from '@/components/OrderConfirm'
import OrderSuccess from '@/components/OrderSuccess'

export default {
  components: {
    Steps,
    OrderConfirm,
    OrderSuccess
  },
  data() {
    return {
      stepActive: 0,
      currentComponent: 'order-confirm',
      orderInfo: {}
    }
  },
  mounted() {
    this.setNavbar('order')
  },
  methods: {
    ...mapMutations({
      setNavbar: 'SET_NAVBAR'
    }),
    confirmOrder(orderInfo) {
      this.currentComponent = 'order-success'
      console.log(orderInfo)
      this.orderInfo = orderInfo
      this.stepActive = 2
    }
  }
}
</script>
<style scoped>
  .order__wrapper {
    width: 90%;
    margin: 0 auto;
  }
  .order__steps {
    margin: 20px 0;
  }
</style>
