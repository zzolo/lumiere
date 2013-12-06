#!/usr/bin/python

from time import sleep
from LPD8806 import *

num = 36*5*2;
led = LEDStrip(num)
led.setChannelOrder(ChannelOrder.BRG)
led.all_off()


