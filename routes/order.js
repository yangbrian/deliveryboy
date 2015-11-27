var express = require('express');
var router = express.Router();
var braintree = require('braintree');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var ActiveOrder = mongoose.model('ActiveOrder');



function handleOrder(order) {
    console.log("Entered handle order");
    
    var name = order.name;

    User.findOne({
        'name': name
    }, function(err, person) {
        if (err) {
            console.log('Error finding user');

        }
        else if (!person) {
            //Person doesn't exist, create new user and save
            //Find out how to just save the JSON order string as a new user.
            var newUser = new User;
            newUser.name = order.name;
            newUser.number = order.number;
            newUser.addresses.push(order.address);
            newUser.restaurants.push(order.restaurant);
            newUser.orders.push(order.order);

            newUser.save(function(err) {
                if (!err) {
                    console.log("Successfully saved new user");
                }
                else {
                    console.log("Error");
                }
            });

        }
        else {

            // Person exists. Check if address, restaurant, order is different and update if necessary.
            // User.update({'name': name},{$push:{'addresses':order.address}});
            //
            if (person.addresses.indexOf(order.address) <0) {
                person.addresses.push(order.address);
                console.log(person.addresses);
                
               
            }
            
            if(person.restaurants.indexOf(order.restaurant)<0){
                person.restaurants.push(order.restaurant);
                console.log(person.restaurants);
            }
            
            if(person.orders.indexOf(order.order)<0){
                person.orders.push(order.order);
                console.log(person.orders);
            }
            
            person.save(function(err) {
                    if (err) {
                        console.log('Error updating address');
                    }
                });




        }
    });
}

function createActiveOrder(order){

    var newOrder = new ActiveOrder;
    newOrder.name = order.name;
    newOrder.address = order.address;
    newOrder.number = order.number;
    newOrder.restaurant = order.restaurant;
    newOrder.order = order.order;
    newOrder.cost = order.cost;
    newOrder.tip = order.tip;

    newOrder.save(function(err){
        if(err){
            console.log('Error saving new order');
        }else{
            console.log('Saved active order succesfully');
        }
    });


}

// sandbox environment only

/* GET home page. */
router.get('/', function(req, res, next) {
    res.end("You've reached an order page");
});

router.get('/all', function(req, res) {
    res.render('openorders', {});
});

router.get('/activeOrders',function(req,res){
   ActiveOrder.find({},function(err, data){
        if(err){
            console.log('Error querying all users');
        }

        res.json(data);
    });
});

router.post('/new', function(req, res) {
    console.log('Entered route');
    handleOrder(req.body);
    createActiveOrder(req.body)
    console.log("Creating new order");


    // value of order
    var value = req.body.amount;

    // payment method
    var method = req.body.method;

    var gateway = braintree.connect({
        environment: braintree.Environment.Sandbox,
        merchantId: 's7v7h4pn8r7frry8',
        publicKey: '9vyb7bgxrmsmz5cq',
        privateKey: '7bc87c5837d23f275b332d5cae712068'

    });

    gateway.transaction.sale({
        amount: value,
        paymentMethodNonce: 'fake-valid-visa-nonce'

    }, function(err, result) {
        var status;
        if (err) {
            status = {
                status: 'Failed',
                error: err
            };
            console.log("Failed - Error");
        }
        else if (!result.success) {
            status = {
                status: 'Failed',
                error: result.message
            };
            console.log("Failed - " + result.message);
        }
        else {
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
