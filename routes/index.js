var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');
var os = require("os");

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.cookies.typeRestaurant && !req.cookies.logout)
        res.redirect("/restaurants/home");
    else if (req.cookies.typeUser && !req.cookies.logout)
        res.redirect("/users/home");
    else
        res.render('index', { title: 'Express', host: os.hostname() });
});

// left here so things don't break
// please use route in order.js: /all instead
router.get('/openorders', function(req, res,next){
   res.render('openorders',{});
});

// order.js: /new instead
router.post('/submitOrder', function(req, res, next){
    console.log("arrived");
    //  var user = req.body;
    //  console.log(typeof user);
     //when trying to access properties they show up as undefined

});

router.get('/help/', function(req, res, next){
    if (req.cookies.typeRestaurant) {
        var restaurant = {};
        restaurant.username = req.cookies.usernameR;
        res.render('help', {
            title: "Help Guide - DeliveryBoy",
            host: os.hostname() ,
            help: true,
            restaurant: restaurant
        });
    } else if (req.cookies.typeUser) {
        var user = {};
        user.username = req.cookies.username;
        res.render('help', {
            title: "Help Guide - DeliveryBoy",
            host: os.hostname() ,
            help: true,
            user: user
        });
    } else {
        res.render('help', {
            title: "Help Guide - DeliveryBoy",
            host: os.hostname() ,
            help: true
        });
        
    }

});

module.exports = router;
