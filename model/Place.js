var mongoose = require('./myMongoose');
var Schema = mongoose.Schema;

// schema
var PlaceSchema = new Schema({
	address: {type: String},
	location: [Number],
	name: {type: String},
	place_id: {type: String, unique: true},
	reference: {type: String}
});

// statics

// methods

// middleware


// model
var Place = mongoose.model('Place', PlaceSchema);

module.exports = Place;
