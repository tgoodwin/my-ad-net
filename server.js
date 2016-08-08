//server.js

// set up ==============================
var express		=	require('express');
var app 		=	express();
var mongoose 	= 	require('mongoose'); 		// mehhhh
var morgan 		= 	require('morgan');			// log requests to the console for now
var bodyParser 	= 	require('body-parser');		// pull information from HTML POST
var override 	=	require('method-override'); // simulate DELETE and PUT
var utils 		= 	require('./backend/lookup');		// raspberry pi OS helper code

var db = mongoose.connection;
db.on('error', console.error);
mongoose.connect('mongodb://tgoodwin:ad-map2016@ds011840.mlab.com:11840/ad-map');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(override());

// load the 'AdLoc' model constructor
var AdLoc = require('./backend/models/adloc');
// 
var tailer = require('./backend/tail');
tailer.bind(AdLoc); // pass in our database-connected constructor.
tailer.watch();

var port = process.env.PORT || 8080;
app.listen(port);
console.log('listening on port' + port);

// ---------- ROUTES ----------- //

app.get('/api/geo', function(req, res) {
	AdLoc.find(function (err, result) {
		if (err)
			res.send(err);
		res.json(result);
	});
});

app.get('/api/geo/client', function(req, res) {
	var client_ip = req.ip;
	console.log('client: ', client_ip);
	utils.geolocate(client_ip, function(response) {
		var payload = JSON.parse(response);
		res.json(payload);
	});
})

app.post('/api/todos', function(req, res) {
    // create a todo, information comes from AJAX request from Angular
    Todo.create({
        text : req.body.text,
        done : false
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
	Todo.remove({
		_id : req.params.todo_id
	}, function(err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		Todo.find(function(err, todos) {
			if (err)
				res.send(err)
			res.json(todos);
		});
	});
});

app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

