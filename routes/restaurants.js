var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Restaurant = mongoose.model('Restaurant');
var Dish = mongoose.model('Dish');
var Tag = mongoose.model("Tag");
var Ingradient = mongoose.model("Ingradient");
var ActiveOrder = mongoose.model("ActiveOrder");
var crypto = require('crypto');

var webName = "delivery Boy";
var webDomain = "cloudfood-jasonews.c9restaurants.io";
var authExpireTime = 60 * 60 * 1000;

/* GET restaurants listing. */
router.get('/', function(req, res, next) {
  res.send('restaurant root page');
});

router.get("/home", function(req, res, next) {
	if (!req.cookies.username || !req.cookies.auth_token) {
		res.redirect('login');
		console.log(req.cookies);
		console.log("No cookies redirect");
		return;
	}
	
	Restaurant.findOne({
		'username': req.cookies.username
	}, function( err, restaurant) {
		if (err) {
			console.log(err);
			res.redirect("signup/?error=2");
		} else {
			if (restaurant) {
				if ( restaurant.auth.token == req.cookies.auth_token && restaurant.auth.validate) {
	 				restaurant.auth.token = crypto.createHash('sha256').update((new Date()).toString()).digest("base64");
	 				var online = restaurant.online;
	 				restaurant.online = true;
	 				restaurant.save(function(err) {
	 					if (err) {
	 						res.send(err);
	 						return;
	 					}
						
	 					res.clearCookie("auth_token", {path: "/restaurants/home"});
	 					res.cookie('auth_token', restaurant.auth.token, { path: "/restaurants/home", expires: restaurant.auth.expire, httpOnly: true});
	 					console.log("online: ", online);
	 					
	 					if (!online)
							res.render('restaurant_home', {'restaurant': restaurant, 'flash': 'success', 'flash_msg': 'Welcome to '+ webName});
						else
							res.render('restaurant_home', {'restaurant': restaurant});
						
	 				});
					
				} else {
					restaurant.auth.expire = new Date(0);
					restaurant.online = false;
					restaurant.save(function(err) {
					    if (err) {
	 						res.send(err);
	 						return;
	 					}
	 					if (req.cookies.logout)
	 						res.redirect("/");
	 					else
							res.redirect('login');
					});
				}
			} else {
				res.redirect('login');	
			}
		}
	});	
});

router.get('/signup', function(req, res, next) {
	console.log('enter signup');
	console.log(req.query.error !== undefined);
	if (req.query.error !== undefined) {
		if (parseInt(req.query.error) === 1)
			res.render('restaurant_signup', {'flash':'danger', 'flash_msg': "unable to create account"});
	} else { 
		console.log("render signup")
		res.render('restaurant_signup');	
		console.log("after render")
	}
});

router.post('/signup', function(req, res, next) {
	
	var err = validate(req.body);
	if (Object.keys(err).length === 0) {		
		handleNewRestaurant(req.body, res);
	} else {
		console.log(req.body);
		err.flash = 'danger';
		err.flash_msg = "Marked fields are not in correct format";
		
		err = Object.assign(err, req.body);
		err.passwd = "";
		err.passwdcomfirm = "";
		console.log(err);
		res.render('restaurant_signup', err);
	}
});

router.get('/login', function(req, res, next) {
	res.render('restaurant_login');
});

