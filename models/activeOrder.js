var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activeOrderSchema = new Schema({
	name: {type: String, index: true},
    address: String,
    number: {type: Number, index: true},
    restaurant: {type: String, index: true},
    order: String,
    cost: Number,
    tip: Number 
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

activeOrderSchema.virtual('cost').set(function(cost) {
		this.cost = Number.parseInt(cost);	
});

activeOrderSchema.virtual('cost').get(function() {
	return this.cost.toString();	
});

activeOrderSchema.virtual('cost.raw').get(function() {
	return this.cost;	
});

activeOrderSchema.virtual('tip').set(function(tip) {
		this.cost = Number.parseInt(tip);	
});

activeOrderSchema.virtual('tip').get(function() {
	return this.tip.toString();	
});

activeOrderSchema.virtual('tip.raw').get(function() {
	return this.tip;	
});

var ActiveOrder = mongoose.model('ActiveOrder', activeOrderSchema);

module.exports = ActiveOrder;
