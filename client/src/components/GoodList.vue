<template>
  <div class="goodlist">
    <div class="narve">
      <my-button type="text">综合排名</my-button>
      <my-button type="text" @click="sortGoods">{{sortFlag ? '价格从高到低' : '价格从低到高'}}</my-button>
      <div>
        <input class="input-price" placeholder="￥" v-model="priceMin">
        <span>-</span>
        <input class="input-price" placeholder="￥" v-model="priceMax" @change="inputMax">
      </div>
    </div>
    <div class="container">
      <ul class="goods-list">
        <li class="goods-item" v-for="item in goodlist" :key="item.prodctId">
          <img class="goods-img" :src="`static/${item.productImage}`" :key="item.productImage">
          <span class="goods-name">{{item.productName}}</span>
          <span class="goods-price">{{item.salePrice | currency('￥')}}</span>
          <div class="goods-add">
            <my-button size="large" type="danger" @click="addGoods(item)">加入购物车</my-button>
          </div>
        </li>
      </ul>
      <div class="load-more"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="20">
        <loading v-show="loading"></loading>
      </div>
    </div>
    <dialog-box ref="confirmAdd" @confirm="confirmAddCart()">确定加入购物车？</dialog-box>
  </div>
</template>

<script>
import MyButton from '@/base/MyButton'
import { getGoodsList, addCart } from '@/api/goods'
import { currency } from '@/utils/currency'
import Loading from '@/base/Loading'
import DialogBox from '@/base/DialogBox'
import { mapMutations } from 'vuex'

export default {
  components: {
    MyButton,
    Loading,
    DialogBox
  },
  filters: {
    currency: currency
  },
  data() {
    return {
      page: 1,
      pageSize: 8,
      sortFlag: true,
      priceMax: undefined,
      priceMin: undefined,
      goodlist: [],
      busy: true,
      loading: false
    }
  },
  mounted() {
    this.__getGoodsList()
    this.setNavbar('goods')
  },
  methods: {
    ...mapMutations({
      setCartCount: 'SET_CARTCOUNT',
      setNavbar: 'SET_NAVBAR'
    }),
    __getGoodsList(flag) {
      this.loading = true
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceMax: this.priceMax,
        priceMin: this.priceMin
        // busy为true表示没有可以加载的数据了
      }
      getGoodsList(param).then(res => {
        this.loading = false
        if (res.status === '0') {
          this.goodlist = flag ? this.goodlist.concat(res.result.list) : res.result.list
          this.busy = (res.result.count === 0)
        } else {
          this.goodlist = []
        }
      })
    },
    sortGoods() {
      this.sortFlag = !this.sortFlag
      this.page = 1
      this.__getGoodsList()
    },
    loadMore() {
      this.busy = true
      setTimeout(() => {
        this.page++
        this.__getGoodsList(true)
      }, 500)
    },
    inputMax() {
      this.priceMin = this.priceMin ? this.priceMin : 0
      this.page = 1
      console.log('1111111', this.priceMax, this.priceMin)
      this.__getGoodsList()
    },
    addGoods(item) {
      this.addProductId = item.productId
      console.log(item, this.addProductNUm, this.addProductId)
      this.$refs.confirmAdd.show()
    },
    confirmAddCart() {
      addCart({
        productId: this.addProductId
      }).then(res => {
        this.$refs.confirmAdd.hide()
        this.setCartCount(1)
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>
.goodlist {
  width: 80%;
  margin: 0 auto;
}
.narve {
  background-color: #fff;
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}
.input-price {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: 43px;
  width: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 15px;
}
.container {
  margin: 0 auto;
}
.goods-img {
  width: 100%;
}
.goods-item {
  box-sizing: border-box;
  width: 23.875%;
  margin-right: 1.5%;
  margin-bottom: 1.5%;
  float: left;
  border: 2px solid #e9e9e9;
  background-color: #fff;
  position: relative;
}
.goods-item:nth-child(4n) {
  margin-right: 0;
}
.goods-item:hover {
  border-color: #ee7a23;
  transform: translateY(-5px);
  box-shadow: 0 0 10px #999;
  transition: all .5s ease-out;
}
.goods-list {
  position: relative;
}
.goods-list:after {
  display: block;
  content: " ";
  clear: both;
  visibility: hidden;
}
.goods-add {
  text-align: center;
  margin: 10px;
}
.goods-name {
  padding: 10px;
}
.goods-price {
  position: absolute;
  right: 20px;
  bottom: 70px;
}
.loadMoreHide {
  height: 120px;
  top: 0;
  padding-top: 40px;
  margin-top: 40px;
}
.loadMoreNormal {
  height: 0;
}
</style>
