Overview 
====
A Python library for the Raspberry Pi (or Beaglebone Black) to drive LPD8806 based RGB light strips
Initial code from: https://github.com/Sh4d/LPD8806

See a demo video here: http://www.youtube.com/watch?v=g5upsgqASiY

Getting Started 
----
First off, you need to enable SPI if it hasn't been already. The easiest way to do this in Raspbian is via raspi-config. At the command line, type:

	sudo raspi-config
	
It will load a menu with a blue background. Arrow down to option 8, "Advanced Options" and hit Enter. Then select option A5 "SPI" and hit Enter again. It will ask you if you want to enable SPI, select yes. Once back to the main menu, select <Finish> and you're done!

Next, wiring your LPD8806 strips.
Connect as follows:

	Pi MOSI -> Strand DI
	Pi SCLK -> Strand CI

Most strips use around 10W per meter (for ~32 LEDs/m) or 2A at 5V.
The Raspberry Pi cannot even come close to this so a larger power supply is required, however, due to voltage loss along long runs you will need to put in a new power supply at least every 5 meters. Technically you can power the Raspberry Pi through the GPIO pins and use the same supply as the strips, but I would recommend just using the USB power as it's a much safer option.

Also, while it *should* work without it to be safe you should add a level converter between the Raspberry Pi and the strip's data lines. This will also help you have longer runs.

In some cases, using py-spidev can have better performance. To install, run the following commands:

	sudo apt-get install python-dev
	git clone https://github.com/doceme/py-spidev.git
	cd py-spidev/
	sudo python setup.py install

Then set the second parameter of LEDStrip to True to enable py-spidev

Assuming your Raspberry Pi has a connection to the internet, run the following. 

    git clone https://github.com/adammhaile/RPi-LPD8806.git
    cd RPi-LPD8806
    python example.py
    
You should see your LED strip run through a number of animations. 

Here is a basic program that will fill the entire strip red

    from LPD8806 import *
    led = LEDStrip(32)
    led.fillRGB(255,0,0)
    led.update()
    
LEDStrip() initializes the class to control the strip and takes the number of LEDs as the argument. The arguments for fillRGB() are Red (0-255), Blue (0-255) and Green (0-255). Finally update() writes the colors out to the strip. The LED strip won't change until update is called (common mistake). 

Animations
----
The library contains a number of animations. Below is a list of animations available.
* Rainbow
* Color Wipe
* Color Chase
* Larson Scanner (Cylon Eye, K.I.T.T)
* Wave
* Color Pattern


More Info
----
Download, extract, then run the help:

    >>> import LPD8806
    >>> help(LPD8806)



* The LPD8806 chip does not seem to really specify in what order the color channels are, so there is a helper function in case yours happen to be different. The most common seems to be GRB order but I have found some strips that use BRG order as well. If yours (like the one's from Adafruit) use GRB order nothing needs to be done as this is the default. But if the channels are swapped call the method setChannelOrder() with the proper ChannelOrder value. Those are the only two I've ever encountered, but if anyone ever encounters another, please let me know so I can add it.
 
* All of the animations are designed to allow you to do other things on the same thread in between frames. So, everytime you want to actually progress the animation, call it's method and then call update() to push the data to the the strip. You could do any other processing on the buffer before pushing the update if needed. Each animation has a step variable that can be manually reset or modified externally. See variables in the __init__ of LEDStrip
 
* If any of the built in animations are not enough you can use any of the set or fill methods to manually manipulate the strip data.
 
 * These strips can get extremely bright (the above video was filmed using 50% brightness) so you can use setMasterBrightness() to set a global level which all output values are multiplied by. This way you don't have to manually modify all of the RGB values to adjust the levels. However, Color takes an optional brightness value so that it can be set on an individual level. Last, if using HSV, you can just set it's "Value" component to adjust the brightness level.
 
* ColorHSV is there for easily fading through a natural color progression. However, all methods take a Color object, so call ColorHSV.getColorRGB() before passing to any of the set, fill, or animation methods.

* If using on a BeagleBond Black be sure to enable spidev via a device tree overlay. Tutorials are found (here)[http://learn.adafruit.com/introduction-to-the-beaglebone-black-device-tree/compiling-an-overlay] and (here)[http://elinux.org/BeagleBone_Black_Enable_SPIDEV]. 