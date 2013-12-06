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



num = 32;
led = LEDStrip(num)
#led.setChannelOrder(ChannelOrder.BRG) #Only use this if your strip does not use the GRB order
#led.setMasterBrightness(0.5) #use this to set the overall max brightness of the strip
led.all_off()

#setup colors to loop through for fade
colors = [
	(255.0,0.0,0.0),
	(0.0,255.0,0.0),
	(0.0,0.0,255.0),
	(255.0,255.0,255.0),
]

step = 0.01
for c in range(4):
	r, g, b = colors[c]
	level = 0.01
	dir = step
	while level >= 0.0:
		led.fill(Color(r, g, b, level))
		led.update()
		if(level >= 0.99):
			dir = -step
		level += dir
		#sleep(0.005)

led.all_off()

#animations - each animation method moves the animation forward one step on each call
#after each step, call update() to push it to the LED strip
#sin wave animations
anim = Wave(led, Color(255, 0, 0), 4)
for i in range(led.lastIndex):
	anim.step()
	led.update()
	#sleep(0.15)

anim = Wave(led, Color(0, 0, 100), 2)
for i in range(led.lastIndex):
	anim.step()
	led.update()
	#sleep(0.15)


#rolling rainbow
anim = Rainbow(led)
for i in range(384):
	anim.step()
	led.update()

led.fillOff()

#evenly distributed rainbow
anim = RainbowCycle(led)
for i in range(384*2):
	anim.step()
	led.update()

led.fillOff()

#setup colors for wipe and chase
colors = [
	Color(255, 0, 0),
	Color(0, 255, 0),
	Color(0, 0, 255),
	Color(255, 255, 255),
]

for c in range(4):
	anim = ColorWipe(led, colors[c])

	for i in range(num):
		anim.step()
		led.update()
		#sleep(0.03)

led.fillOff()

for c in range(4):
	anim = ColorChase(led, colors[c])

	for i in range(num):
		anim.step()
		led.update()
		#sleep(0.03)

led.fillOff()

#scanner: single color and changing color
anim = LarsonScanner(led, Color(255, 0, 0))
for i in range(led.lastIndex*4):
	anim.step()
	led.update()
	#sleep(0.03)

led.fillOff()

anim = LarsonRainbow(led, 2, 0.5)
for i in range(led.lastIndex*4):
	anim.step()
	led.update()
	#sleep(0.03)

led.all_off()



