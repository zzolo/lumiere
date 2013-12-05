/**
 * Main application logic for Lumiere Meteor app.
 */

// Top level objects
var LEDs = 32 * 5;
var phone = '16514001501';
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
    return Colors.find({}, { sort: { timestamp: -1 }}).fetch();
  };

  Template.application.current = function() {
    var recent = Colors.find({}, { sort: { timestamp: -1 }}).fetch()[0];
    var colors = [];
    var i;

    if (!_.isUndefined(recent) && _.isObject(recent)) {
      // Repeat colors
      for (i = 0; i < LEDs; i++) {
        colors.push(recent.colors[i % recent.colors.length]);
      }
    }
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
        var r;

        try {
          color = chroma(input);
        }
        catch (e) {
          // Could not find color, so use a random chroma one
          r = (Math.floor(Math.random() * (_.size(chroma.colors))));
          color = chroma(_.values(chroma.colors)[r]);
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
      '<?xml version="1.0" encoding="UTF-8" ?> <Response> <Sms>Thank you for your input; your color should show up shortly.  - Lumiere</Sms> </Response>'
    ];
  });

  // Routing for color api output
  Meteor.Router.add('/outgoing', 'GET', function() {
    return [
      200,
      { 'content-type': 'application/json' },
      JSON.stringify(Colors.find({}, { sort: { timestamp: -1 }}).fetch())
    ];
  });
}
