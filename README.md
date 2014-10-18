**DO NOT USE.  This project has been broken into multiple projects and moved to the [github.com/lumiere-lighting](https://github.com/lumiere-lighting) org**.

# Lumière

SMS :arrow_right: web :arrow_right: Raspberry Pi :arrow_right: LEDs = fun for everyone.  :traffic_light:

## The basics

Lumière is an experiment (read as it might break) in holiday lighting and community engagement.  Lumière invites anyone to change the colors of our external, holiday lights either through a website or with SMS/texting.

There are over 1,500 color words and sets.  Color words are a combination of [Chroma.js](https://github.com/gka/chroma.js/blob/master/src/colors/w3cx11.coffee), [Name that Color](https://github.com/gka/chroma.js/blob/master/src/colors/colorbrewer.coffee), and some custom ones.  Feel free to [suggest](https://github.com/zzolo/lumiere/issues) some more.

Web example at [lumiere.meteor.com](http://lumiere.meteor.com).  Watch a [video of an example deployment](https://www.youtube.com/watch?v=_k-bI2xsQ-s).

Inspiration taken from [textmas](https://github.com/emilyville/textmas).

## Architecture

1. Server
    * A Meteor application is run that keeps track of what color(s) the lights should be.
    * Provides a web interface for choosing colors and basic representation of current colors.
    * Accepts input via SMS.
1. Nodes
    * Each individual node checks to see what color the lights should be and changes them accordingly.
    * Each node is an internet-enable Raspberry Pi with a string of programmable LED lights connected to it.

The "easiest" way to get up and running would be to just make another node that hooks up to the default [lumiere.meteor.com](http://lumiere.meteor.com) and syncs colors with others.  This involves obtaining hardware ($$) and installing some software on the Raspberry Pi.

## Deploying a node

A node by default will listen to the deployed [lumiere.meteor.com](http://lumiere.meteor.com) and therefore all the nodes connected to it will be the same color.  See below for deploying a server if you want to manage colors independently.

### Get a Raspberry Pi

A [Raspberry Pi](http://www.raspberrypi.org/) is a small computer.  [Adafruit](http://www.adafruit.com/category/105) is a good place to purchase one.  Set it up and make sure it can connect to the internet and you have command line access to it.  Depending on where you want your lights, you may want to look into setting up wireless network access for the Raspberry Pi.

### Hook up lights

I used a [5 meter length of RGB LED strip (the LPD8806 model)](http://www.adafruit.com/products/306) to do this project, but you could do other things if you wanted to change the code for the Raspberry Pi a bit.  Also note that my hardware skills are not very good, so how to hook things up could probably be improved.

In short, I used this diagram (from [adafruit](http://learn.adafruit.com/light-painting-with-raspberry-pi/hardware)) to hook up the lights to the Raspberry Pi and share the power between the two.

![Raspberry Pi to LDP8806 diagram](https://raw.github.com/zzolo/lumiere/master/public/adafruit-raspberry-pi-ldp8806-diagram.png)

#### Details

The following parts are involved, but surely these can be interchanged with your preferred parts.

* [5 meter length of RGB LED strip (the LPD8806 model)](http://www.adafruit.com/products/306).  If you get 5 meters of these LEDs they come with the JST input and output connected, otherwise, you may have to solder wires to the end in order to connect to the Raspberry Pi.  Also, people have reported that the input and output may not be what you expect so double check which end you connect to.
    * It is very important that you read [this tutorial](http://learn.adafruit.com/digital-led-strip/wiring) to know the intricacies of this LED strip.
* [4 pin JST SM plug](http://www.adafruit.com/products/578) used to connect the LED strip to other wires.  If you have a LED strip with a JST end, this will make it easy to disconnect things.
* [5V 10A power supply](http://www.adafruit.com/products/658).  The above LED strip can only handle 5V so don't use more.
* [Female DC power adaptor](http://www.adafruit.com/products/368) used to connect the LED strip and Raspberry Pi to the power supply.  For those of us that don't know about these things that well, the `-` should be connected to ground and `+` to the 5V power.
* Some [prototyping wires](http://www.instructables.com/id/Protobloc-prototyping-wires/).
* [4 wire caps](http://en.wikipedia.org/wiki/Twist-on_wire_connector) to connect the JST strand wires to the prototype wires which are solid wires.
* [2 snap action wire blocks to split the power](http://www.adafruit.com/products/866).
* [Cobbler breakout](http://www.adafruit.com/products/914) this is used to connect the Raspberry Pi GPIO to the breadboard.  Note that the ribbon cable came connected but not in a way that was intuitive to me and I ended up breaking things, so double check that the breakout board is aligned correctly with the GPIO diagram.
* [Breadboard](http://www.adafruit.com/products/64).

There is a good example of you might hook up the light efficiently at [this tutorial](http://learn.adafruit.com/light-painting-with-raspberry-pi/hardware).

Here is an image of my near final configuration:

![Near-final project](https://raw.github.com/zzolo/lumiere/master/public/near-final.jpg)

### Install software

(coming soon) Download this Raspberry Pi image, burn it to a SD card and insert into your Raspberry Pi.

#### Install python code

This script needs to be run as a user that has root priviledges as it needs access to the GPIO pins.  The default `pi` user will work fine.

1. Enable SPI.
    * `sudo raspi-config`
    * Go to `Advanced options` and `enable SPI`.
1. Install python dev tools.  [Reference](http://raspberry.io/wiki/how-to-get-python-on-your-raspberrypi/).
    1. `sudo apt-get install python-dev`
    1. `curl -O http://python-distribute.org/distribute_setup.py`
    1. `sudo python distribute_setup.py`
    1. `curl -O https://raw.github.com/pypa/pip/master/contrib/get-pip.py`
    1. `sudo python get-pip.py`
1. Get code: `git clone https://github.com/zzolo/lumiere.git && cd lumiere`
1. Install Python packages: `sudo pip install -r requirements.txt`
1. Run manually with `python raspberry-pi/lumiere.py`

#### Auto start (optional)

This adds an [Upstart](http://en.wikipedia.org/wiki/Upstart) script so that the light script is run automatically on start up and restarts if something goes wrong.

1. Install Upstart: `sudo apt-get install upstart`
1. Link the Upstart script in to init: `sudo cp /home/pi/lumiere/raspberry-pi/lumiere.upstart /etc/init/lumiere.conf && sudo chmod +x /etc/init/lumiere.conf`
1. Restart the Pi: `sudo shutdown -r now`
    * It should start automatically, but you can control the process manually with: `sudo service lumiere start|restart|status|stop`

#### Auto turn off (optional)

If you want to turn off the Raspberry Pi at a specific time, add the following line to cron.  Note that this will not actually turn off the lights or stop power going to the Raspberry Pi, but simply shuts it down so that power can be disconnected.  I am using this with an outlet timer that turns off a bit after the cron shutdown runs.

1. This adds a line to the crontab to shutodwn at `2:45 AM`: `(sudo crontab -l ; echo "45 2 * * * shutdown -h now") | sudo crontab -`
    * If you don't have a crontab for root yet, then you will get a message like `no crontab for root` which is fine.

## Deploying a new server

Though these instructions are detailed, the code has not been abstracted to where configuration lives outside the code, so deploying means changing (just a few) values in code.

### Set up SMS phone number

These instructions are for using Twilio, but it would not be too hard to change things around for another SMS service.

1. Create an account at Twilio.
1. Obtain a [phone number](https://www.twilio.com/user/account/phone-numbers) or use an existing one if you already have one set up.
1. Under the settings for that phone number, set the Messaging POST value to `http://<YOUR_APP_NAME>.meteor.com/incoming`.
1. There is no real set up for the web application part, but the application displays the phone number so you may want to update that.

### Create web server

The application is a [Meteor](http://www.meteor.com/) application, and to note, my first Meteor application.

1. Install Meteor: `curl https://install.meteor.com | /bin/sh`
1. (for development) Install Meteorite: `npm install -g meteorite`
1. Run locally: `meteor`
1. Deploy to Meteor.com: `meteor deploy <YOUR_APP_NAME>.meteor.com`

### Create a node

See above for deploying a node.  You will just have to change the URL so that it points at your new server, `<YOUR_APP_NAME>.meteor.com`.
