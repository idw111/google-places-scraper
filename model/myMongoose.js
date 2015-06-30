var config = require('../config');
var mongoose = require('mongoose');

mongoose.connect('mongodb://' + config.mongo.url() + '/' + config.mongo.database);

mongoose.dropDatabase = function(done) {
	mongoose.connection.db.dropDatabase(done);
};

module.exports = mongoose;
