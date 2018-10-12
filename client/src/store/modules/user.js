// import { getToken, setToken, removeToken } from '@/utils/auth'
const user = {
  state: {
    nickName: '',
    cartCount: 0,
    navbar: 'goods'
  },
  mutations: {
    SET_NICKNAME: (state, nickName) => {
      state.nickName = nickName
    },
    SET_CARTCOUNT: (state, cartCount) => {
      state.cartCount += parseInt(cartCount)
    },
    SET_NAVBAR: (state, data) => {
      state.navbar = data
    }
  }
}

export default user
