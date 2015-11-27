var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
	name: {type: String, index: true},
    address: String,
    number: {type: [Number], index: true},
    restaurant: {type: String, index: true},
	menu: [String],
    cost: Number,
    tip: Number, 
	user: String
});

orderSchema.virtual('number').set(function (phone) {
	this.number = Number.parseInt(phone);	
});

orderSchema.virtual('number').get(function () {
	return this.number.toString();	
});

orderSchema.virtual('number.raw').get(function () {
	return this.number;	
});

orderSchema.virtual('cost').set(function(cost) {
		this.cost = Number.parseInt(cost);	
});

orderSchema.virtual('cost').get(function() {
	return this.cost.toString();	
});

orderSchema.virtual('cost.raw').get(function() {
	return this.cost;	
});

orderSchema.virtual('tip').set(function(tip) {
		this.cost = Number.parseInt(tip);	
});

orderSchema.virtual('tip').get(function() {
	return this.tip.toString();	
});

orderSchema.virtual('tip.raw').get(function() {
	return this.tip;	
});

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;
