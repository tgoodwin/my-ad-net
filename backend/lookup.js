//lookup.js

var request = require('request');
var API_URL = 'http://freegeoip.net/json/';

var parse = function(data) {
	var res = data.split(" ");
	if (res.length >= 6) {
		return res[6] == 'is' ? res[5] : res[6]; //the domain name as string
	}
};

var getServerLocation = function(address, callback) {
	var payload = API_URL + address;
	request(payload, function(error, response, body) {
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

	geolocate: function(address, callback) {
		return getServerLocation(address, callback);
	}
};

