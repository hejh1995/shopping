var express = require('express');
var router = express.Router();
var User = require('../models/users');
require('../util/util')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/cofLogin", function (req,res,next) {
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param, function (err,doc) {
      if(err){
          res.json({
              status:"1",
              msg:err.message
          });
      }else{
          if(doc){
            // cookie也要发送给前端
              res.cookie("userId",doc.userId,{
                  // 存储在根目录下
                  path:'/',
                  // 存储时间
                  maxAge:1000*60*60
              });
              res.cookie("userName",doc.userName,{
                path:'/',
                maxAge:1000*60*60
              });
              //req.session.user = doc;
              res.json({
                  status:'0',
                  msg:'',
                  result:{
                      userName: doc.userName
                  }
              });
          }
      }
  });
})

router.get("/checkLogin", function(req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    });
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    });
  }
});

router.get("/getCartCount", function(req, res, next) {
  if (req.cookies && req.cookies.userId) {
   console.log("userId"+ req.cookies.userId);
   var userId = req.cookies.userId;
   User.findOne({"userId": userId}, function(err, doc) {
     if (err) {
       res.json({
           status:"1",
           msg:err.message
       });
     } else {
       let cartList = doc.cartList;
       let cartCount = 0;
       cartList.map(item => {
         cartCount += parseFloat(item.productNum);
       });
       res.json({
         status: "1",
         msg: "",
         result: cartCount
       });
     }
   })
 } else {
   res.json({
       status:"0",
       msg: "当前用户不存在"
   });
 }
});

router.post("/logout", function(req, res, next) {
  res.cookie("userId", "", {
    path: "/",
    maxAge: -1
  });
  res.json({
    status: "0",
    mag: '',
    result: ''
  })
});

router.get("/cartList", function(req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({"userId": userId}, function(err, doc) {
    console.log(err, doc);
    if (err) {
      res.json({
          status:"1",
          msg:err.message
      });
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg:'',
          result: doc.cartList
        })
      }
    }
  })
})

router.post("/cartEdit", function(req, res, next) {
  var userId = req.cookies.userId,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked;
  // "cartList.$.productNum":productNum, 更新子文档的方法
  User.update({"userId": userId,"cartList.productId": productId }, {
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked,
  }, function(err, doc) {
    if (err) {
      res.json({
          status:"1",
          msg:err.message
      });
    } else {
      res.json({
        status:'0',
        msg:'',
        result:'success'
      });
    }
  })
});

router.post("/checkedAll", function(req, res, next) {
  var userId = req.cookies.userId,
      checkedAll = req.body.checkAll ? '1' : '0';
  User.findOne({userId: userId}, function(err, user) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (user) {
        user.cartList.forEach(item => {
          item.checked = checkedAll;
        })
      }
      user.save(function(err, doc) {
        if (err) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: 'success'
          })
        }
      })
    }
  })
});

router.post("/cartDel", function(req, res, next) {
  var userId = req.cookies.userId,
  productId = req.body.productId
  User.update({userId: userId},
  {$pull:{'cartList': {'productId':productId}}}, function(err, doc) {
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
        result: 'success'
      });
    }
  })
});

router.get("/addressList", function(req, res, next) {
  var userId = req.cookies.userId
  User.findOne({userId: userId}, function(err, doc) {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      })
    }
  })
});

router.post("/setDefault", function(req, res, next) {
  var userId = req.cookies.userId,
      addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '1003',
      msg: err.message,
      result: ''
    })
  } else {
    User.findOne({userId: userId}, function(err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        var addressList = doc.addressList;
        addressList.forEach(item => {
          item.isDefault = item.addressId === addressId
        });

        doc.save(function(err1, doc1) {
          if(err1){
            res.json({
              status:'1',
              msg:err.message,
              result:''
            });
          }else{
              res.json({
                status:'0',
                msg:'',
                result:''
              });
          }
        })
      }
    });
  }
});

router.post("/payMent", function(req, res, next) {
  var userId = req.cookies.userId,
  addressId = req.body.addressId,
  orderTotal = req.body.orderTotal;
  User.findOne({userId: userId}, function(err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      })
    } else {
      var address = '', goodsList = [];
      doc.addressList.forEach(item => {
        if (item.addressId === addressId) {
          address = item;
        }
      });
      doc.cartList.forEach(item => {
        if (item.checked === '1') {
          goodsList.push(item);
        }
      });

      var platform = '622'
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);
      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platform + r1 + sysDate + r2;
      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatue: '1',
        createDate: createDate
      };
      doc.orderList.push(order);
      doc.save(function(err, doc) {
        if (err) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        }
      })
    }
  })
})

router.post("/delAddress", function(req, res, next) {
  var userId = req.cookies.userId,
  addressId = req.body.addressId;
  User.update({userId: userId},{$pull: {
    'addressList': {'addressId': addressId}
  }}, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      });
    }
  });
});

module.exports = router;
