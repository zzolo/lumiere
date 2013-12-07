/**
 * Colors!
 *
 * Colors can be a string name or an array of chroma-compatible strings.
 */
var chroma = Meteor.require('chroma-js');
var colors = _.clone(chroma.colors);

colors = _.extend(colors, {
  rainbow: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
  doublerainbow: [
    'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet',
    chroma('red').desaturate().desaturate().hex(),
    chroma('orange').desaturate().desaturate().hex(),
    chroma('yellow').desaturate().desaturate().hex(),
    chroma('green').desaturate().desaturate().hex(),
    chroma('blue').desaturate().desaturate().hex(),
    chroma('indigo').desaturate().desaturate().hex(),
    chroma('violet').desaturate().desaturate().hex()
  ]
});

Meteor.lumiere = Meteor.lumiere || {};
Meteor.lumiere.colors = colors;