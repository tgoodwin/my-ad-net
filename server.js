//server.js

const express = require('express');
const app = express();
const bodyParser=  require('body-parser');
const Tail = require('always-tail');
const filename = '/home/pi/admap/outfile';
const MongoClient = require('mongodb').MongoClient;
var parser = require('./parse.js');

var db;
MongoClient.connect('mongodb://tgoodwin:ad-map2016@ds011840.mlab.com:11840/ad-map', function(err, database) {
  if (err) return console.log('database error: ', err);
  db = database;
  app.listen(3000, function() {
	console.log('Database connected. Listening on port 3000');
	});
});

// Tail the pi's DNS query logfile
var t = new Tail(filename, '\n');
t.on('line', function(data) {
	var ad_domain = parser.getIP(data);
	parser.getLocation(ad_domain, function(response) {
            try {
                var res = JSON.parse(response);
                res['domain'] = ad_domain;
                db.collection('radar').save(res, function(err, result) {
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

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
	var cursor = db.collection('radar').find().toArray(function(err, result) {
		if (err) return console.log(err);
		res.render('index.ejs', {locations: result});
	});
});

app.put('/quotes', function(req, res) {
	//handle put request
	db.collection('quotes')
	  .findOneAndUpdate({name: 'Yoda'}, {
	    $set: {
	      name: req.body.name,
	      quote: req.body.quote
	    }
	  }, {
	    sort: {_id: -1},
	    upsert: true
	  }, function(err, result) {
	    if (err)
	    	return res.send(err);
	    res.send(result);
	  });
});

app.post('/quotes', function(req, res) {
  console.log(req.body);
  db.collection('quotes').save(req.body, function(err, result) {
  	if (err)
  		return console.log(err);
  	console.log('saved to database');
  	res.redirect('/');
  });
});

app.delete('/quotes', function(req, res) {
  // Handle delete event here
  db.collection('quotes').findOneAndDelete({name: req.body.name}, 
  function(err, result) {
    if (err)
    	return res.send(500, err);
    res.send('A darth vadar quote got deleted');
  });
});
