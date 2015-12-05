var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ingradientSchema = new Schema({
    value: {type:String, index: true, unique: true}
}, {
    shardKey: {
       value: 1 
    }
});

var Ingradient = mongoose.model("Ingradient", ingradientSchema);

module.exports = Ingradient;

