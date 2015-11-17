var express = require('express');
var router = express.Router();
var braintree = require('braintree');
// sandbox environment only

/* GET home page. */
router.get('/', function(req, res, next) {
    res.end("You've reached an order page");
});

router.post('/new', function(req, res) {

});
module.exports = router;
