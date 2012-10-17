/*
* Caress example server (ie. one you might make)
*
* Copyright (c) 2012 Eric Kryski
* MIT Licensed
*/

var socketio = require('socket.io'),
    CaressServer = require("../index.js");

var caress = new CaressServer('0.0.0.0', 3333, {json: true});

var port = 5000;

function onSocketConnect(socket) {
    console.log("Socket.io Client Connected");

    caress.on('tuio', function(msg){
      console.log(msg);
      socket.emit('tuio', msg);
    });

    socket.on("disconnect", function(){
      console.log("Socket.io Client Disconnected");
    });
}

// Setup Socket.io connection
var io = socketio.listen( port );
io.enable("browser client minification");
io.enable("browser client etag");
io.enable("browser client gzip");
io.set("log level", 1);
io.set("transports", [
    "websocket",
    "flashsocket",
    "htmlfile",
    "xhr-polling",
    "jsonp-polling"
]);
io.sockets.on("connection", onSocketConnect);