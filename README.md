# Lumière

SMS :arrow_right: web :arrow_right: LED = fun for everyone.

## The basics

A string of LED's is connected to Arduino which is controlled by a Raspberry Pi that looks to the web to figure out what color those LEDs should which is then controlled by SMS or a web interface.  Got it?

## Running web application

The application is a [Meteor](http://www.meteor.com/) application.

1. Install Meteor: `curl https://install.meteor.com | /bin/sh`
1. (for development) Install Meteorite: `npm install -g meteorite`
1. Run locally: `meteor`
1. Deploy to Meteor.com: `meteor deploy <YOUR_APP_NAME>.meteor.com`