router.post('/login', function(req, res, next) {
	var input = req.body;
	Restaurant.findOne({"username": input.username}, function(err, restaurant) {
	    if (err || !restaurant || (restaurant && restaurant.passwd != crypto.createHash('md5').update(input.passwd).digest("hex"))) {
	    	var err = {};
	    	err.username_err = true;
	    	err.passwd_err = true;
	    	err.flash = "danger";
	    	err.flash_msg = "Login failed. Please retry";
	    	err = Object.assign(err, input);
	    	res.render("restaurant_login", err);
	    	return;
	    }
	    
	    restaurant.auth.token	= crypto.createHash('sha256').update((new Date()).toString()).digest("base64");
	    restaurant.auth.expire = new Date(Date.now() + authExpireTime);
    	restaurant.save(function(err) {
    		if (err) {
    			res.send("save restaurant failed");
    			return;
    		}
    		res.clearCookie("auth_token", {path: "/restaurants/home"});
    		res.clearCookie("username", {path:"/restaurants/home"});
    		res.cookie('username', restaurant.username, {path: "/restaurants/home", expires: restaurant.auth.expire, httpOnly: true});
    		res.cookie('auth_token', restaurant.auth.token, {path: "/restaurants/home", expires: restaurant.auth.expire, httpOnly: true});
			res.redirect("home");
    	})
		
	    
	})
	
});

router.get("/logout", function(req, res, next) {
    res.clearCookie("auth_token", {path: "/restaurants/home"});
    res.cookie("auth_token", "logout", {path: "/restaurants/home", httpOnly: true});
    res.cookie("logout", "true", {path: "/restaurants/home", httpOnly: true});
    res.redirect("home");
})

router.post("/home/payment", function(req, res, next) {
    if (!req.cookies.username || !req.cookies.auth_token)
    	res.redirect("/restaurants/login");
    else {
    	var input = req.body;
    	console.log(input);
    	Restaurant.findOne({
		'username': req.cookies.username
		}, function( err, restaurant) {
			if (err) {
				console.log(err);
				res.redirect("signup/?error=2");
			} else {
				if ( restaurant.auth.token == req.cookies.auth_token && restaurant.auth.validate && restaurant.online) {
					restaurant.payment_account = input.payment_account;
					restaurant.payment_name = input.payment_name;
					restaurant.save(function(err) {
						if (err) {
							console.log(err);
							res.render('restaurant_home', {'restaurant': restaurant, 'flash': 'danger', 'flash_msg': 'failed to update payment' });
							return;
						}
						res.render('restaurant_home', {'restaurant': restaurant, 'flash': 'success', 'flash_msg': 'Successfully updated payment' });
					});
				} else {
					res.redirect("/restaurants/login");
				}
			}
		});
    }
});


router.post("/home/dish/new", function(req, res, next) {
	
    if (!req.cookies.username || !req.cookies.auth_token)
    	res.redirect("/restaurants/login");
    else {
    	var input = req.body;
    	console.log(input);
    	Restaurant.findOne({
		'username': req.cookies.username
		}, function( err, restaurant) {
			if (err) {
				console.log(err);
				res.redirect("signup/?error=2");
			} else {
				if ( restaurant.auth.token == req.cookies.auth_token && restaurant.auth.validate && restaurant.online) {
					
					    
				    var dish = new Dish();
					dish.name = input.name;
					dish.calories = input.calories;
					dish.weight = input.weight;
					dish.description = input.description;
					dish.ingradients = input.ingradients;
					dish.tags = input.tags;
					dish.rate = 0;
					dish.price = input.price;
					dish.restaurant_id = restaurant.username
					
					dish.save(function(err) {
						if (err) {
							console.log(err.message);
							res.render('restaurant_home', {'restaurant': restaurant, 'flash': 'danger', 'flash_msg': 'failed to added dish '+dish.name+" to menu: " + err.message });
							return;
						}
						res.render('restaurant_home', {'restaurant': restaurant, 'flash': 'success', 'flash_msg': 'Successfully added dish '+dish.name+" to menu" });
					});
					
					var tag = null;
					var tags = dish.tags.split(',');
					for (var i = 0; i < tags.length; i ++) {
						tag = new Tag();
						tag.value = tags[i];
						tag.save();
					}
					
					tags = dish.ingradients.split(',');
					for (var i = 0; i < tags.length; i ++) {
						tag = new Ingradient();
						tag.value = tags[i];
						tag.save();
					}
					
				} else {
					res.redirect("/restaurants/login");
				}
			}
				
    	});
    }
});

