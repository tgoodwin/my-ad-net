//parse.js
var request = require('request');

module.exports = {
	parse: function(data) {
		var res = data.split(" ");
		if (res.length >= 6)
			return res[5];
	}, 
	geolocate: function(domain) {
		// hit freegeoip api
		var url = 'freegeoip.net/json' + domain;
		request(url, function(error, response, body) {
			if(!error && response.statusCode == 200) {
				return body;
			} else {
				return error;
			}
		});

	}
};
