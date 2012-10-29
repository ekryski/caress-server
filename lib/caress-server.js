/*
* Caress Server v0.1.0
*
* A simple server that listens for TUIO events, translates
* them and then exposes them as an event emitter.
*
* Copyright (c) 2012 Eric Kryski
* MIT Licensed
*/
var dgram = require('dgram'),
    net = require('net'),
    util = require('util'),
    // client = require("tuio-client"),
    EventEmitter = require('events').EventEmitter,
    Packet = require('./tuio-packet');

/*
* Server version
*/

exports.version = '0.1.0';

/*
* Supported TUIO protocol version
*/

exports.protocol = '1.1';

/*
* Supported Caress client version
*/

// exports.clientVersion = client.version;

/**
 * Creates a Caress TUIO Server
 *
 * @param String host to listen for TUIO data
 * @param Integer port to listen to TUIO data - default is 3333
 * @param {Object} options
 * @api public
 */

function Caress(host, port, options) {
  var self = this;

  // Needed to convert this constructor into EventEmitter
  EventEmitter.call(this);

  options = options || {};
  this.host = host || '127.0.0.1';
  this.port = port || 3333;
  this.debug = options.debug || false;
  this.json = options.json || true;

  // Bind to UDP socket for TUIO
  var tuioUdpSocket = dgram.createSocket("udp4");

  tuioUdpSocket.on('message', function(packet, rinfo) {
    var parsedPacket = (self.json) ? new Packet(packet).toJSON() : new Packet(packet).toArray();

    if (self.debug) {
      var now = new Date();
      console.log(now + " - TUIO UDP Server Received Packet: " + util.inspect(parsedPacket, true, null, true));
    }
    self.emit('tuio', parsedPacket);
  });

  tuioUdpSocket.on('error', function(error){
    self.emit('error', error);
    console.log("TUIO UDP Server ERROR: ", error);
  });

  tuioUdpSocket.on('close', function(){
    if (self.debug) {
      var now = new Date();
      console.log(now + " - TUIO UDP Server Disconnected");
    }
  });

  tuioUdpSocket.on( 'listening', function(){
    var address = tuioUdpSocket.address();
    console.log("TUIO UDP Server listening on: " + address.address + ":" + address.port);
  });

  tuioUdpSocket.bind( this.port, this.host );

  // Bind to TCP socket for TUIO
  var tuioTcpSocket = net.createServer(function(socket){
    socket.on('connect', function() {
      if (self.debug) {
        var now = new Date();
        console.log(now + " - TUIO TCP Client Connected");
      }
    });

    socket.on('data', function(packet) {
      if (self.debug) {
        var now = new Date();
        console.log(now + " - TUIO TCP Server Received Packet: " + packet);
      }

      var parsedPacket = (self.json) ? new Packet(packet, true).toJSON() : new Packet(packet, true).toArray();
      self.emit('tuio', parsedPacket);
    });

    socket.on('error', function(error){
      self.emit('error', error);
      console.log("TUIO TCP Server ERROR: ", error);
    });

    socket.on('close', function(){
      if (self.debug) {
        var now = new Date();
        console.log(now + " - TUIO TCP Server Disconnected");
      }
    });

    socket.on('end', function() {
      if (self.debug) {
        var now = new Date();
        console.log(now + " - TUIO TCP Client Disconnected");
      }
    });
  });

  tuioTcpSocket.listen( this.port, function(){
    var address = tuioTcpSocket.address();
    console.log("TUIO TCP Server listening on: " + address.address + ":" + address.port);
  });
}

// Needed to convert this constructor into EventEmitter
util.inherits(Caress, EventEmitter);

/**
* Expose Caress Server constructor
*/
exports = module.exports = Caress;
