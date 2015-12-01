var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurantSchema = new Schema({
    name: [String],
    username: String,
	boss_name: {
		first: String,
		mid: String,
		last: String	
	},
    phone_number: String,
	
	passwd: String,
	auth: {
		expire: Date,
		token: String	
	},
	
	company: String,
    address:String,
	website: [String],
	menu_list: [String],
	tags: [String],
	orders: [String],
	comments: [String],
	rate: Number
});

restaurantSchema.virtual('boss_name.full').get(function() {
	return this.boss_name.first + " "+ (this.boss_name.mid? this.boss_name.mid : "") + " " + this.boss_name.last;	
});

restaurantSchema.virtual('boss_name.full').set(function(name) {
	this.boss_name.first = name.first;
	this.boss_name.mid = name.mid;
	this.boss_name.last = name.last;	
});

restaurantSchema.virtual("number_raw").get(function() {
    return parseInt(this.phone_number);
})

var Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;