
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
var server;
var io;

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

// Set up server with socket.io
server = app.listen(app.get('port'));
io = require('socket.io').listen(server);

// Socket connect handling
io.sockets.on('connection', function(socket) {
  socket.emit('status', 'connected');
});

// Route handling
app.get('/', routes.index);

// Run server
console.log('Express server listening on port ' + app.get('port'));
