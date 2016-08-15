//adloc template

var mongoose = require('mongoose');

// collection name will be adlocs via mongoose conventions
module.exports = mongoose.model('AdRecord', {
	domain: String,
	ip: String,
	city: String,
	country: String,
	coordinate: String
});