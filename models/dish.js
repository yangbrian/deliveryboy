var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dishSchema = new Schema({
    name: {type: String, index: true, unique: true},
    restaurant_id: {type: String, index: true},
    price: Number,
    description: String,
    calories: Number,
    weight: Number,
    rate: Number,
    ingradients: String,
    tags: {type: String, index: true},
})

var Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;

