/**
 * Main application logic for Lumiere Meteor app.
 */

// Top level objects
var LEDs = 32 * 5;
var Colors = new Meteor.Collection('colors');
var chroma;

/**
 * Client side only
 */
if (Meteor.isClient) {
  Template.application.status = function() {
    return Meteor.status().status;
  };

  Template.application.queue = function() {
    return Colors.find({}, { sort: { timestamp: 1 }}).fetch();
  };

  Template.application.current = function() {
    var recent = Colors.find({}, { sort: { timestamp: 1 }}).fetch()[0];
    var colors = [];
    var i;

    if (!_.isUndefined(recent) && _.isObject(recent)) {
      // Repeat colors
      for (i = 0; i < LEDs; i++) {
        colors.push(recent.colors[i % recent.colors.length]);
      }
    }
    console.log(colors);
    return colors;
  };

  Template.application.events({
    'submit .color-input-form': function(e) {
      e.preventDefault();
      var $form = $(e.target);

      Meteor.call('addColor', $form.find('#color-input-text').val(), function(error, response) {
        if (error) {
          throw new error;
        }
      });
    }
  });
}

/**
 * Server side only
 */
if (Meteor.isServer) {
  // Packages
  chroma = Meteor.require('chroma-js');

  // On startup
  Meteor.startup(function() {
    Meteor.methods({
      // Turn a string into a color
      findColor: function(input) {
        var color = chroma('red');

        try {
          color = chroma(input);
        }
        catch (e) {
          // Could not find color
          color = chroma('red');
        }

        return {
          hex: color.hex(),
          rgb: color.rgb()
        };
      },

      // Turn input into a set of colors
      makeColors: function(input) {
        var colors = [];

        _.each(input.trim().split(' '), function(c) {
          if (c.length > 0) {
            colors.push(Meteor.call('findColor', c));
          }
        });

        return colors;
      },

      // Save colors
      saveColors: function(colors) {
        Colors.insert({
          timestamp: (new Date()).getTime(),
          colors: colors
        });
      },

      // Wrapper for make and save
      addColor: function(input) {
        var colors = Meteor.call('makeColors', input);

        if (colors.length > 0) {
          Meteor.call('saveColors', colors);
        }
      }
    });
  });
}
