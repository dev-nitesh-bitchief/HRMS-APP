var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

var login= require('./routes/login');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var salaryRouter = require('./routes/salary');
var salarytypeRouter = require('./routes/salarytype');
var attendanceRouter = require('./routes/Attendance')
var attendancerecordRouter = require('./routes/attendancerecord')

var role = require('./routes/Role');
var docs = require('./routes/Document');
var eworkInfo = require('./routes/emp-work-info');
var permission = require('./routes/Permission');
var employee = require('./routes/Employee');

var holiday = require('./routes/public_holiday')
var feedback = require('./routes/Feedback');
var subscription = require('./routes/Subscription');

var smtp = require('./routes/Smtp');
var subPlan = require('./routes/subPlan');
var emailTemp = require('./routes/emailTemp');
var Leave_request = require('./routes/Leave_request');
var Leave_policy = require('./routes/Leave_policy');
var Leave_balance = require('./routes/Leave_balance');
var Leave_type = require('./routes/Leave_type');
var Leave_allocation = require('./routes/Leave_allocation');

var Expense_category = require('./routes/Expense_category');
var Payment_method = require('./routes/Payment_method');
var Expense = require('./routes/Expense');

var Email_template = require('./routes/Email_temp');
var Smtp = require('./routes/Smtp');

var Audit_logging = require('./routes/Audit_logging');
var Payroll = require('./routes/Payroll');

var loginRouter = require('./routes/login');

var app = express();
app.use(express.static('styling'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'design')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

app.use(express.static('design'));



app.use('/',login);
app.use('/index', indexRouter);

app.use('/', indexRouter);
app.use(express.static('design'));



app.use('/users', usersRouter);
app.use('/salary', salaryRouter);
app.use('/salarytype', salarytypeRouter);


app.use('/attendance', attendanceRouter)
app.use('/attendancerecord', attendancerecordRouter)
app.use('/login', loginRouter)



app.use('/role', role);
app.use('/ework', eworkInfo);
app.use('/employee', employee);
app.use('/permission', permission);
app.use('/subscription', subscription);
app.use('/docs', docs);
app.use('/feedback', feedback);






// app.use('/leave', leave);

app.use('/Leave', Leave_request);
app.use('/Leave-policy', Leave_policy);
app.use('/Leave-balance', Leave_balance);

app.use('/Leave-type', Leave_type);
app.use('/Leave-allocation', Leave_allocation);



app.use('/Expense_category', Expense_category);
app.use('/Payment_method', Payment_method);
app.use('/Expense', Expense);


app.use('/Email_template', Email_template);
app.use('/Smtp', Smtp);




app.use('/Leave-type' , Leave_type);
app.use('/Leave-allocation' , Leave_allocation);


app.use('/Audit-logging', Audit_logging);
app.use('/Payroll',Payroll);


app.use('/leaveType-dropdown' , Leave_request);


app.use('/holiday',holiday);
app.use('/smtp',smtp);
app.use('/subPlan',subPlan);
app.use('/emailTemp',emailTemp);
app.use('/expense',expense_category);


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

