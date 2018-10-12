<template>
<transition name="dialog-fade">
  <div class="dialog__wrapper" v-if="showFlag">
    <div class="dialog">
      <header class="dialog__header">
        <slot name="header"></slot>
      </header>
      <div class="dialog__body">
        <slot></slot>
      </div>
      <div class="dialog__footer">
        <my-button type="success" @click="confirm">{{confirmText}}</my-button>
        <my-button type="primary" class="cancel" @click="cancel">{{cancelText}}</my-button>
      </div>
    </div>
  </div>
</transition>
</template>
<script>
import MyButton from '@/base/MyButton'
export default {
  components: {
    MyButton
  },
  props: {
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.hide()
      this.$emit('cancel')
    }
  }
}
</script>
<style>
@keyframes dialog-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@keyframes dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}
.dialog-fade-enter-active {
  animation: dialog-fade-in .3s;
}
.dialog-fade-leave-active {
  animation: dialog-fade-out .3s;
}
.dialog__wrapper {
  position:fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 500;
}
.dialog {
  position: relative;
  width: 50%;
  margin: 100px auto;
  border-radius: 5px;
  background-color: #fff;
}
.dialog__header {
  padding: 20px;
  padding-bottom: 10px;
}
.dialog__body {
  padding: 30px 20px;
  color: #606266;
}
.dialog__footer{
  padding: 20px;
  padding-top: 10px;
  text-align: center;
}
.cancel {
  margin-left: 20px;
}
</style>
