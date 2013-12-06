#!/usr/bin/python

from time import sleep
import time
from LPD8806 import *

num = 36*5*2;
led = LEDStrip(num, False)
led.setChannelOrder(ChannelOrder.BRG)

print '\nUsing file.open'
t1 = time.time()
led.fillRGB(255, 0, 0)
led.update()
t2 = time.time()
ms = (t2-t1)*1000.0
print '%0.3f ms' % ms
print '%0.2f fps' % (1000.0/ms)

t1 = time.time()
led.fillRGB(0, 255, 0)
led.update()
t2 = time.time()
ms = (t2-t1)*1000.0
print '%0.3f ms' % ms
print '%0.2f fps' % (1000.0/ms)

t1 = time.time()
led.fillRGB(0, 0, 255)
led.update()
t2 = time.time()
ms = (t2-t1)*1000.0
print '%0.3f ms' % ms
print '%0.2f fps' % (1000.0/ms)

led.all_off()

led = LEDStrip(num, True)
led.setChannelOrder(ChannelOrder.BRG)

print '\nUsing py-spidev'
t1 = time.time()
led.fillRGB(255, 0, 0)
led.update()
t2 = time.time()
ms = (t2-t1)*1000.0
print '%0.3f ms' % ms
print '%0.2f fps' % (1000.0/ms)

t1 = time.time()
led.fillRGB(0, 255, 0)
led.update()
t2 = time.time()
ms = (t2-t1)*1000.0
print '%0.3f ms' % ms
print '%0.2f fps' % (1000.0/ms)

t1 = time.time()
led.fillRGB(0, 0, 255)
led.update()
t2 = time.time()
ms = (t2-t1)*1000.0
print '%0.3f ms' % ms
print '%0.2f fps' % (1000.0/ms)

led.all_off()


