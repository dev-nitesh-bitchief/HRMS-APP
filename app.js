var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var role=require('./routes/Role')
var eworkInfo = require('./routes/emp-work-info');
var employee = require('./routes/Employee');

var permission = require('./routes/Permission')
var subscription= require('./routes/Subscription')

var holiday = require('./routes/public-holiday')



var leave = require('./routes/leave');
var Leave_request = require('./routes/Leave_request');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/role',role);
app.use('/ework',eworkInfo);
app.use('/employee',employee);
app.use('/permission',permission);
app.use('/subscription',subscription);






app.use('/Leave', Leave_request)



app.use('/leave', leave);
app.use('/holiday',holiday);



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
