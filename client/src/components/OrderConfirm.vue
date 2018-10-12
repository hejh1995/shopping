<template>
  <div class="order__confirm--wrapper">
    <div class="order__confirm--container">
      <h3>选择收获地址</h3>
      <ul class="address__items">
        <li v-for="item in addressListFilter" :key="item.productId" class="address__item" :class="{'address__item--active': checkedAddress === item.addressId}" @click="selectAddress(item.addressId)">
          <dl class="address__item--dl">
            <dt class="address__item--user">{{item.userName}}</dt>
            <dd class="address__item--stress">{{item.streetName}}</dd>
            <dd class="address__item--tel">{{item.tel}}</dd>
          </dl>
          <span class="address__item--default" v-if="!item.isDefault && checkedAddress === item.addressId" @click="setDefault(item.addressId)">Set default</span>
          <span v-if="item.isDefault" class="address__item--default">Default address</span>
          <i class="fa-trash-o" @click="deleteAddress(item)"></i>
        </li>
        <li class="address__item">
          <div class="address__item--add">
            <span class="address__item--addicon">+</span>
            <span>Add new address</span>
          </div>
        </li>
      </ul>
      <div class="address__more">
        <div class="address__more--container" @click="expandMore">
          <span>more</span>
          <i :class="expandIcon" class="address__more--icon"></i>
        </div>
      </div>
      <h3>确认订单信息</h3>
      <div class="order__confirm">
        <ul class="goodstable-header">
          <li class="goodstable-header__item" v-for="(item, index) in goodstableHeader" :key="item" :class="{'goodstable-header__flex' : (index!== 0 && index!== 3)}">{{item}}</li>
        </ul>
        <ul>
          <li v-for="item in cartList" v-if="item.checked == 1" :key="item.productId" class="cart-item">
            <div class="cart-item__1">
              <img class="product-image" v-lazy="'/static/' + item.productImage" :alt="item.productName">
              <span>{{item.productName}}</span>
            </div>
            <div class="cart-item__2">{{item.salePrice|currency('￥')}}</div>
            <div class="cart-item__3">
              <span class="product-num">{{item.productNum}}</span>
            </div>
            <div class="cart-item__4">{{(item.salePrice*item.productNum)|currency('￥')}}</div>
          </li>
        </ul>
        <div class="price__count--wrapper">
          <div class="price__count--item">
            <p class="price__count--left">商品总价：</p>
            <p class="price__count--right">{{subTotal|currency('￥')}}</p>
          </div>
          <div class="price__count--item">
            <p class="price__count--left">运费：</p>
            <p class="price__count--right">{{shipping|currency('￥')}}</p>
          </div>
          <div class="price__count--item">
            <p class="price__count--left">实付金额：</p>
            <p class="price__count--right price__order--total">{{orderTotal|currency('￥')}}</p>
          </div>
        </div>
        <my-button class="confirm__order" type="danger" @click="confirmOrder">提交订单</my-button>
      </div>
    </div>
    <dialog-box ref="confirmDelete" @confirm="confirmDeleteAddress()">确定要删除该地址吗？</dialog-box>
  </div>
</template>
<script>
import Steps from '@/base/Steps'
import MyButton from '@/base/MyButton'
import DialogBox from '@/base/DialogBox'
import { addressList, setDefault, cartList, payMent, delAddress } from '@/api/users'
import { currency } from '@/utils/currency'

