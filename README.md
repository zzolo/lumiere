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

## Raspberry Pi

### Hook up lights

The following parts are involved, but surely these can be interchanged with your preferred parts.

* [5 meter length of RGB LED strip (the LPD8806 model)](http://www.adafruit.com/products/306)
* [4 pin JST SM plug](http://www.adafruit.com/products/578) used to connect the LED strip to the Arduino board and the power supply.
* [5V 10A power supply](http://www.adafruit.com/products/658) for the Arduino.
* [5V 10A power supply](http://www.adafruit.com/products/658) for the LED strip.
* [Female DC power adaptor](http://www.adafruit.com/products/368) used to connect the LED strip to the power supply.
* A few wires.

Wiring diagram: http://learn.adafruit.com/system/assets/assets/000/001/589/medium800/diagram.png
http://learn.adafruit.com/light-painting-with-raspberry-pi/hardware

### Install software

Note that [RPi-LPD8806](https://github.com/adammhaile/RPi-LPD8806) is included in this repo for ease of use.

1. Enable SPI.
    * `sudo raspi-config`
    * Advanced options; enable SPI.
1. Get code: `git clone https://github.com/zzolo/lumiere.git && cd lumiere`