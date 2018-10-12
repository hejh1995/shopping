<template>
  <div class="loading">
    <img width="24" src="static/loading-svg/loading-bars.svg"/>
    <p class="loading-text">{{title}}</p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '加载中......'
    }
  }
}
</script>
<style scoped>
.loading {
  width: 100%;
  text-align: center;
}
.loading-text {
  height: 20px;
  line-height: 20px;
}
</style>
