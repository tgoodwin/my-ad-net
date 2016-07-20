//adloc template

var mongoose = require('mongoose');

// collection name will be adlocs via mongoose conventions
module.exports = mongoose.model('AdLoc', {
	domain: String,
	ip: String,
	city: String,
	country: String,
	latf: String,
	lonf: String
});
