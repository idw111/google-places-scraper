var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/noodle');

module.exports = mongoose;
