var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');
var crypto = require('crypto');

var webName = "delivery Boy";
var webDomain = "";
var authExpireTime = 60 * 60 * 1000;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/home", function(req, res, next) {
	if (!req.cookies.username || !req.cookies.auth-token)
		res.redirect('/login');
	
	User.findOne({
		'username': req.cookies.username
	}, function( err, user) {
		if (err) {
			console.log(err);
			res.redirect("/signup/?error=2");
		} else {
			if (user.auth.validate) {
				if ( user.auth.token == req.cookies.auth-token) {
	 				user.auth.token	= crypto.createHash('sha256').update((new Date()).toString()).digest("base64");
					res.cookie('auth-token', user.auth.token, { domain: webDomain, path: "/user/home", expires: user.auth.expire, httpOnly: true});
					res.render('user.home', {'user': user, 'flash': 'success', 'flash-msg': 'Welcome to '+ webName});
				} else {
					user.auth.expire = new Date(0);
					res.redirect('/login');	
				}
			} else {
				res.redirect('/login');	
			}
		}
	});	
});

router.get('/signup', function(req, res, next) {
	if (req.query.error !== null) {
		if (parseInt(req.query.error) === 1)
			res.render('user.signup', {'flash':'error', 'flash-msg': "unable to create account"});
	} else { 
		res.render('user.signup');	
	}
});

router.post('/signup', function(req, res, next) {
	var err =	validate(req.body);
	if (err === {}) {		
		handleNewUser(req.body, res);
	} else {
		res.render('user.signup', err);
	}
});

router.get('/login', function(req, res, next) {
	res.render('user.login');
});

function handleNewUser(user, res) {
	if (user.username === null)
		user.username = user.number;
	var username = user.username.trim();
	var number = user.number;
	var name = {};
	name.first = user.firstName.trim();
	name.mid = user.midName.trim();
	name.last = user.lastName.trim();
	var email = user.email;
	var passwd = user.passwd;

	User.findOne({
			'number': number		
	}, function(err, user) {
		if (err) {
			console.log(err);
			return;
		}		
		if (user) {
			res.render('user.home', {'user': user, 'flash': 'success', 'flash-msg': 'Already sign up!'});
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
				res.cookie('username', user.username, { domain: webDomain, path: "/user/home", expires: user.auth.expire, httpOnly: true});
				res.cookie('auth-token', user.auth.token, { domain: webDomain, path: "/user/home", expires: user.auth.expire, httpOnly: true});
				res.redirect("home");	
			}
		});
	});
}

function validate(user) {
		var reName = /^[a-zA-Z0-9_]{3,15}$/;
		var reNumber = /[0-9]{10}/;
		var reEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		var rePasswd = /.{7,}/;	
		var err = {};
		if (!reName.test(user.name))
			err.name_err = true;
		if (!reNumber.test(user.number))
			err.number_err = true;
		if (user.email && !reEmail.test(user.email))
			err.email_err = true;
		if (!rePasswd.test(user.passwd))
			err.passwd_err = true;
		if (user.passwd != user.passwdcomfirm)
			err.passwdcomfirm_err = true;
		return err;
}

module.exports = router;