router.post("/home/activeOrders/delivered", function(req, res, next) {
   validateStatus(req,res, Restaurant, "/restaurants/login", function(input, restaurant) {
   		ActiveOrder.findOne({
   			name: input.name
   		}, function(err, order) {
   		    order.delivered = true;
	       order.save(function (err) {
	       		if (err) {
	       			res.render('restaurant_home', {'restaurant': restaurant, 'flash': 'danger', 'flash_msg': "unable to complete request: "+err.message });
	       			return;
	       		}
	       		res.render("restaurant_home", {'restaurant': restaurant});
   			});
       
       });
   }, function(input) {
       res.redirect("/restaurants/login");
   });
});

router.post("/home/activeOrders/paid", function(req, res, next) {
   validateStatus(req,res, Restaurant, "/restaurants/login", function(input, restaurant) {
   		ActiveOrder.findOne({
   			name: input.name
   		}, function(err, order) {
   		    order.paid = true;
	       order.save(function (err) {
	       		if (err) {
	       			res.render('restaurant_home', {'restaurant': restaurant, 'flash': 'danger', 'flash_msg': "unable to complete request: "+err.message });
	       			return;
	       		}
	       		res.redirect("/restaurants/home");
   			});
       
       });
   }, function(input) {
       res.redirect("/restaurants/login");
   });
});

// Get data

router.get("/home/menu", function(req, res, next) {
    validateStatus(req,res,Restaurant, "/restaurants/login", function(input, restaurant) {
    	console.log("in menu callback");
    	Dish.find({
    		restaurant_id: restaurant.username
    	}, function(err, dishes) {
    		res.set("Content-Type", "text/json");
    		if (err) {
    			console.log(err);
    			res.send({'err': err});
    			return;
    		}
    		res.send(dishes);
    	});
    }, function(input) {
    	res.redirect("/restaurants/login");
    });
});

router.get("/home/orders", function(req, res, next) {
    validateStatus(req,res,Restaurant, "/restaurants/login", function(input, restaurant) {
    	ActiveOrder.find({
    		restaurant: restaurant.address
    	}, function(err, orders) {
    		res.set("Content-Type", "text/json");
    		if (err) {
    			console.log(err);
    			res.send({'err': err});
    			return;
    		}
    		res.send(orders);
    	});
    });
});


router.get("/home/activeOrders", function(req, res, next) {
    validateStatus(req,res,Restaurant, "/restaurants/login", function(input, restaurant) {
    	ActiveOrder.find({
    		$or: [ {restaurant: restaurant.address, paid: false}, {
    		restaurant: restaurant.address, delivered: false} ]
    	}, function(err, orders) {
    		res.set("Content-Type", "text/json");
    		if (err) {
    			console.log(err);
    			res.send({'err': err});
    			return;
    		}
    		res.send(orders);
    	});
    });
});

router.get("/tags", function(req, res, next) {
	
	Tag.find(function(err, data){
		res.set("Content-Type", "text/json");
		if (err) {
			console.log(err);
			res.send({'err': err});
			return;
		}
		console.log(data);
		res.send(data);
	});
    
});

router.get("/ingradients", function(req, res, next) {
	
	Ingradient.find(function(err, data){
		res.set("Content-Type", "text/json");
		if (err) {
			console.log(err);
			res.send({'err': err});
			return;
		}
		console.log(data);
		res.send(data);
	});
    
});


// helper functions

