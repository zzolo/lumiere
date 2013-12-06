from bootstrap import *

rainbow = [
    SysColors.red,
    SysColors.orange,
    SysColors.yellow,
    SysColors.green,
    SysColors.blue,
    SysColors.indigo,
    SysColors.violet,
]

nothing = Nothing(led)
sleep1 = {"anim" : nothing, "amt" : 1, "sleep" : 0, "max" : 1}

animations = [
    {"anim" : ColorFade(led, [SysColors.orange,], 0.03), "amt" : 1, "sleep" : None, "max" : 180},
    {"anim" : LarsonScanner(led, SysColors.red, 36, 0.75, 18, 338), "amt" : 8, "sleep" : None, "max" : (num / 8) * 3},
    
    {"anim" : PartyMode(led, [SysColors.white75], 120, 239), "amt" : 1, "sleep" : None, "max" : 6, "post_delay" : -1},
    {"anim" : PartyMode(led, [SysColors.white75], 0, 119), "amt" : 1, "sleep" : None, "max" : 2, "post_delay" : -1},
    {"anim" : PartyMode(led, [SysColors.white75], 240, 359), "amt" : 1, "sleep" : None, "max" : 6, "post_delay" : -1},

    {"anim" : PartyMode(led, [SysColors.white75], 0, 119), "amt" : 1, "sleep" : None, "max" : 6, "post_delay" : -1},
    {"anim" : PartyMode(led, [SysColors.white75], 120, 239), "amt" : 1, "sleep" : None, "max" : 4, "post_delay" : -1},
    {"anim" : PartyMode(led, [SysColors.white75], 240, 359), "amt" : 1, "sleep" : None, "max" : 2, "post_delay" : -1},

    {"anim" : PartyMode(led, [SysColors.white75], 0, 119), "amt" : 1, "sleep" : None, "max" : 2, "post_delay" : -1},
    {"anim" : PartyMode(led, [SysColors.white75], 240, 359), "amt" : 1, "sleep" : None, "max" : 6, "post_delay" : -1},
    {"anim" : PartyMode(led, [SysColors.white75], 120, 239), "amt" : 1, "sleep" : None, "max" : 4, "post_delay" : -1},
   
    {"anim" : LarsonScanner(led, SysColors.red, 36, 0.75, 18, 338), "amt" : 8, "sleep" : None, "max" : (num / 8) * 3},
    {"anim" : ColorPattern(led, [SysColors.orange, SysColors.off], 90), "amt" : 8, "sleep" : None, "max" : 120},
    {"anim" : PartyMode(led, [SysColors.white75]), "amt" : 1, "sleep" : None, "max" : 40},
    #{"anim" : LarsonRainbow(led, 36), "amt" : 8, "sleep" : None, "max" : (num / 8) * 6},
    #{"anim" : Rainbow(led), "amt" : 8, "sleep" : None, "max" : 360},
    #{"anim" : PartyMode(led, rainbow), "amt" : 1, "sleep" : None, "max" : 14*20},
    #{"anim" : FireFlies(led, [SysColors.white], 2), "amt" : 1, "sleep" : 250, "max" : 80},
]

import signal
def sigint_handler(signal, frame):
    print "Shutting down gracefully..."
    led.all_off()
    sys.exit(0)

signal.signal(signal.SIGINT, sigint_handler)

while True:
    for a in animations:
        a["anim"].run(a["amt"], a["sleep"], a["max"])
        led.all_off()
        if "post_delay" in a:
            delay = a["post_delay"]
            if delay == -1:
                delay = random.randint(0, 750)
            if delay > 0:
                time.sleep(delay / 1000.0)


led.all_off()