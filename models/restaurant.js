var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurantSchema = new Schema({
    name: [String],
    username: {type: String, index: true, unique: true},
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
	
	company: {type: String, index: true},
    address:String,
	website: [String],
	menu_list: [String],
	tags: [String],
	orders: [String],
	comments: [String],
	rate: Number,
	online: Boolean,
	payment_account: {type: String, index: true},
	payment_name: String
}, {
	shardKey: {
		username: 1,
		company: 1
	}
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