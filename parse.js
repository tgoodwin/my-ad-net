// parse.js
var sys = require('sys');
var exec = require('child_process').exec;
var tail = require('always-tail');
var filename = '/var/log/pihole.log';

var t = new tail(filename, '\n');
t.on('line', function(data) {
    console.log('got line: ', data);
    //call function to parse line for domain name
});

t.on('error', function(data) {
    console.log('error: ', data);
});

t.watch();

module.exports = {
    parse: function() {
        //stuff
        return true;
    }
};

var other = function() {
    return false;
}

