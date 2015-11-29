var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
	name: {type: String, index: true},
    address: String,
    _number: {type: [Number], index: true},
    restaurant: {type: String, index: true},
	menu: [String],
    _cost: Number,
    _tip: Number, 
	user: String
});

orderSchema.virtual('number').set(function (phone) {
	this._number = parseInt(phone);	
});

orderSchema.virtual('number').get(function () {
	return this._number.toString();	
});

orderSchema.virtual('cost').set(function(cost) {
		this._cost = parseInt(cost);	
});

orderSchema.virtual('cost').get(function() {
	return this._cost.toString();	
});

orderSchema.virtual('tip').set(function(tip) {
		this._tip = parseInt(tip);	
});

orderSchema.virtual('tip').get(function() {
	return this._tip.toString();	
});

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;
