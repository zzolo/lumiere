#!/usr/bin/python

from time import sleep
from LPD8806 import *
from animation import *

import os.path
import sys

# Check that the system is set up like we want it
dev = '/dev/spidev0.0'

if not os.path.exists(dev):
    sys.stderr.write("""
The SPI device /dev/spidev0.0 does not exist. You may need to load
the appropriate kernel modules. Try:

sudo modprobe spi_bcm2708 ; sudo modprobe spidev

You may also need to unblacklist the spi_bcm2708 module in 
/etc/modprobe.d/raspi-blacklist.conf

""")
    sys.exit(2)

#permissions check
try:
    open(dev)
except IOError as  e:
    if e.errno == 13:
        sys.stderr.write("""
It looks like SPI device /dev/spidev0.0 has the wrong permissions.
Try making it world writable:

sudo chmod a+rw /dev/spidev0.0

""")
    sys.exit(2)



num = 36*5*2;
led = LEDStrip(num)
led.setChannelOrder(ChannelOrder.BRG) #Only use this if your strip does not use the GRB order
#led.setMasterBrightness(0.5) #use this to set the overall max brightness of the strip
led.all_off()

colors = [
    color_hex('ff0000'),
    color_hex('ff000088'),
    color_hex('ff000044'),

    color_hex('00ff00'),
    color_hex('00ff0088'),
    color_hex('00ff0044'),

    color_hex('0000ff'),
    color_hex('0000ff88'),
    color_hex('0000ff44'),
]

anim = ColorPattern(led, colors, 1)
anim.run(None, led.leds/4)

anim = ColorPattern(led, colors, 1, False)
anim.run(None, led.leds/4)

colors = [
    SysColors.orange,
    Color(130, 0, 130)
]

anim = ColorPattern(led, colors, 3)
anim.run(None, led.leds/4)

colors = [
    Color(255, 0, 0),
    Color(0, 255, 0),
    Color(0, 0, 255),
    Color(255, 255, 255),
]

anim = ColorPattern(led, colors, 3)
anim.run(None, led.leds/4)

colors = [
    SysColors.red,
    SysColors.orange,
    SysColors.yellow,
    SysColors.green,
    SysColors.blue,
    SysColors.indigo,
    SysColors.violet
]

anim = ColorPattern(led, colors, 2)
anim.run(None, led.leds/2)

led.all_off();

