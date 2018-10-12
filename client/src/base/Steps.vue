<template>
  <div>
    <ul class="steps">
      <li v-for="(item, index) in steps" :key="item" class="step" :class="stepLine(index)">
        <i class="step__icon--circle" :class="stepIcon"></i>
        <span class="step__title">{{item}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    active: {
      type: Number,
      default: 1
    },
    steps: {
      type: Array,
      default: () => {
        return ['拍下商品', '付款到支付宝', '完成订单', '确认收货']
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    stepLine(index) {
      this.stepIcon = 'step__icon--normal'
      if (index <= this.active) {
        this.stepIcon = 'step__icon--active'
        return 'step__active'
      } else {
        return 'step__line'
      }
    }
  }
}
</script>
<style>
  .steps {
    display: flex;
  }
  .step {
    width: 25%;
    position: relative;
    text-align: center;
    padding-bottom: 10px;
    color: #999;
  }
  .step__title {
    height: 30px;
    line-height: 30px;
  }
  .step__icon--circle {
    width: 14px;
    height: 14px;
    background-color: #999;
    border-radius: 50%;
    position: absolute;
    right: 50%;
    top: 33px;
  }
  .step__icon--active {
    background-color: red;
  }
  .step__line {
    border-bottom: 1px solid #999;
  }
  .step__active {
    border-bottom: 1px solid red;
  }
</style>
