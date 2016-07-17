//adloc template

var mongoose = require('mongoose');

module.exports = mongoose.model('AdLoc', {
	ip: String,
	city: String,
	country: String,
	latf: String,
	lonf: String
});
