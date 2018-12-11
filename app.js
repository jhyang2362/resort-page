var createError = require('http-errors');
var express = require('express');
var session=require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var oracledb = require('oracledb');

var app = express();

app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60*2000 }
  //using secure flag means that the cookie will be set on Https only
}))

//oracledb setting
oracledb.getConnection(
  {
    user :"jhyang2362",
    password  :"1qaz1qaz",
    connectString :"dongguk-resort.chlmmb1ouqst.ap-northeast-2.rds.amazonaws.com/ORCL"
  },
  function(err, connection){
    if(err) {
      console.error(err.message);
      return;
    }
    connection.execute(
      "SELECT * FROM customer", //연결됐는지 확인 용 쿼리
      function(err, result){
        if(err) {
          console.error(err.message);
          doRelease(connection);
        }
        console.log(result.metaData);
        console.log(result.rows);
        doRelease(connection);
      }
    );
  }
);
function doRelease(connection){
  connection.release(
    function(err){
      if(err) console.error(err.message);
    }
  )
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

module.exports = app;

//
