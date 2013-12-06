from RPi_LPD8806 import LPD8806

led = LPD8806.LEDStrip(32 * 5)
led.fillRGB(255,0,0)
led.update()