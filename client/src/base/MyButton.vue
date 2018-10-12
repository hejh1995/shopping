<template>
  <button class="button"
  @click="handleClick"
  :disabled="disabled"
  :class="[
  type ? 'button--' + type : '',
  size ? 'button--' + size : '',
  circle ? 'button--circle' : ''
  ]"
  >
    <span><slot></slot></span>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick (event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style scoped>
.button--circle {
  border-radius: 50%;
}
.button {
  display: inline-block;
  padding: 12px 20px;
  border: 1px  solid #dcdfd6;
  text-align: center;
  border-radius: 4px;
  background-color: #fff;
  outline: none;
}
.button:focus {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.button--danger {
  background-color: #fef0f0;
  border-color: #fbc4c4;
  color: #f56c6c;
}
.button--success {
  background-color: #67c231;
  border-color: #67c231;
  color: #fff;
}
.button--primary {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}
.button--text {
  border: none;
}
.button--large {
  padding: 12px 25px;
  font-size: 15px;
  border-radius: 5px;
  width: 80%;
}
.button--medium {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.button--small {
  padding: 9px 15px;
  font-size: 12px;
  border-radius: 3px;
}
</style>
