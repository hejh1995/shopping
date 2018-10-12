<template>
<div class="cart-wrapper">
  <div class="cart-container">
    <ul class="cart-header">
      <li class="cart-header__item" v-for="(item, index) in cartHeader" :key="item" :class="{'cart-header__flex' : (index!== 0 && index!== 4)}">{{item}}</li>
    </ul>
    <ul class="cart-body">
      <li class="cart-item" v-for="item in cartList" :key="item.productId">
        <div class="cart-item__1">
          <i :class="checkedIcon(item)" @click="editCart('chcked', item)"></i>
          <img class="product-image" v-lazy="'/static/' + item.productImage" :alt="item.productName">
          <span>{{item.productName}}</span>
        </div>
        <div class="cart-item__2">{{item.salePrice|currency('￥')}}</div>
        <div class="cart-item__3">
          <div class="input-number">
            <span class="input-sub" @click="editCart('reduce', item)">-</span>
            <span class="product-num">{{item.productNum}}</span>
            <span class="input-add" @click="editCart('add', item)">+</span>
          </div>
        </div>
        <div class="cart-item__4">{{(item.salePrice*item.productNum)|currency('￥')}}</div>
        <div class="cart-item__5">
          <i class="fa-trash-o" @click="deleteCart(item)"></i>
        </div>
      </li>
    </ul>
    <div class="cart-footer">
      <div class="footer__left">
        <i :class="checkedAll" @click="toggleCheckAll"></i>
        <span>选择所有商品</span>
      </div>
      <div class="footer__right">
        <div class="footer__price">
          <span>总价为：</span>
          <span class="footer__price--text">{{totalPrice | currency('￥')}}</span>
        </div>
        <my-button type="primary" @click="checkOut()">支付</my-button>
      </div>
    </div>
  </div>
  <dialog-box ref="confirmDelete" @confirm="confirmDeleteCart()">确定要删除该产品吗？</dialog-box>
  <dialog-box ref="mustSelect" @confirm="mustSelect()">请至少选择一种商品</dialog-box>
</div>
</template>
<script>
import MyButton from '@/base/MyButton'
import DialogBox from '@/base/DialogBox'
import { cartList, cartEdit, checkedAll, cartDel } from '@/api/users'
import { currency } from '@/utils/currency'
import { mapMutations } from 'vuex'
export default {
  components: {
    MyButton,
    DialogBox
  },
  data() {
    return {
      cartHeader: ['商品', '单价', '数量', '总价', '删除'],
      cartList: [],
      checkedAllFlag: false
    }
  },
  mounted() {
    this.__init()
    this.setNavbar('cart')
  },
  filters: {
    currency: currency
  },
  computed: {
    checkedAll() {
      return this.checkedAllFlag ? 'fa-check-circle-o' : 'fa-circle-o'
    },
    totalPrice() {
      let money = 0
      this.cartList.forEach(item => {
        if (item.checked === '1') money += item.productNum * item.salePrice
      })
      return money
    }
  },
  methods: {
    ...mapMutations({
      setCartCount: 'SET_CARTCOUNT',
      setNavbar: 'SET_NAVBAR'
    }),
    __init() {
      cartList().then(res => {
        this.cartList = res.result
        let i = 0
        this.cartList.forEach(item => {
          if (item.checked === '0') i++
        })
        if (i === 0) this.checkedAllFlag = true
      })
    },
    checkedIcon(item) {
      return item.checked === '1' ? 'fa-check-circle-o' : 'fa-circle-o'
    },
    toggleCheckAll() {
      this.checkedAllFlag = !this.checkedAllFlag
      this.cartList.forEach(item => {
        item.checked = this.checkedAllFlag ? '1' : '0'
      })
      checkedAll({
        checkAll: this.checkedAllFlag
      })
    },
    editCart(flag, item) {
      if (flag === 'add') item.productNum++
      else if (flag === 'reduce') {
        if (item.productNum <= 1) {
          return
        } else {
          item.productNum--
        }
      } else {
        item.checked = item.checked === '1' ? '0' : '1'
      }
      cartEdit({
        productId: item.productId,
        productNum: item.productNum,
        checked: item.checked
      }).then(res => {
        if (res.status === '0') {
          this.setCartCount(flag === 'add' ? '1' : '-1')
        }
      })
    },
    checkOut() {
      for (let index in this.cartList) {
        if (this.cartList[index].checked === '1') {
          this.$router.push({
            path: '/order'
          })
          return
        }
      }
      this.$refs.mustSelect.show()
    },
    mustSelect() {
      this.$refs.mustSelect.hide()
    },
    deleteCart(item) {
      console.log(item)
      this.deleteCartItemId = item.productId
      this.deleteCartItemNum = item.productNum
      this.$refs.confirmDelete.show()
    },
    confirmDeleteCart() {
      cartDel({
        productId: this.deleteCartItemId
      }).then(res => {
        if (res.status === '0') {
          let delCount = this.deleteCartItemNum
          this.$refs.confirmDelete.hide()
          this.setCartCount(-delCount)
          this.__init()
        }
      })
    }
  }
}
</script>
<style scoped>
  .cart-container {
    margin: 20px;
  }
  .cart-header{
    display: flex;
    background-color: #605F5F;
    color: #fff;
  }
  .cart-body {
    background-color: #fff;
  }
  .cart-header__item:first-child {
    width: 400px;
    border-left: 1px solid #e9e9e9;
    text-align: center;
  }
  .cart-header__item {
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .cart-header__item:last-child {
    border-right: 1px solid #e9e9e9;
    width: 100px;
  }
  .cart-header__flex {
    flex: 1;
  }
  .cart-item {
    display: flex;
    width: 100%;
    align-items: center;
    border-bottom: 1px solid #e9e9e9;
    text-align: center;
  }
  .cart-item__1 {
    display: flex;
    align-items: center;
    width: 400px;
    border-left: 1px solid #e9e9e9;
  }
  .cart-item__2, .cart-item__3, .cart-item__4 {
    flex: 1;
  }
  .cart-item__5 {
    border-right: 1px solid #e9e9e9;
    width: 100px;
  }
  .product-image {
    height: 75px;
    margin-left: 8px;
    margin: 20px;
  }
  .fa-circle-o, .fa-check-circle-o {
    font-size: 25px;
    margin: 20px;
  }
  .fa-check-circle-o {
    color: #f16c08;
  }
  .fa-trash-o {
    font-size: 25px;
  }
  .input-sub, .input-add {
    display: inline-block;
    width: 40px;
    font-size: 16px;
    background-color: #f0f0f0;
  }
  .product-num {
    width: 30px;
    display: inline-block;
  }
  .input-number {
    border: 1px solid #f0f0f0;
    display: inline-block;
    border-radius: 3px;
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
  .cart-footer {
    background-color: #fff;
    margin-top: 20px;
  }
  .footer__left {
    width: 200px;
    display: inline-block;
 }
  .footer__right {
    float: right;
    margin: 10px;
  }
  .footer__price {
    display: inline-block;
    margin-right: 20px;
  }
  .footer__price--text {
    color: #d1434a;
    font-weight: bold;
  }
</style>
