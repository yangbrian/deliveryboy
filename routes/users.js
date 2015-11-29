var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');
var crypto = require('crypto');

var webName = "delivery Boy";
var webDomain = "cloudfood-jasonews.c9users.io";
var authExpireTime = 60 * 60 * 1000;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/home", function(req, res, next) {
	if (!req.cookies.username || !req.cookies.auth_token) {
		res.redirect('login');
		console.log("after redirect");
		return;
	}
	
	User.findOne({
		'username': req.cookies.username
	}, function( err, user) {
		if (err) {
			console.log(err);
			res.redirect("signup/?error=2");
		} else {
			if (user && user.auth.validate) {
				if ( user.auth.token == req.cookies.auth_token) {
	 				user.auth.token	= crypto.createHash('sha256').update((new Date()).toString()).digest("base64");
					res.cookie('auth_token', user.auth.token, { domain: webDomain, path: "/user/home", expires: user.auth.expire, httpOnly: true});
					res.render('user_home', {'user': user, 'flash': 'success', 'flash_msg': 'Welcome to '+ webName});
				} else {
					user.auth.expire = new Date(0);
					res.redirect('login');	
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
			res.render('user_signup', {'flash':'danger', 'flash_msg': "unable to create account"});
	} else { 
		console.log("render signup")
		res.render('user_signup');	
		console.log("after render")
	}
});

router.post('/signup', function(req, res, next) {
	
	var err = validate(req.body);
	if (Object.keys(err).length === 0) {		
		handleNewUser(req.body, res);
	} else {
		console.log(req.body);
		err.flash = 'danger';
		err.flash_msg = "Marked fields are not in correct format";
		
		err = Object.assign(err, req.body);
		console.log(err);
		res.render('user_signup', err);
	}
});

router.get('/login', function(req, res, next) {
	res.render('user_login');
});

router.post('/login', function(req, res, next) {
	var input = req.body;
	User.findOne({"username": input.username}, function(err, user) {
	    if (err || user.passwd != input.passwd) {
	    	var err = {};
	    	err.username_err = true;
	    	err.passwd_err = true;
	    	err.flash = "danger";
	    	err.flash_msg = "Login failed. Please retry";
	    	err = Object.assign(err, input);
	    	res.render("user_login", err);
	    	return;
	    }
	    
	    user.auth.token	= crypto.createHash('sha256').update((new Date()).toString()).digest("base64");
	    user.auth.expire = new Date(Date.now() + authExpireTime);
		res.cookie('auth_token', user.auth.token, { domain: webDomain, path: "/user/home", expires: user.auth.expire, httpOnly: true});
		res.redirect("home");
	    
	    	
	})
	
});

router.post('/login_facebook', function(req, res, next) {
	var info = req.body;
	var user = {};
	user.lastName = info.last_name;
	user.firstName = info.first_name;
	user.facebook_id = info.id;
	
	user.flash = "info";
	user.flash_msg = "Please fill your phone number";
	res.render("user_signup", user);
		
	
});

function handleNewUser(user, res) {
	if (user.username === null)
		user.username = user.number;
	var username = user.username.trim();
	var number = user.number.trim();
	var name = {};
	name.first = user.firstName.trim();
	name.mid = user.midName.trim();
	name.last = user.lastName.trim();
	var email = user.email;
	var passwd = user.passwd;
	var input = user;

	User.find({$or: [{
			'_number': parseInt(number, 10)},
			{"username": username}]
	}).limit(2).exec(function(err, users) {
		if (err) {
			console.log(err);
			return;
		}		
		if (users && users.length  !== 0) {
			var flash_msg = "The ";
			var err = {};
			for (var i = 0; i < users.length; i++) {
				if (users[i].username == username) {
					err.username_err = true;
					flash_msg += "username ";
				}
				if (users[i].number == number) {
					err.number_err = true;
					flash_msg += "number ";
				}
					
			}
			// console.log(users);
			flash_msg += "has been used!";
			err.flash_msg  = flash_msg;
			err.flash = "danger";
			err.passwd_err = true;
			err.passwdcomfirm_err = true;
			err = Object.assign(err, input);
			res.render('user_signup', err);
			// res.render('user_home', {'user': user, 'flash': 'success', 'flash_msg': 'Already sign up!'});
			return;		
		}
		var user = new User();
		user.username = username;
		user.name.full = name;
		user.number = number;
		user.email = email;
		user.passwd =crypto.createHash('md5').update(passwd).digest("hex");
	 	user.auth.token	= crypto.createHash('sha256').update((new Date()).toString()).digest("base64");
		user.auth.expire = new Date(Date.now() + authExpireTime);
		
		user.save( function(err) {
			if (err) {
				console.log(err);		
				res.redirect("signup/?error=1");
			}
			else {
				res.cookie('username', user.username, { domain: webDomain, path: "/users/home", expires: user.auth.expire, httpOnly: true});
				res.cookie('auth_token', user.auth.token, { domain: webDomain, path: "/users/home", expires: user.auth.expire, httpOnly: true});
				res.redirect("home");	
			}
		});
	});
}

function validate(user) {
		var reName = /^[a-zA-Z0-9_]{3,15}$/;
		var reNumber = /^[0-9]{10}$/;
		var reEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		var rePasswd1 = /.{7,}/;
		var rePasswd2 = /[a-zA-z]{1,}/;
		var err = {};
		if (!user.username || !reName.test(user.username.trim()))
			err.username_err = true;
		if (!user.number || !reNumber.test(user.number.trim()))
			err.number_err = true;
		if (user.email && !reEmail.test(user.email))
			err.email_err = true;
		if (!user.firstName)
			err.firstName_err = true;
		if (!user.lastName)
			err.lastName_err = true;
		if (!user.passwd || !rePasswd1.test(user.passwd) || !rePasswd2.test(user.passwd))
			err.passwd_err = true;
		if (err.passwd_err || !user.passwdcomfirm || user.passwd != user.passwdcomfirm)
			err.passwdcomfirm_err = true;
		return err;
}

module.exports = router;
