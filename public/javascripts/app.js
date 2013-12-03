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
    Ractive: '../bower_components/ractive/build/Ractive.min',
    Raphael: '../bower_components/raphael/raphael-min'
  }
});

require(['jquery', 'underscore', 'io', 'Ractive', 'Raphael', 'text!../templates/app.ractive', ], function($, _, io, Ractive, Raphael, appTemplate) {
  var socket = io.connect();
  var RactiveLumiere;
  var ractive;
  var tData = { status: 'disconnected' };

  // Create ractive extension
  RactiveLumiere = Ractive.extend({
    init: function() {
      this.makeCanvas();

      // Make sure the form doen't submit
      $(this.el).find('form').on('submit', function(e) {
        e.preventDefault();
      });

      // Handle save
      this.on('saveColor', function() {
        socket.emit('color', { color: this.get('colorInputText') });
      });
    },

    // Make initial canvas
    makeCanvas: function() {
      var offsetH = 15;
      var h = $(this.el).find('.color-output-container').height() - offsetH;
      var w = $(this.el).find('.color-output-wrapper').width();

      this.set('canvasH', h);
      this.set('canvasW', w);

      this.canvas = Raphael('colour-output-canvas', w, h);
      this.canvas.customObjects = {};
      this.canvas.customObjects.rect = this.canvas.rect(0, offsetH, w, h)
        .attr({ 'stroke-width': 0, fill: '#FBFBFB' });
    }
  });

  // Create ractive handler
  ractive = new RactiveLumiere({
    el: '#template-container',
    template: appTemplate,
    data: tData
  });

  // Update status
  socket.on('status', function(data) {
    ractive.set('status', data);
  });
});