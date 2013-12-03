# Lumière

SMS :arrow_right: web :arrow_right: LED = fun for everyone.

## The basics

A string of LED's is connected to Arduino which is controlled by a Raspberry Pi that looks to the web to figure out what color those LEDs should which is then controlled by SMS or a web interface.  Got it?

*Right now these are just notes as I build it*

## Running and installing web application

1. Download code
1. Install NodeJS
1. Install Redis
    * With homebrew: `brew install redis && redis-server /usr/local/etc/redis.conf`
1. Configure:
    * export REDISTOGO_URL="redis://localhost:6379"
    * export SECRET_COOKIE="your_secret_here"
1. Install packages: `npm install`
1. Run application: `node app.js`
    * Go to http://localhost:3000 in your browser

### Running on Heroku

1. `heroku create app <YOUR APP>`
1. `heroku addons:add redistogo`
1. `heroku config SECRET_COOKIE="your_secret_here"`