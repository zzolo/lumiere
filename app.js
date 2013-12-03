
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var Redis = require('redis-url');
var chroma = require('chroma-js');
var app = express();
var server;
var io;
var redis;

// DB connection
redis = Redis.connect(process.env.REDISTOGO_URL)

// All environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser(process.env.SECRET_COOKIE || 'mmmmmmm.cookie'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Make colors from input
function makeColors(input) {
  var colors = [];
  var color;

  // See if we can make a color
  try {
    input = input.trim();
    input.split(' ');
    color = chroma(input.split(' ')[0]);
    colors.push(color);
  }
  catch (e) {
    console.log('Error parsing color: ' + e);
  }

  return colors;
}

// Save colors to queue
function saveColors(colors) {

}

// Set up server with socket.io
server = app.listen(app.get('port'));
io = require('socket.io').listen(server);

// Socket connect handling
io.sockets.on('connection', function(socket) {
  socket.emit('status', 'connected');

  // Color input saving via sockets
  socket.on('color', function(data) {
    saveColors(makeColors(data.color));
  });
});

// Route handling
app.get('/', routes.index);

// Run server
console.log('Express server listening on port ' + app.get('port'));
