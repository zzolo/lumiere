/**
 * Main client side logic.
 */
require.config({
  shim: {
    'underscore': {
      exports: '_'
    }
  },
  paths: {
    requirejs: '../bower_components/requirejs/require',
    text: '../bower_components/text/text',
    jquery: '../bower_components/jquery/jquery.min',
    underscore: '../bower_components/underscore/underscore-min',
    io: '/socket.io/socket.io',
    Ractive: '../bower_components/ractive/build/Ractive.min'
  }
});

require(['jquery', 'underscore', 'io', 'Ractive', 'text!../templates/app.ractive'], function($, _, io, Ractive, appTemplate) {
  var socket = io.connect();
  var ractive;
  var tData = { status: 'disconnected' };

  // Create ractive handler
  ractive = new Ractive({
    el: '#template-container',
    template: appTemplate,
    data: tData
  });

  // Update status
  socket.on('status', function(data) {
    ractive.set('status', data);
  });
});