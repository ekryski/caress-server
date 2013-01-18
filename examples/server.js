/*
* Caress example server
* Copyright (c) 2012 Eric Kryski
* MIT Licensed
*/

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    Caress = require("../lib/caress-server");

var caress = new Caress('0.0.0.0', 3333, {json: true});

// Setup Socket.io
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


// Setup Express
app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname));
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  app.use(app.router);
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

function onSocketConnect(socket) {
    console.log("Socket.io Client Connected");

    caress.on('tuio', function(msg){
      socket.emit('tuio', msg);
    });

    socket.on("disconnect", function(){
      console.log("Socket.io Client Disconnected");
    });
}

server.listen(5000);