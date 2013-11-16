# Lumière

SMS :arrow_right: web :arrow_right: LED = fun for everyone.

## The basics

A string of LED's is connected to Arduino which is controlled by a Raspberry Pi that looks to the web to figure out what color those LEDs should which is then controlled by SMS or a web interface.  Got it?

*Right now these are just notes as I build it*

## Arduino

The following parts are involved, but surely these can be interchanged with your preferred parts.

* [Arduino Uno](http://arduino.cc/en/Main/arduinoBoardUno)
* [5 meter length of RGB LED strip (the LPD8806 model)](http://www.adafruit.com/products/306)
* [4 pin JST SM plug](http://www.adafruit.com/products/578) used to connect the LED strip to the Arduino board and the power supply.
* [5V 10A power supply](http://www.adafruit.com/products/658) for the Arduino.
* [5V 10A power supply](http://www.adafruit.com/products/658) for the LED strip.
* [Female DC power adaptor](http://www.adafruit.com/products/368) used to connect the LED strip to the power supply.
* A few wires.

### Putting it together

I was fortunate to get a strip that had the [appropriate end hooked up](http://learn.adafruit.com/digital-led-strip/wiring), but either way if you purchase the JST SM plug, you can just use the other side as that specific set comes with both JST plugs.  Wire it up according to [these directions](http://learn.adafruit.com/digital-led-strip/wiring).

### Test

1. Get the [LPD8806 library](https://github.com/adafruit/LPD8806) and put it in your Arduino libraries folder, usually in your Documents folder.
1. Upload the test script under `arduino/led-test.pde` to the Arduino to make sure all is working correctly.  Alter the `nLEDs` variable to be `32 * <how many meters your have>`.
