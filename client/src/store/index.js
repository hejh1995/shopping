import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  getters,
  strict: debug,
  // 严格模式，会检测修改是不是来源于mutations。
  plugins: debug ? [createLogger()] : [],
  modules: {
    user
  }
})
export default store
