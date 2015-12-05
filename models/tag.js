var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
    value: {type:String, index: true, unique: true}
}, {
    shardKey:{
        value: 1
    }
});

var Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;

