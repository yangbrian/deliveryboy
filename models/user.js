var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    addresses:[String],
    number: {type: String, index: true},
    restaurants: [String],
    orders: [String],
    cost: String,
    tip: String
});

var User = mongoose.model('User', userSchema);

module.exports = User
