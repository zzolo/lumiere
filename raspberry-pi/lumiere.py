from raspledstrip import *
import requests
import json
import time
import sys


# Things that should be configurable
ledCount = 32 * 5
api = 'http://lumiere.meteor.com/'
waitTime = 6

class Lumiere:
  """
  Class to handle getting light information.
  """

  def __init__(self):
    """
    Constructor.
    """
    self.ledCount = ledCount
    self.base_url = api
    self.currentID = None
    self.ledArray = []
    self.waitTime = waitTime

    self.led = LEDStrip(ledCount)
    self.led.setOff()


  def listen(self):
    """
    Handles the continual checking.
    """
    while True:
      try:
        self.queryLights()
        time.sleep(self.waitTime)
      except (KeyboardInterrupt, SystemExit):
        raise
      except:
        e = sys.exc_info()[0]
        print 'Error: %s' % e


  def updateLights(self):
    """
    Change the lights.
    """
    self.fillArray()
    for li, l in enumerate(self.ledArray):
      self.led.setRGB(li, l[0], l[1], l[2])


  def fillArray(self):
    """
    Fill up LED count with all the colors.
    """
    self.ledArray = []
    length = len(self.current['colors'])

    for x in range(0, self.ledCount - 1):
      self.ledArray.append(self.hex_to_rgb(self.current['colors'][x % length]))


  def queryLights(self):
    """
    Make request to API.
    """
    r = requests.get('%soutgoing' % (self.base_url))
    self.current = r.json()

    # Only update if new record
    if self.currentID is None or self.currentID != self.current['_id']:
      self.currentID = self.current['_id']
      self.updateLights()


  def hex_to_rgb(self, value):
    """
    Turns hex value to RGB tuple.
    """
    value = value.lstrip('#')
    lv = len(value)
    return tuple(int(value[i:i+lv/3], 16) for i in range(0, lv, lv/3))


if __name__ == '__main__':
  lumiere = Lumiere()
  lumiere.listen()
