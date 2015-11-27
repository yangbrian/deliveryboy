var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    addresses:[String],
    number: {type: Number, index: true},
    restaurants: [String],
    orders: [String],
    cost: String,
    tip: String
});

userSchema.virtual('number').set(function (phone) {
	this.number = Number.parseInt(phone);	
});

userSchema.virtual('number').get(function () {
	return this.number.toString();	
});

userSchema.virtual('number.raw').get(function () {
	return this.number;	
});

var User = mongoose.model('User', userSchema);

module.exports = User
