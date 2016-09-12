
/* tail the logfile on the pi. for each tail event, hit a geolocation database and construct
 * an AdLoc model with the returned data.
 * Save this model to the database, that is all. no data to be served from this module.
 */

var AdLoc = require('./models/adloc');      // load the AdLoc model.
var Tail = require('always-tail');          // like the UNIX tail command
var util = require('./lookup');              // freegeoip API helper module

var mongoose = require('mongoose');
console.log(!!mongoose.connection + ' that were connected');

// outfile is the pi-hole's logfile grepped for ad-blocked DNS queries
// this is a brittle solution, but assumes that the 'init' script has just been run.
const logfile = '/home/pi/my-ad-net/outfile'
var t = new Tail(logfile, '\n');

var initCallbacks = function(model) {
    var AdRecord = model;
    // Tail the pi's DNS query logfile
    t.on('line', function(data) {
        // pluck out IP from logfile entry
    	var ad_domain = util.getIP(data);
    	util.geolocate(ad_domain, function(response) {
            try {
                var res = JSON.parse(response);
                if (!!res.city == false)
                    res.city = 'N/A';

                AdRecord.create({
                    domain : ad_domain,
                    ip : res['ip'],
                    city : res['city'],
                    country : res['country_name'],
                    coordinate : res['latitude'] + ',' + res['longitude']
                }, function(err, adloc) {
                    if (err)
                        console.log('geolocate->database eror: ', err);
                });

            // if JSON parse error... :(
            } catch(err) {
                console.log('parse... ', err);
            }
    	});
    });
    t.on('error', function(error) {
    	console.log('always-tail outfile error: ', error);
    });
};

var init = function() {
    t.watch();
};

module.exports = {
    bind: function(model) {
        return initCallbacks(model);
    },
    watch: function() {
        return init();
    }
};



