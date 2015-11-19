var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

module.exports = router;
