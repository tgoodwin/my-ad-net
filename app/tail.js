//tail module -- raspberry pi OS helper code

/* tail the logfile on the pi. for each tail event, hit a geolocation database and construct
 * an AdLoc model with the returned data.
 * Save this model to the database, that is all. nothing to be 'sent' from this module.
 */

var AdLoc = require('./models/adloc');      // load the AdLoc model.
var Tail = require('always-tail');          // like the UNIX tail command
var util = require('./lookup');              // freegeoip API helper module

var mongoose = require('mongoose');
// mongoose.connect('mongodb://tgoodwin:ad-map2016@ds011840.mlab.com:11840/ad-map');
console.log(!!mongoose.connection + ' that were connected');

// outfile is the pi-hole's logfile grepped for ad-blocked DNS queries
const logfile = '/home/pi/admap/outfile'
var t = new Tail(logfile, '\n');

var initCallbacks = function(model) { // pass in AdLoc mongoose object?
    var AdLoc = model;
    // Tail the pi's DNS query logfile
    t.on('line', function(data) {

        // pluck out IP from logfile entry
    	var ad_domain = util.getIP(data);
    	util.geolocate(ad_domain, function(response) {
            try {
                var res = JSON.parse(response);

                AdLoc.create({
                    domain : ad_domain,
                    ip : res['ip'],
                    city : res['city'],
                    country : res['country'],
                    latf : res['latitude'],
                    lonf : res['longitude']
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



