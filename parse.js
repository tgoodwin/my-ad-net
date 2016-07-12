//parse.js

module.exports = function() {
	this.parse = function(data) {
		var res = data.split(" ");
		return res[5];
	};
}
