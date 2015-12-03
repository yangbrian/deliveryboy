var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activeOrderSchema = new Schema({
	name: {type: String, index: true},
    address: String,
    number: {type: Number, index: true},
    restaurant: {type: String, index: true},
    order: String,
    cost: Number,
    ctip: Number,
	delivered: Boolean ,
	paid: Boolean,
	user: {type: String, index: true}
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
