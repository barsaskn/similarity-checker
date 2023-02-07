var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;


var indexRouter = require('./routes/index');
var similarityRouter = require('./routes/similarity');

var app = express();

// view engine setup (we don't need for now)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//Express auto
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Security things
app.use(cors());
app.use(helmet())
app.disable('x-powered-by')

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use('/', indexRouter);
app.use('/similarity', similarityRouter);

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
