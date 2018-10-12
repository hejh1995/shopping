var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  // 订单列表
  "orderList":Array,
  // 加入购物车的列表
  "cartList":[
    {
      "productId":String,
      "productName":String,
      "salePrice":String,
      "productImage":String,
      "checked":String,
      "productNum":String
    }
  ],
  // 下单地址
  "addressList":[
    {
      "addressId": String,
      "userName": String,
      "streetName": String,
      "postCode": Number,
      "tel": Number,
      "isDefault": Boolean
    }
  ]
});
// 导出数据，models必须带s，如果不带，就必须指定router的名字。带了就是自动匹配routers里面的不带s的对应的文件。
module.exports = mongoose.model("User",userSchema);
