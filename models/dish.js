var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dishSchema = new Schema({
    name: String,
    resturant_id: String,
    price: Number,
    description: String,
    calories: Number,
    weight: Number,
    rate: Number,
    gradients: [String],
    tags: [String]
})

var Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;

