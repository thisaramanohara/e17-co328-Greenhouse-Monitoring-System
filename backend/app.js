var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var featuresRouter = require('./routes/featuresRouter');
var setFreqRouter = require('./routes/setFrequencyRouter');
var imageUpload = require('./routes/plants');

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const cors = require("cors");

//mongodb URL
const url = config.mongoUrl;
const connect = mongoose.connect(url, {autoIndex: false});

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//midlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(passport.initialize());
app.use(passport.session());


function auth (req, res, next) {
  if (!req.user) {
      var err = new Error('You are not authenticated!');
      err.status = 401;//unauthorized
      return next(err);
  }
  else {
      next();
  }
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/features', featuresRouter);
app.use('/frequency', setFreqRouter);
app.use('/imageUpload', imageUpload);

//auth middleware
app.use(auth);

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));



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
