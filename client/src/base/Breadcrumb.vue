<template>
<div class="breadcrumb">
  <ul class="breadcrumb-ul">
    <li class="breadcrumb-item" v-for="(item, index) in navbars" :key="index">
      <span class="breadcrumb-item--text" :class="{active: index===activeIndex}" @click="toRouter(item)">{{item}}</span>
      <span v-if="index !== navbars.length-1">/</span>
    </li>
  </ul>
</div>
</template>
<script>
export default {
  props: {
    navbars: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      trye: Number,
      default: 1
    }
  },
  methods: {
    toRouter (item) {
      console.log(item)
      // this.router.push({
      //   path: `/${item}`
      // })
    }
  }
}
</script>
<style scoped>
.breadcrumb {
  background-color: #f0f0f0;
  height: 45px;
  line-height: 45px;
  color: #a1a1a1;
}
.breadcrumb-ul {
  display: flex;
}
.breadcrumb-item--text {
  margin-left: 10px;
}
.active {
  color: #d1434a;
}
</style>
