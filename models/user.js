var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    addresses:[String],
    _number: {type: Number, index: true},
    restaurants: [String],
	activeOrders: [String],
    orders: [String],
});

userSchema.virtual('number').set(function (phone) {
	this._number = parseInt(phone);	
});

userSchema.virtual('number').get(function () {
	return this._number.toString();	
});

var User = mongoose.model('User', userSchema);

module.exports = User
