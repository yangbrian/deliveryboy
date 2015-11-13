var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/openorders', function(req, res,next){
   res.render('openorders',{}); 
});

router.post('/orderSubmit', function(req, res, next){
    var userOrder = req.body.user;
    User.save(userOrder, function(err){
        if(err){
            console.log("Error saving user to database");
        }
    });
    
});

module.exports = router;
