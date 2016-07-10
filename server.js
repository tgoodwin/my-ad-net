const express = require('express');
const app = express();
const bodyParser=  require('body-parser');
const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect('mongodb://tgoodwin:ad-map2016@ds011840.mlab.com:11840/ad-map', function(err, database) {
  // ... start the server
  if (err) return console.log(err);
  db = database;
  app.listen(3000, function() {
	console.log('Listening on port 3000');
	});
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
	var cursor = db.collection('quotes').find().toArray(function(err, result) {
		if (err) return console.log(err);
		res.render('index.ejs', {quotes: result});
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

app.post('/quotes', (req, res) => {
  console.log(req.body);
  db.collection('quotes').save(req.body, function(err, result) {
  	if (err) return console.log(err);
  	console.log('saved to database');
  	res.redirect('/');
  });
});