var express = require('express');
var router = express.Router();
var braintree = require('braintree');
// sandbox environment only

/* GET home page. */
router.get('/', function(req, res, next) {
    var gateway = braintree.connect({
        environment:  braintree.Environment.Sandbox,
        merchantId:   's7v7h4pn8r7frry8',
        publicKey:    '9vyb7bgxrmsmz5cq',
        privateKey:   '7bc87c5837d23f275b332d5cae712068'

    });

    gateway.clientToken.generate({}, function( err, response ) {
        console.log(err);
        console.log(response);
    });

    gateway.transaction.sale({
        amount: '10.00',
        paymentMethodNonce: 'fake-valid-visa-nonce',

    }, function (err, result) {
        console.log(result);
        console.log(err);
        res.end("Done");
    });
});
module.exports = router;
