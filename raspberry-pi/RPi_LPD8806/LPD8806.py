#!/usr/bin/env python
from color import Color, ColorHSV

"""
LPD8806.py: Raspberry Pi library for LPD8806 based RGB light strips
Initial code from: https://github.com/Sh4d/LPD8806

Provides the ability to drive a LPD8806 based strand of RGB leds from the
Raspberry Pi

Colors are provided as RGB and converted internally to the strip's 7 bit
values.


Wiring:
    Pi MOSI -> Strand DI
    Pi SCLK -> Strand CI

Most strips use around 10W per meter (for ~32 LEDs/m) or 2A at 5V.
The Raspberry Pi cannot even come close to this so a larger power supply is required, however, due to voltage loss along long runs you will need to put in a new power supply at least every 5 meters. Technically you can power the Raspberry Pi through the GPIO pins and use the same supply as the strips, but I would recommend just using the USB power as it's a much safer option.

Also, while it *should* work without it to be safe you should add a level converter between the Raspberry Pi and the strip's data lines. This will also help you have longer runs.

Example:
    >> import LPD8806
    >> led = LPD8806.LEDStrip()
    >> led.fill(255, 0, 0)
"""

#Not all LPD8806 strands are created equal.
#Some, like Adafruit's use GRB order and the other common order is GRB
#Library defaults to GRB but you can call strand.setChannelOrder(ChannelOrder) 
#to set the order your strands use
class ChannelOrder:
    RGB = [0,1,2] #Probably not used, here for clarity
    
    GRB = [1,0,2] #Strands from Adafruit and some others (default)
    BRG = [1,2,0] #Strands from many other manufacturers
        

class LEDStrip:

    def __init__(self, leds, use_py_spi = False, dev="/dev/spidev0.0"):
        #Variables:
        #	leds -- strand size
        #	dev -- spi device
        
        self.c_order = ChannelOrder.GRB
        self.dev = dev
        self.use_py_spi = use_py_spi
        self.leds = leds
        self.lastIndex = self.leds - 1
        self.gamma = bytearray(256)
        self.buffer = [0 for x in range(self.leds + 1)]

        if self.use_py_spi:
            import spidev
            self.spi = spidev.SpiDev()
            self.spi.open(0,0)
            self.spi.max_speed_hz = 12000000
            print 'py-spidev MHz: %d' % (self.spi.max_speed_hz / 1000000.0 )
        else:
            self.spi = open(self.dev, "wb")

        
        self.masterBrightness = 1.0

        for led in range(self.leds):
            self.buffer[led] = bytearray(3)
        for i in range(256):
            # Color calculations from
            # http://learn.adafruit.com/light-painting-with-raspberry-pi
            self.gamma[i] = 0x80 | int(
                pow(float(i) / 255.0, 2.5) * 127.0 + 0.5
            )

    #Allows for easily using LED strands with different channel orders
    def setChannelOrder(self, order):
        self.c_order = order
    
    #Set the master brightness for the LEDs 0.0 - 1.0
    def setMasterBrightness(self, bright):
        if(bright > 1.0 or bright < 0.0):
            raise ValueError('Brightness must be between 0.0 and 1.0')
        self.masterBrightness = bright
        
    #Push new data to strand
    def update(self):
        if self.use_py_spi:
            for x in range(self.leds):
                self.spi.xfer2([i for i in self.buffer[x]])
                
            self.spi.xfer2([0x00,0x00,0x00]) #zero fill the last to prevent stray colors at the end
            self.spi.xfer2([0x00]) #once more with feeling - this helps :)
        else:
            for x in range(self.leds):
                self.spi.write(self.buffer[x])
                self.spi.flush()
            #seems that the more lights we have the more you have to push zeros
            #not 100% sure why this is yet, but it seems to work
            self.spi.write(bytearray(b'\x00\x00\x00')) #zero fill the last to prevent stray colors at the end
            self.spi.flush()
            self.spi.write(bytearray(b'\x00\x00\x00'))
            self.spi.flush()
            self.spi.write(bytearray(b'\x00\x00\x00'))
            self.spi.flush()
            self.spi.write(bytearray(b'\x00\x00\x00'))
            self.spi.flush()
        
    #Fill the strand (or a subset) with a single color using a Color object
    def fill(self, color, start=0, end=0):
        if start < 0:
            start = 0
        if end == 0 or end > self.lastIndex:
            end = self.lastIndex
        for led in range(start, end + 1): #since 0-index include end in range
            self.__set_internal(led, color)

    #Fill the strand (or a subset) with a single color using RGB values
    def fillRGB(self, r, g, b, start=0, end=0):
        self.fill(Color(r, g, b), start, end)
        
    #Fill the strand (or a subset) with a single color using HSV values
    def fillHSV(self, h, s, v, start=0, end=0):
        self.fill(ColorHSV(h, s, v).get_color_rgb(), start, end)

    #Fill the strand (or a subset) with a single color using a Hue value. 
    #Saturation and Value components of HSV are set to max.
    def fillHue(self, hue, start=0, end=0):
        self.fill(ColorHSV(hue).get_color_rgb(), start, end)
        
    def fillOff(self, start=0, end=0):
        self.fillRGB(0, 0, 0, start, end)

    #internal use only. sets pixel color
    def __set_internal(self, pixel, color):
        if(pixel < 0 or pixel > self.lastIndex):
            return; #don't go out of bounds

        self.buffer[pixel][self.c_order[0]] = self.gamma[int(color.r * self.masterBrightness)]
        self.buffer[pixel][self.c_order[1]] = self.gamma[int(color.g * self.masterBrightness)]
        self.buffer[pixel][self.c_order[2]] = self.gamma[int(color.b * self.masterBrightness)]

    #Set single pixel to Color value
    def set(self, pixel, color):
        self.__set_internal(pixel, color)

    #Set single pixel to RGB value
    def setRGB(self, pixel, r, g, b):
        color = Color(r, g, b)
        self.set(pixel, color)
        
    #Set single pixel to HSV value
    def setHSV(self, pixel, h, s, v):
        self.set(pixel, ColorHSV(h, s, v).get_color_rgb())

    #Set single pixel to Hue value.
    #Saturation and Value components of HSV are set to max.
    def setHue(self, pixel, hue):
        self.set(pixel, ColorHSV(hue).get_color_rgb())
        
    #turns off the desired pixel
    def setOff(self, pixel):
        self.setRGB(pixel, 0, 0, 0)

    #Turn all LEDs off.
    def all_off(self):
        self.fillOff()
        self.update()
        self.fillOff()
        self.update()

