// author: tim goodwin, timg.goodwin@gmail.com

// set up ==============================
var express		=	require('express');
var app 		=	express();
var mongoose 	= 	require('mongoose'); 			// mehhhh
var morgan 		= 	require('morgan');				// log requests to the console for now
var bodyParser 	= 	require('body-parser');			// pull information from HTML POST
var override 	=	require('method-override'); 	// simulate DELETE and PUT
var utils 		= 	require('./backend/lookup');	// raspberry pi OS helper code

var db = mongoose.connection;
db.on('error', console.error);
mongoose.connect('mongodb://tgoodwin:ad-map2016@ds011840.mlab.com:11840/ad-map');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(override());

var AdRecord = require('./backend/models/adrecord');

var tailer = require('./backend/tail');
tailer.bind(AdRecord); // pass in my database-connected constructor.
tailer.watch();

var port = process.env.PORT || 8080;
app.listen(port);
console.log('listening on port' + port);

// GLOBALS
var totalAds, uniqueLocations, totalServers;
var globalCounter = {};

// download all data that raspberry pi has sent to the cloud
var update = function() {
	AdRecord.find(function(err, result) {
		if (err)
			console.log('AdRecord error: ', err);
		totalAds = result.length;
		uniqueLocations = getUnique(result, 'coordinate', globalCounter);
		totalServers = getUnique(result, 'ip').length;
	});
}
update();

// ---------- ROUTES ----------- //
app.get('/api/geo', function(req, res) {
	res.json(uniqueLocations);
});

app.get('/api/stats', function(req, res) {
	res.json({
		'adsPerLocation': globalCounter,
		'totalAds': totalAds,
		'totalServers': totalServers,
		'totalLocations':  uniqueLocations ? uniqueLocations.length : null
	});
});

// AdLoc.distinct('ip').exec(function(err, result) {
// 	totalServers = result.length;
// });
// AdLoc.distinct('coordinate').exec(function(err, result) {
// 	totalLocations = result.length;
// });

app.get('/api/geo/client', function(req, res) {
	var client_ip = req.ip;
	console.log('client connection: ', client_ip);
	utils.geolocate(client_ip, function(response) {
		var payload = JSON.parse(response);
		res.json(payload);
	});
});

app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

// UTILS --------------

var getUnique = function(array, key, unique) {
	if (!!unique == false)
		unique = {};
	var output = [];
	array.forEach(function(object) {
		if(!!unique[object[key]] == false) {
			output.push(object);
			unique[object[key]] = 1;
		} else {
			unique[object[key]] += 1;
		}
	});
	return output;
}

