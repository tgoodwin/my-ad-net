//parse.js

module.exports = {
	parse: function(data) {
		var res = data.split(" ");
		if (res.length >= 6)
			return res[5];
	}
};
