var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var activeOrderSchema = new Schema({
	fullname: {type: String, index: true},
    address: String,
    number: {type: Number, index: true},
    restaurant: {type: String, index: true},
    deliveryboy: {type: String, index: true},
    order: String,
    cost: Number,
    tip: Number,
	delivered: Boolean ,
	paid: Boolean,
	user: {type: String, index: true},
	status: String,
	accepted: Boolean,
	public: Boolean,
	date: {type: Date, index: true},
	payment_account: String,
	payment_name: String,
}, {shardKey: {number: 1, restaurant: 1}});

activeOrderSchema.plugin(autoIncrement.plugin, { 
	model: 'ActiveOrder', 
	field: 'name',
	startAt: 0,
    incrementBy: 1
});

// activeOrderSchema.virtual('number').set(function (phone) {
// 	this._number = parseInt(phone);
// });

// activeOrderSchema.virtual('number').get(function () {
// 	return this._number.toString();
// });

// activeOrderSchema.virtual('cost').set(function(cost) {
// 		this._cost = parseInt(cost);
// });

// activeOrderSchema.virtual('cost').get(function() {
// 	return this._cost.toString();
// });

// activeOrderSchema.virtual('tip').set(function(tip) {
// 		this._tip = parseInt(tip);
// });

// activeOrderSchema.virtual('tip').get(function() {
// 	return this._tip.toString();
// });

var ActiveOrder = mongoose.model('ActiveOrder', activeOrderSchema);

module.exports = ActiveOrder;
