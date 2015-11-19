var express = require('express');
var router = express.Router();
var braintree = require('braintree');
// sandbox environment only

/* GET home page. */
router.get('/', function(req, res, next) {
    res.end("You've reached an order page");
});

router.get('/all', function(req, res) {
    res.render('openorders',{});
});

router.post('/new', function(req, res) {
    console.log("Creating new order");

    // value of order
    var value = req.body.amount;

    // payment method
    var method = req.body.method;

    var gateway = braintree.connect({
        environment:  braintree.Environment.Sandbox,
        merchantId:   's7v7h4pn8r7frry8',
        publicKey:    '9vyb7bgxrmsmz5cq',
        privateKey:   '7bc87c5837d23f275b332d5cae712068'

    });

    gateway.transaction.sale({
        amount: value,
        paymentMethodNonce: 'fake-valid-visa-nonce'

    }, function (err, result) {
        var status;
        if (err) {
            status = {
                status: 'Failed',
                error: err
            };
            console.log("Failed - Error");
        } else if (!result.success) {
            status = {
                status: 'Failed',
                error: result.message
            };
            console.log("Failed - " + result.message);
        } else {
            status = {
                status: 'Success'
            };
            console.log("Successful transaction executed!");
        }

        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(status));
    });
});
module.exports = router;