export default {
  components: {
    Steps,
    MyButton,
    DialogBox
  },
  filters: {
    currency: currency
  },
  data() {
    return {
      addressList: [],
      cartList: [],
      checkedAddress: undefined,
      expand: false,
      limit: 3,
      goodstableHeader: ['商品', '单价', '数量', '总价'],
      subTotal: 0,
      shipping: 8,
      orderTotal: 0
    }
  },
  mounted() {
    this.__init()
  },
  computed: {
    expandIcon() {
      return this.expand ? 'fa-sort-asc' : 'fa-sort-desc'
    },
    addressListFilter() {
      return this.addressList.slice(0, this.limit)
    }
  },
  methods: {
    __init() {
      addressList().then(res => {
        this.addressList = res.result
        for (let i in this.addressList) {
          if (this.addressList[i].isDefault) {
            this.checkedAddress = this.addressList[i].addressId
            return
          }
        }
      })
      cartList().then(res => {
        if (res.status === '0') {
          this.cartList = res.result
          this.cartList.forEach(item => {
            if (item.checked === '1') this.subTotal += item.salePrice * item.productNum
          })
          this.orderTotal = this.subTotal + this.shipping
        }
      })
    },
    selectAddress(addressId) {
      this.checkedAddress = addressId
    },
    setDefault(itemId) {
      setDefault({
        addressId: itemId
      }).then(res => {
        this.__init()
      })
    },
    expandMore() {
      this.expand = !this.expand
      this.limit = this.expand ? this.addressList.length : 3
    },
    confirmOrder() {
      payMent({
        addressId: this.checkedAddress,
        orderTotal: this.orderTotal
      }).then(res => {
        if (res.status === '0') {
          this.$emit('confirmOrder', {
            orderId: res.result.orderId,
            orderTotal: res.result.orderTotal
          })
        }
      })
    },
    confirmDeleteAddress() {
      delAddress({ addressId: this.addressId }).then(res => {
        if (res.status === '0') {
          this.$refs.confirmDelete.hide()
          this.__init()
        }
      })
    },
    deleteAddress(address) {
      this.addressId = address.addressId
      this.$refs.confirmDelete.show()
    }
  }
}
</script>
<style scoped>
  .order__confirm--wrapper {
    width: 90%;
    margin: 0 auto;
  }
  .address__steps {
    margin: 20px 0;
  }
  .address__items {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
  }
  .address__item {
    width: 24%;
    box-sizing: border-box;
    padding: 20px;
    margin: 0 1% 20px 0;
    background-color: #fff;
    border: 2px solid #ccc;
  }
  .address__item:last-child {
    margin-right: 0;
  }
  .address__item--user {
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 25px 10px 0;
  }
  .address__item--stress {
    height: 50px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .address__item--tel {
    color: #605f5f;
    line-height: 1.3;
    margin-bottom: 15px;
  }
  .fa-trash-o {
    float: right;
    font-size: 20px;
  }
  .address__item--default {
    color: #ee7a23;
  }
  .address__item:hover {
    border-color:#ee7a23;
  }
  .address__item--active {
    border-color:#ee7a23;
  }
  .address__more {
    color: #ee7a23;
    text-align: center;
    margin-bottom: 20px;
  }
  .address__item--add {
    text-align: center;
  }
  .address__item--addicon {
    font-weight: 100;
    font-size: 100px;
    display: block;
  }
  .order__confirm {
    margin-top: 20px;
  }
  .goodstable-header {
    display: flex;
    background-color: #605F5F;
    color: #fff;
  }
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
  .cart-item {
    display: flex;
    width: 100%;
    align-items: center;
    border-bottom: 1px solid #e9e9e9;
    text-align: center;
    background-color: #fff;
  }
  .cart-item__1 {
    display: flex;
    align-items: center;
    width: 400px;
    border-left: 1px solid #e9e9e9;
  }
  .cart-item__2, .cart-item__3 {
    flex: 1;
  }
  .cart-item__4 {
    height: 115px;
    border-right: 1px solid #e9e9e9;
    width: 100px;
    line-height: 115px;
  }
  .product-image {
    height: 75px;
    margin-left: 8px;
    margin: 20px;
    border: 1px solid #ccc;
  }
  .price__count--wrapper {
    margin: 20px;
  }
  .price__count--item {
    display: flex;
    height: 30px;
    line-height: 30px;
  }
  .price__count--left {
    text-align: right;
    flex: 1;
  }
  .price__count--right {
    padding-left: 10px;
    flex: 0 1 80px;
  }
  .price__order--total {
    color: #d1434a;
  }
  .confirm__order {
    float: right;
    margin-right: 20px;
    margin-bottom: 20px;
  }
</style>
