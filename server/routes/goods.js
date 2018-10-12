var express = require ('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
var Users = require('../models/users');
// 连接MongoDB数据库,27017是端口号，后面的是数据库的名字
mongoose.connect('mongodb://127.0.0.1:27017/shopping');
// 监听数据库是否连接成功
mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});
// 连接断开
mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});
// 查询商品列表数据
router.get("/list", function(req, res, next) {
  // req.param 能接收到前段传来的数据
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let sort = req.param("sort");
  let priceMax = parseInt(req.param("priceMax"));
  let priceMin = parseInt(req.param("priceMin"));
  let skip = (page-1)*pageSize;
  let params = {};
  console.log('priceMin', priceMax, priceMin, priceMax && priceMin);
  if ( priceMin !== undefined && priceMax) {
    params = {
      salePrice:{
        $gt: priceMin,
        $lte: priceMax
      }
    }
  }
  // 文档查询中，常用的查询条件如下
    // $or　　　　或关系
    // $nor　　　 或关系取反
    // $gt　　　　大于
    // $gte　　　 大于等于
    // $lt　　　　小于
    // $lte　　　 小于等于
    // $ne　　　　不等于
    // $in　　　　在多个值范围内
    // $nin　　　 不在多个值范围内
    // $all　　　 匹配数组中多个值
    // $regex　　 正则，用于模糊查询
    // $size　　　匹配数组大小
    // $maxDistance　范围查询，距离（基于LBS）
    // $mod　　　　取模运算
    // $near　　　 邻域查询，查询附近的位置（基于LBS）
    // $exists　　 字段是否存在
    // $elemMatch　匹配内数组内的元素
    // $within　　　范围查询（基于LBS）
    // $box　　　　 范围查询，矩形范围（基于LBS）
    // $center　　　范围醒询，圆形范围（基于LBS）
    // $centerSphere　范围查询，球形范围（基于LBS）
    // $slice　　　　查询字段集合中的元素（比如从第几个之后，第N到第M个元素

  // .find是模型封装的，skip 跳过ship条数据，limit， 获取limit个数据，实现分页加载
  // find（查询条件，返回的字段，配置查询参数，回调函数）。
  // 回调函数，第一个参数是err，第二个参数是返回值。
  console.log('params', params);
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  // 按salePrice价格查询，sort为-1，倒序。
  goodsModel.sort({'salePrice': sort});
  goodsModel.exec(function(err,doc) {
    // doc是查询出来的列表
    if (err) {
      // .json 输出一个json
      res.json({
        status: '1',
        mag: err.message
      });
    } else {
      res.json({
        status: '0',
        mag: '',
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  })
})
//加入到购物车，提交数据用post
// 一级路由是/goods，二级路由已经默认在这个路由下面了，所以不需要在前面写/goods
router.post("/addCart", function (req,res,next) {
  // post 获取参数，要用.body
  var userId = req.cookies.userId,
  productId = req.body.productId;
  Users.findOne({userId: userId}, function(err, userDoc) {
    if(err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      if (userDoc) {
        var goodsItem = '';
        userDoc.cartList.forEach(function (item) {
          if (item.productId === productId) {
            goodsItem = item;
            item.productNum ++;
            userDoc.save(function (err2, doc2) {
              if (err2) {
                res.json({
                  status: "1",
                  msg: err2.message
                })
              } else {
                res.json({
                  status: "0",
                  msg: "",
                  result: 'success'
                })
              }
            })
          }
        });
        if (!goodsItem) {
          Goods.findOne({productId: productId}, function(err1, doc) {
            console.log(err1, doc);
            if(err1){
                res.json({
                  status:"1",
                  msg:err1.message
                })
              }else{
                if (doc) {
                  doc.productNum = 1;
                  doc.checked = 1;
                  userDoc.update({$push:{'cartList': doc}}, function(err, doc) {
                    if (err) {
                      res.json({
                        status:'1',
                        msg: err.message,
                        result: ''
                      })
                    } else {
                      res.json({
                        status: '0',
                        msg: '',
                        result: 'push-success'
                      });
                    }
                  })
                }
              }
          })
        }
      }
    }
  })
})
module.exports = router;
