var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017',{ mongos : true}, function(err) {
  if (!err)
    console.log(err);
});


// mongoose.connect('mongodb://10.0.0.12:27017,10.0.0.13:27017,10.0.0.14:27017,10.0.0.40:27017,10.0.0.59:27017,10.0.0.54:27017',{ mongos : true}, function(err) {
//   if (!err)
//     console.log(err);
// });

var User = require('./models/user');

var Dish = require("./models/dish");

var ActiveOrder = require('./models/activeOrder');

var Restaurant = require("./models/restaurant");

var Tag = require("./models/tag");

var Ingradient = require("./models/ingradient");

var routes = require('./routes/index');
var users = require('./routes/users');
var payments = require('./routes/payments');
var order = require('./routes/order');
var restaurants = require("./routes/restaurants");


var app = express();

var io = require("socket.io")();
app.io = io;


var redis = require('socket.io-redis');
//io.adapter(redis({ host: '10.0.0.69', port: 6379 }));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/payments', payments);
app.use('/restaurants', restaurants);
app.use('/order', order(app.io));
app.use('/restaurants', restaurants);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// app.io.on('connection', function (socket) {
//     console.log('A user connected');

//     socket.on('order', function (order) {
//         // var user = new User({
//         //     name: order.name,
//         //     address: order.address,
//         //     restaurant: order.restaurant,
//         //     order: order.order,
//         //     cost: order.cost,
//         //     tip: order.tip
//         // });
//         // user.save(function (err) {
//         //     if (!err) {
//         //         console.log("Success");
//         //     }
//         //     else {
//         //         console.log("Error");
//         //     }
//         // });

//         app.io.emit('order', order);
//     });

//     socket.on('acceptance', function (order) {
//         //remove order from live orders
//         console.log('save succesful');

//     });

// });

io.on('connection', function (socket) {
    console.log("NEW USER");

    socket.on('join', function (data) {
        console.log("JOIN - " + data);
    });
});

module.exports = app;
