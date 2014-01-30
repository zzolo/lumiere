/**
 * Main application logic for Lumiere Meteor app.  This
 * holds the both server and client side code.
 */


// We will use these later
var chroma;


/**
 * Persistant data stores
 */
var Colors = new Meteor.Collection('colors');


/**
 * Shared objects across client and server.
 *
 * Meteor.lumiere.colors comes in from colors.js
 */
Meteor.lumiere = Meteor.lumiere || {};
Meteor.lumiere.LEDs = 32 * 5;
Meteor.lumiere.phone = '+1 651 400 1501';
Meteor.lumiere.lumiereName = 'Lumière';

// Shared methods that should not be called async
Meteor.lumiere.fillColor = function(color) {
  var colors = [];
  var i;

  if (!_.isUndefined(color) && _.isObject(color)) {
    // Repeat colors
    for (i = 0; i < Meteor.lumiere.LEDs; i++) {
      colors.push(color.colors[i % color.colors.length]);
    }

    color.colors = colors;
  }
  return color;
};



/**
 * Client side only
 */
if (Meteor.isClient) {

  /**
   * Template values.  Multiple templates are used
   * as Meteor ends up rerendering everything when
   * one value is updated and can be very slow.
   */

  // Status allows for a simple icon to show if the client
  // is connected to the server
  Template.header.status = function() {
    return Meteor.status().status;
  };

  // The current selection of lights
  Template.lights.current = function() {
    var recent = Colors.find({}, { sort: { timestamp: -1 }, limit: 1 }).fetch()[0];

    if (!_.isUndefined(recent)) {
      recent.input = recent.input.split(',').join(', ');
    }
    return Meteor.lumiere.fillColor(recent);
  };

  // Phone saved here so that it can be managed in
  // one place.
  Template.about.phone = function() {
    return Meteor.lumiere.phone;
  };

  // All those colors!
  Template.input.colorList = function() {
    return Meteor.lumiere.colors;
  };

  // Events handled in the input template.
  Template.input.events({
    'submit .color-input-form': function(e) {
      e.preventDefault();
      var $form = $(e.currentTarget);

      Meteor.call('addColor', $form.find('#color-input-text').val(), function(error, response) {
        if (error) {
          throw new error;
        }
        else {
          $form.find('#color-input-text').val('');
        }
      });
    },
    'click li.color-choice': function(e) {
      e.preventDefault();
      var $color = $(e.currentTarget);
      var $input = $('#color-input-text');
      var current = $input.val().split(',');
      var name = $color.data('name');
      current.push(name);

      current = _.filter(current, function(c) {
        return (!!c);
      });
      $input.val(current.join(','));
    }
  });
}



/**
 * Server side only
 */
if (Meteor.isServer) {
  /**
   * Packages installed via meteroite and meteor-npm.
   */
  chroma = Meteor.require('chroma-js');

  // On startup
  Meteor.startup(function() {
    Meteor.methods({

      // Turn a string into a color
      findColor: function(input) {
        var names = _.pluck(Meteor.lumiere.colors, 'colorName');
        var color = chroma('red');
        var colors = [];
        var found;
        var r;

        // First see if Chroma can handle the input, if that fails
        // do a look up of custom colors, otherwise, just choose
        // one at random
        try {
          color = chroma(input);
          color = color.hex();
        }
        catch (e) {
          found = names.indexOf(input);

          if (found !== -1) {
            color = Meteor.lumiere.colors[found].colors;
          }
          else {
            r = (Math.floor(Math.random() * (_.size(Meteor.lumiere.colors))));
            color = _.values(Meteor.lumiere.colors)[r].colors;
          }
        }

        // Turn values into hex
        if (_.isString(color)) {
          color = chroma(color).hex();
        }
        else if (_.isArray(color)) {
          color.forEach(function(c) {
            colors.push(chroma(c).hex());
          });
          color = colors;
        }

        return color;
      },

      // Turn input into a set of colors
      makeColors: function(input) {
        var colors = [];
        var inputs = [];
        var found;

        _.each(input.trim().split(','), function(c) {
          c = c.trim().replace(/\W/g, '').toLowerCase();
          if (c.length > 0) {
            found = Meteor.call('findColor', c);
            if (_.isString(found)) {
              colors.push(found);
            }
            else if (_.isArray(found)) {
              found.forEach(function(f) {
                colors.push(f);
              });
            }

            inputs.push(c);
          }
        });

        return {
          input: inputs.join(','),
          colors: colors
        };
      },

      // Save colors to data-store
      saveColors: function(input, colors) {
        Colors.insert({
          timestamp: (new Date()).getTime(),
          input: input,
          colors: colors
        });
      },

      // Wrapper for make and save
      addColor: function(input) {
        var colors = Meteor.call('makeColors', input);

        if (colors.colors.length > 0) {
          Meteor.call('saveColors', colors.input, colors.colors);
        }
      }
    });
  });



  /**
   * Routing for other parts of the application.
   * mrt add router
   */

  // Routing for text input.  Can test locally with something like:
  // curl --data "Body=blue" -X POST http://localhost:3000/incoming
  Meteor.Router.add('/incoming', 'POST', function() {
    // Example input from Twilio
    /*
    { AccountSid: 'XXXXXX',
    MessageSid: 'XXXXXX',
    Body: 'green',
    ToZip: '55045',
    ToCity: 'LINDSTROM',
    FromState: 'GA',
    ToState: 'MN',
    SmsSid: 'XXXXXXX',
    To: '+16514001501',
    ToCountry: 'US',
    FromCountry: 'US',
    SmsMessageSid: 'XXXXX',
    ApiVersion: '2010-04-01',
    FromCity: 'ATLANTA',
    SmsStatus: 'received',
    NumMedia: '0',
    From: '+177059XXXXX',
    FromZip: '30354' }
    */

    // Should return a TwiML document.
    // https://www.twilio.com/docs/api/twiml
    if (this.request.body && this.request.body.Body) {
      Meteor.call('addColor', this.request.body.Body);
    }

    // Return some TwiML
    return [
      200,
      { 'content-type': 'text/xml' },
      '<?xml version="1.0" encoding="UTF-8" ?> <Response> <Sms>Thank you for your input; your color should show up in a few seconds.  - ' + Meteor.lumiere.lumiereName + '</Sms> </Response>'
    ];
  });

  // Routing for color api output
  Meteor.Router.add('/outgoing', 'GET', function() {
    var color = Colors.find({}, { sort: { timestamp: -1 }}).fetch()[0];
    return [
      200,
      {
        'content-type': 'application/json',
        'document-id': color._id
      },
      JSON.stringify(color)
    ];
  });
}
