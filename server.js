//server.js

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
const Tail = require('always-tail');

const filename = '/home/pi/admap/outfile';
var parser = require('./parse.js');

app.set('port', (process.env.PORT || 3000));
app.use(express.static(path.join(__dirname, 'public/')));

var t = new Tail(filename, '\n');

//socket connection will be established clientside
app.get('/radar', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/map', function(req, res) {
	res.sendFile(path.join(__dirname, 'views/map.html'));
});

//once index.html loads script clientside
io.on('connection', function(socket) {
	//upon line event
	t.on('line', function(data) {
		socket.emit('ad-event', parser.geollocate(data));
	});
	t.on('error', function(error) {
		console.log('tail error: ', error);
	});
	t.watch();

	socket.on('visitor-data', function() {
		console.log('2-way binding proof of concept. client here.');
	});

	//client dips
	socket.on('disconnect', function() {
		//goodbye something
		io.emit('bye-bro', byeBro());
	});
});

function byeBro() {
	return "bye bro!";
}

http.listen(app.get('port'), function() {
  console.log('listening on *:' + app.get('port'));
});