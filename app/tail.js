//tail module -- raspberry pi OS helper code

var AdLoc = require('./models/adloc');      // load the AdLoc model.
var Tail = require('always-tail');          // like the UNIX tail command
var utils = require('lookup');              // freegeoip API helper module

// outfile is the pi-hole's logfile grepped for ad-blocked DNS queries
const logfile = '/home/pi/admap/outfile'
var t = new Tail(logfile, '\n');

var initCallbacks = function(database) { // pass in db object
    // Tail the pi's DNS query logfile
    t.on('line', function(data) {
    	var ad_domain = lookup.getIP(data);
    	parser.getLocation(ad_domain, function(response) {
                try {
                    var res = JSON.parse(response);
                    res['domain'] = ad_domain;
                    database.collection('radar').save(res, function(err, result) {
                    	if(err)
                    		return console.log('geolocate->database error: ', err);
                    	console.log('sent ' + res['ip'] + ' to database.');
                    });
                // JSON parse error.
                } catch(err) {
                    console.log('parse.. fucking christ, ', err);
                }
    	});
    });
    t.on('error', function(error) {
    	console.log('sadness: ', error);
    });
    t.watch();
};

var init = function() {
    t.watch();
}

module.exports = {

}



