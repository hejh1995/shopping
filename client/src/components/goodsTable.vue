<template>
  <div>
    <ul class="goodstable-header">
      <li class="goodstable-header__item" v-for="(item, index) in cartHeader" :key="item" :class="{'goodstable-header__flex' : (index!== 0 && index!== 4)}">{{item}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cartHeader: ['商品', '单价', '数量', '总价', '删除'],
    }
  },
}
</script>
<style scoped>
.goodstable-header__item:first-child {
  width: 400px;
  border-left: 1px solid #e9e9e9;
  text-align: center;
}
.goodstable-header__item {
  border-top: 1px solid #e9e9e9;
  border-bottom: 1px solid #e9e9e9;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.goodstable-header__item:last-child {
  border-right: 1px solid #e9e9e9;
  width: 100px;
}
.goodstable-header__flex {
  flex: 1;
}
</style>