function handleNewRestaurant(restaurant, res) {
	if (restaurant.username === null)
		restaurant.username = restaurant.number;
	var name = restaurant.name.trim();
	var username = restaurant.username.trim();
	var number = restaurant.phone_number.trim();
	var boss_name = {};
	boss_name.first = restaurant.firstName.trim();
	boss_name.mid = restaurant.midName.trim();
	boss_name.last = restaurant.lastName.trim();
	var email = restaurant.email;
	var address = restaurant.address;
	var company = restaurant.company;
	// TODO: implement operation hours of everyday.
	
	
	var passwd = restaurant.passwd;
	var input = restaurant;

	Restaurant.findOne({
			"username": username
	}, function(err, restaurants) {
		if (err) {
			console.log(err);
			return;
		}		
		if (restaurants) {
			var flash_msg = "The ";
			var err = {};
			
			if (restaurants.username == username) {
				err.username_err = true;
				flash_msg += "username ";
			}
				
			// console.log(restaurants);
			flash_msg += "has been used!";
			err.flash_msg  = flash_msg;
			err.flash = "danger";
			err.passwd_err = true;
			err.passwdcomfirm_err = true;
			err = Object.assign(err, input);
			res.render('restaurant_signup', err);
			// res.render('restaurant_home', {'restaurant': restaurant, 'flash': 'success', 'flash_msg': 'Already sign up!'});
			return;		
		}
		var restaurant = new Restaurant();
		restaurant.username = username;
		restaurant.boss_name.full = boss_name;
		restaurant.phone_number = number;
		restaurant.email = email;
		restaurant.address = address;
		restaurant.company = company;
		restaurant.name.push(name);
		restaurant.passwd =crypto.createHash('md5').update(passwd).digest("hex");
	 	restaurant.auth.token = crypto.createHash('sha256').update((new Date()).toString()).digest("base64");
		restaurant.auth.expire = new Date(Date.now() + authExpireTime);
		restaurant.online = false;
		
		restaurant.save( function(err) {
			if (err) {
				console.log(err);		
				res.redirect("signup/?error=1");
			}
			else {
				res.clearCookie('username', {path: "/restaurants/home"});
				res.clearCookie('auth_token', {path: "/restaurants/home"});
				res.cookie('username', restaurant.username, {path: "/restaurants/home", expires: restaurant.auth.expire, httpOnly: true});
				res.cookie('auth_token', restaurant.auth.token, {path: "/restaurants/home", expires: restaurant.auth.expire, httpOnly: true});
				console.log(restaurant.username+"\n"+restaurant.auth.token);
				res.redirect("home");	
			}
		});
	});
}

function validate(restaurant) {
		var reName = /^[a-zA-Z0-9_]{3,15}$/;
		var reNumber = /^[0-9]{10}$/;
		var reEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		var rePasswd1 = /.{7,}/;
		var rePasswd2 = /[a-zA-Z]{1,}/;
		var err = {};
		if (!restaurant.username || !reName.test(restaurant.username.trim()))
			err.username_err = true;
		if (!restaurant.phone_number || !reNumber.test(restaurant.phone_number.trim()))
			err.number_err = true;
		if (restaurant.email && !reEmail.test(restaurant.email))
			err.email_err = true;
		if (!restaurant.firstName)
			err.firstName_err = true;
		if (!restaurant.lastName)
			err.lastName_err = true;
		if (!restaurant.company)
			err.company_err = true;
		if (!restaurant.address)
			err.address_err = true;
		if (!restaurant.name) 
			err.name_err = true;
		if (!restaurant.passwd || !rePasswd1.test(restaurant.passwd) || !rePasswd2.test(restaurant.passwd))
			err.passwd_err = true;
		if (err.passwd_err || !restaurant.passwdcomfirm || restaurant.passwd != restaurant.passwdcomfirm)
			err.passwdcomfirm_err = true;
		return err;
}


var validateStatus = function(req, res, model, forwardPage, scallback, fcallback) {
	if (!req.cookies.username || !req.cookies.auth_token)
    	res.redirect(forwardPage);
    else {
    	var input = req.body;
    	console.log(input);
    	model.findOne({
		'username': req.cookies.username
		}, function( err, user) {
			if (err) {
				console.log(err);
				res.redirect("signup/?error=2");
			} else if(user) {
				if (user.auth.token == req.cookies.auth_token && user.auth.validate && user.online) {
					if (scallback)
						scallback(input, user);
				} else {
					if (fcallback)
						fcallback(input);
				}
			} else {
				res.redirect(forwardPage);
			}
		});
    }

}

module.exports = router;
