var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ingradientSchema = new Schema({
    value: {type:String, index: true, unique: true}
})

var Ingradient = mongoose.model("Ingradient", ingradientSchema);

module.exports = Ingradient;

