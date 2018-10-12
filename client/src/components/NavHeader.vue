<template>
<div class="header">
  <div class="header--right">
    <span class="navbar-link" v-if="nikeName">{{nikeName}}</span>
    <i class="navbar-link" v-if="nikeName" @click="showLogoutBox">Logout</i>
    <i class="navbar-link" v-if="!nikeName" @click="showLoginBox">Login</i>
    <a href="/#/cart"><i class="fa-shopping-cart fa-2x"></i></a>
    <span class="cartCount" v-if="nikeName && cartCount">{{cartCount}}</span>
  </div>
  <bread-crumb class="breadcrumb" :navbars="navbars" :activeIndex="activeIndex"></bread-crumb>
  <DialogBox ref="loginDialogBox" confirmText="登录" title="登录" @confirm="confirmLogin">
    <div slot="header" class="login__header">
      <span class="login__header--text">登录</span>
    </div>
    <div class="login__body">
      <div class="login__body--message">
        <i class="fa-user-o"></i>
        <input class="login__body--input" v-model="userName">
      </div>
      <div class="login__body--message">
        <i class="fa-lock"></i>
        <input class="login__body--input" v-model="userPassword">
      </div>
    </div>
  </DialogBox>
  <DialogBox ref="logoutDialogBox" @confirm="confirmLogout">
    <p>您确定要退出登录吗？</p>
  </DialogBox>
</div>
</template>
<script>
import BreadCrumb from '@/base/Breadcrumb'
import DialogBox from '@/base/DialogBox'
import { cofLogin, getCartCount, checkLogin, logout } from '@/api/users.js'
import { mapMutations, mapGetters } from 'vuex'
export default {
  components: {
    BreadCrumb,
    DialogBox
  },
  data () {
    return {
      activeIndex: 1,
      userPassword: '123456',
      userName: 'admin'
    }
  },
  mounted() {
    this.checkLogin()
  },
  computed: {
    ...mapGetters(['cartCount', 'nikeName', 'navbar']),
    navbars() {
      return ['home', this.navbar]
    }
  },
  methods: {
    ...mapMutations({
      setName: 'SET_NICKNAME',
      setCartCount: 'SET_CARTCOUNT'
    }),
    checkLogin() {
      checkLogin().then(res => {
        console.log(res.data)
        if (res.status === '0') {
          this.setName(res.result)
          getCartCount().then(res => {
            this.setCartCount(res.result)
          })
        } else {
          if (this.$route.path !== '/goods') {
            this.$router.push({
              path: '/goods'
            })
          }
        }
      })
    },
    showLoginBox() {
      this.$refs.loginDialogBox.show()
    },
    confirmLogin() {
      console.log(this.userName, this.userPassword)
      cofLogin({
        userName: this.userName,
        userPwd: this.userPassword
      }).then(res => {
        if (res.status === '0') {
          this.$refs.loginDialogBox.hide()
          this.setName(res.result.userName)
          getCartCount().then(res => {
            this.setCartCount(res.result)
          })
        } else {
        }
      })
    },
    showLogoutBox() {
      this.$refs.logoutDialogBox.show()
    },
    confirmLogout() {
      logout().then(res => {
        this.setName(res.result)
        this.$refs.logoutDialogBox.hide()
      })
    }
  }
}
</script>
<style scoped>
.fa-user-o, .fa-lock {
  font-size: 25px;
  margin: 6px 0 0 14px;
  height: 25px;
  width: 35px;
}
.login__body--input {
  position: absolute;
  left: 50px;
  height: 23px;
  line-height: 23px;
  padding: 9px 0 10px;
  border: none;
  width: 400px;
  outline: none;
}
.login__body--message {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 42px;
  line-height: 42px;
  font-size: 14px;
  width: 450px;
  margin: 0 auto 15px auto;
}
.login__header {
  text-align: center;
}
.login__header--text {
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 20px;
}
.header--right {
  float:right;
  margin:  10px 20px;
}
.breadcrumb {
  clear: both;
}
.header {
  overflow: hidden;
  background-color: #fff;
}
.cartCount {
  position: absolute;
  width: 20px;
  height: 20px;
  line-height: 20px;
  right: 11px;
  top: 9px;
  border-radius: 50%;
  background-color: #eb767d;
  color: #fff;
  font-weight: bold;
  text-align: center;
  display: inline-block;
}
.navbar-link {
  margin-right: 10px;
}
</style>
