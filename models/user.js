var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
		name: {
			first: String,
			mid: String,
			last: String	
		},
	facebook_id: {type: String, index: true},
    addresses:[String],
    _number: {type: Number, index: true},
    restaurants: [String],
	activeOrders: [String],
    orders: [String],
		passwd: String,
		auth: {
			expire: Date,
			token: String	
		}
});

userSchema.virtual('number').set(function (phone) {
	this._number = parseInt(phone);	
});

userSchema.virtual('number').get(function () {
	return this._number.toString();	
});

userSchema.virtual('auth.validate').get(function() {
	return Date.now() < this.auth.expire.getTime();	
});

userSchema.virtual('name.full').set(function(name) {
	this.name.first = name.first;
	this.name.mid = name.mid;
	this.name.last = name.last;	
});

userSchema.virtual("name.full").get(function() {
	return this.name.first + " "+ this.name.mid + " " + this.name.last;	
});

var User = mongoose.model('User', userSchema);

module.exports = User
