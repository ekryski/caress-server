# Caress Server#

[![Build Status](https://travis-ci.org/ekryski/caress-server.svg?branch=master)](https://travis-ci.org/ekryski/caress-server)

*Caress Server* is a NodeJS + Socket.io backed Javascript implementation of the [TUIO protocol](http://www.tuio.org) bringing true cross platform TUIO support. Used in conjunction with the the [Caress Client](https://github.com/ekryski/caress-client/) you now get true cross browser multi-touch support and tactile interaction in the web browser.

### Background ###
[TUIO](http://tuio.org/) is based on the [OSC protocol](http://opensoundcontrol.org/) and usually transferred via UDP. Caress uses NodeJS and websockets via ([Socket.IO](http://socket.io/)) to push OSC/TUIO messages to the browser. The Caress server listens for raw TUIO events, processes them, and then exposes them, as either an array or JSON, through an event emitter. Therefore consuming is as simple as listening for `'tuio'` events.

## Getting Started
### Server
**Install the server via npm:**

    npm install caress-server

**To run an example:**

* start the example server
    * `node examples/server.js`
* open up one of the html files
* Grab a [TUIO Tracker](http://tuio.org/?software) and start playing around


The server listens for TUIO input on the default TUIO port: 3333. If you need to change this for some reason you can change it when you create a new TUIO server:

    var CaressServer = require('caress-server');
    var caress = new CaressServer('0.0.0.0', 3333, {json: true});

    caress.on('tuio', function(msg){
      console.log(msg);
    });

That's it that's all. Now you can do whatever you want with that TUIO data.

### Client
Grab the [Caress Client](https://github.com/ekryski/caress-client/) and drop it into your web page.

## Examples
_See the [examples](https://github.com/ekryski/Caress/tree/master/examples) folder_

## Contributing
I am open to pull requests but make sure you include unit tests with your code.

## Credits
Although I did not collaborate with these individuals their work inspired me to create this project:

* Boris Smus (https://github.com/borismus/MagicTouch)
* Fajran Iman Rusadi (https://github.com/fajran/npTuioClient)
* Andy Smith (https://github.com/termie/node-osc)
* fe9lix (https://github.com/fe9lix/Tuio.js)
* Esteban Ginez (https://github.com/eginez/MultitouchWebSockets)

## MIT Licensed
Copyright 2012 Eric Kryski

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
