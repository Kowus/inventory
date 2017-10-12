require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const  flash = require('connect-flash');
const configDb = require('./config/database');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
mongoose.connect(configDb.url,{useMongoClient:true});

mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection connected')
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error:'+err)
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.locals.title = process.env.TITLE;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

require('./config/passport')(passport);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:process.env.SESSION_SECRET, resave:true, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./routes/routes')(app, passport);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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
