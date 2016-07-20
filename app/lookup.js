//lookup.js

var request = require('request');

var parse = function(data) {
	var res = data.split(" ");
	if (res.length >= 6) {
		return res[5]; //the domain name as string
	}
};

var getServerLocation = function(address, callback) {
	// could modularize this for various geolocation options
	var msg = 'http://freegeoip.net/json/' + address;
	console.log('api request: ', msg);
	request(msg, function(error, response, body) {
		if (!error && response.statusCode == 200){
			return callback(body);
		} else {
			console.log('error', error);
			return callback(error);
		}
	});
};

module.exports = {
	getIP: function(data) {
		return parse(data);
	},

	geolocate: function(d, callback) {
		return getServerLocation(d, callback);
	}
};

