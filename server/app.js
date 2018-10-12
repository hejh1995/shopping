var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
// EJS是一个JavaScript模板库，用来从JSON数据中生成HTML字符串。
var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// 为了把view里面的换成html
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 定义静态资源的路径，可以把前端代码部署到node文件的 静态资源文件下。
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) {
  console.log('req', req.headers.authorization);
  if(req.cookies.userId){
    next();
  }else{
      console.log("url:"+req.originalUrl);
      if(req.originalUrl=='/users/cofLogin' || req.originalUrl=='/users/logout' || req.originalUrl.indexOf('/goods/list')>-1){
        // 还有一种方案，用reg.path == 'goods/list',查为什么
        // 白名单，可登录，可登出，还可以查看商品列表3‘
          console.log('next', req.originalUrl);
          next();
      }else{
          res.json({
            status:'10001',
            msg:'当前未登录',
            result:''
          });
      }
  }
});

app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
