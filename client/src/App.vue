<template>
  <div id="app">
    <nav-header></nav-header>
    <router-view/>
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
export default {
  name: 'App',
  components: {
    NavHeader
  }
}
</script>
