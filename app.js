var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var http = require('http');
var app = express();
var server = http.createServer(app);
var httpConfig = require('./util/httpconfig');

// 使用 session 中间件
app.use(session({ 
  ////这里的name值得是cookie的name，默认cookie的name是：connect.sid
    // name: 'hhw',
    // userName:null,
    secret: 'keyboard cat', 
    cookie: ('name', 'value', { path: '/', httpOnly: true,secure: false, maxAge:  60000 }),
    //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
    resave: true, 
    //强制“未初始化”的会话保存到存储。 
    saveUninitialized: true,  
    
  }))
// post请求
var bodyParser = require('body-parser')



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/', indexRouter);
app.use('/users', usersRouter);



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
server.listen(httpConfig.config["port"], (req, res) =>{
  console.log('http://'+httpConfig.config["pipe"]+':'+httpConfig.config["port"]);
})
module.exports = app;
