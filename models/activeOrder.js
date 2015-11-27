var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activeOrderSchema = new Schema({
	name: {type: String, index: true},
    address: String,
    number: String,
    restaurant: String,
    order: String,
    cost: String,
    tip: String
});

var ActiveOrder = mongoose.model('ActiveOrder', activeOrderSchema);

module.exports = ActiveOrder;
