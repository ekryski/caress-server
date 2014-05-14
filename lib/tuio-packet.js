/*
* TUIO Packet
*
* A wrapper for TUIO messages that has functions to
* decode and format the raw OSC packets.
*
* Copyright (c) 2012 Eric Kryski
* MIT Licensed
*/

var jspack = require('jspack').jspack;
var buffertools = require('buffertools');

// var messageConverter = {
//   's': 'sessionId',
//   'i': 'classId',
//   'x': 'xPosition',
//   'y': 'yPosition',
//   'z': 'zPosition',
//   'a': 'aAngle',
//   'b': 'bAngle',
//   'c': 'cAngle',
//   'w': 'width',
//   'h': 'height',
//   'd': 'depth',
//   'f': 'area',
//   'v': 'volume',
//   'X': 'xVelocity',
//   'Y': 'yVelocity',
//   'Z': 'zVelocity',
//   'A': 'aRotationSpeed',
//   'B': 'bRotationSpeed',
//   'C': 'cRotationSpeed',
//   'm': 'motionAcceleration',
//   'r': 'rotationAccleration',
//   'p': 'freeParameter'
// };

function Packet(msg, tcp) {
  this.packet = [];
  this.data = msg;
  this.tcp = tcp || false;
  this.types = {
    'source': function(jsonMessage, message){
      jsonMessage.address = message[2];
      return jsonMessage;
    },
    'alive': function(jsonMessage, message){
      jsonMessage.sessionIds = [];
      for (var j=2; j < message.length; j++ ){
        jsonMessage.sessionIds.push(message[j]);
      }
      return jsonMessage;
    },
    'fseq': function(jsonMessage, message){
      jsonMessage.frameID = message[2];
      return jsonMessage;
    }
  };
  this.profiles = {
    '/tuio/2Dobj': decode2DObjectMessage,
    '/tuio/2Dcur': decode2DCursorMessage,
    '/tuio/2Dblb': decode2DBlobMessage
    // '/tuio/25Dobj': decode25DObjectMessage(message),
    // '/tuio/25Dcur': decode25DCursorMessage(message),
    // '/tuio/25Dblb': decode25DBlobMessage(message),
    // '/tuio/3Dobj': decode3DObjectMessage(message),
    // '/tuio/3Dcur': decode3DCursorMessage(message),
    // '/tuio/3Dblb': decode3DBlobMessage(message)
  };
}

Packet.prototype.toArray = function() {
  if (this.tcp) {
    // Get remaining data after the first ascii character
    // because it is garbage.
    this.data = this.data.slice(4);
  }

  this.packet = decode(this.data, this.packet);

  return this.packet;
};

// Convert packet to JSON output
Packet.prototype.toJSON = function() {
  if (this.tcp) {
    // Get remaining data after the first ascii character
    // because it is garbage.
    this.data = this.data.slice(4);
  }

  this.packet = decode(this.data, this.packet);

  var json = {};

  // If it's bundle we have multiple messages
  if (this.packet[0] === '#bundle') {
    json = convertBundleToJSON(this.packet, this); //pass context of the Packet
  }
  else {
    //TODO: Handle non-bundled messages (haven't seen one yet)
  }

  return json;
};

function convertBundleToJSON(bundle, self) {
  var json = {
    bundle: true,
    messages: [],
    duplicate: false
  };

  // Parse the array and convert to proper JSON format given
  // the message profile.
  for (var i = 2; i < bundle.length; i++){
    if (Array.isArray(bundle[i])) {
      var jsonMessage = {};

      if (bundle[i][0] === '#bundle'){
        jsonMessage = convertBundleToJSON(bundle[i], self);
      }
      else {
        jsonMessage.profile = bundle[i][0];
        jsonMessage.type = bundle[i][1];

        if (bundle[i].length > 2) {

          // Call message type decoder based on the profile if it is a 'set' message
          if (self.types[jsonMessage.type] === undefined){
            jsonMessage = self.profiles[jsonMessage.profile](jsonMessage, bundle[i]);
          }
          else {
            jsonMessage = self.types[jsonMessage.type](jsonMessage, bundle[i]);
            if (jsonMessage.frameID && jsonMessage.frameID === -1){
              json.duplicate = true;
            }
          }
        }
      }

      json.messages.push(jsonMessage);
    }
  }

  return json;
}

function decode2DObjectMessage( jsonMessage, message ){
  var fields = [
    'sessionId',
    'classId',
    'xPosition',
    'yPosition',
    'aAngle',
    'xVelocity',
    'yVelocity',
    'aRotationSpeed',
    'motionAcceleration',
    'rotationAccleration'
  ];

  for (var j=2; j < message.length; j++ ){
    jsonMessage[fields[j-2]] = message[j];
  }

  return jsonMessage;
}

function decode2DCursorMessage( jsonMessage, message ){
  var fields = [
    'sessionId',
    'xPosition',
    'yPosition',
    'xVelocity',
    'yVelocity',
    'motionAcceleration'
  ];

  for (var j=2; j < message.length; j++ ){
    jsonMessage[fields[j-2]] = message[j];
  }

  return jsonMessage;
}

function decode2DBlobMessage( jsonMessage, message ){
  var fields = [
    'sessionId',
    'xPosition',
    'yPosition',
    'aAngle',
    'width',
    'height',
    'area',
    'xVelocity',
    'yVelocity',
    'aRotationSpeed',
    'motionAcceleration',
    'rotationAccleration'
  ];

  for (var j=2; j < message.length; j++ ){
    jsonMessage[fields[j-2]] = message[j];
  }

  return jsonMessage;
}

// Parse the OSC packet
function decode(data, packet) {
  var address = decodeString(data);
  data = address.data;

  if (address.value === "#bundle") {
      data = decodeBundle(data, packet);
  } else if (data.length > 0) {
      data = decodeMessage(address, data, packet);
  }
  return packet;
}

//Decode an OSC bundle
function decodeBundle(data, packet) {
  var time = decodeTime(data),
  bundleSize,
  content;

  data = time.data;

  // Push the '#bundle' profile
  packet.push("#bundle");
  packet.push(time.value.toString());

  while (data.length > 0) {
      bundleSize = decodeInt(data);
      data = bundleSize.data;

      content = data.slice(0, bundleSize.value);

      // Parse out the messages in the bundle
      var nestedContent = new Packet(content).toArray();
      packet.push(nestedContent);

      data = data.slice(bundleSize.value, data.length);
  }

  return data;
}

//Decode the actual message
function decodeMessage(address, data, packet) {

  // TODO: May need to decode the case where OSC protocol
  // doesn't have type tags
  var types = {
    'i': decodeInt,
    'f': decodeFloat,
    's': decodeString,
    'b': decodeBlob
  };

  packet.push(address.value);

  var typeTags = decodeString(data);
  data = typeTags.data;
  typeTags = typeTags.value;

  if (typeTags[0] === ",") {
    for (var i = 1; i < typeTags.length; i++) {
      //Decode data by type
      var arg = types[typeTags[i]](data);
      data = arg.data;
      packet.push(arg.value);
    }
  }

  return data;
}

// Decode the string
function decodeString(data) {
  var zeroBuffer = new Buffer(1);
  buffertools.clear(zeroBuffer);

  // Find first 00 in buffer
  var end = buffertools.indexOf(data, zeroBuffer);

  return {
      // Get data up to next 00 value
      value: data.toString("ascii", 0, end),
      // Get remaining data after the first 00 value
      data: data.slice(Math.ceil((end + 1) / 4) * 4)
  };
}

//Decode integers
function decodeInt(data) {
  return {
    value: jspack.Unpack(">i", data.slice(0, 4))[0],
    data: data.slice(4)
  };
}

//Decode floats
function decodeFloat (data) {
  return {
    value: jspack.Unpack(">f", data.slice(0, 4))[0],
    data: data.slice(4)
  };
}

//Decode OSC Blobs
function decodeBlob (data) {
  var length = Math.ceil((data.length) / 4.0) * 4;

  return {
    value: jspack.Pack('>i' + length + 's', [length, data]),
    data: data.slice(length)
  };
}

//Decode timestamp
function decodeTime(data) {
  var time = jspack.Unpack(">LL", data.slice(0, 8)),
  seconds = time[0],
  fraction = time[1];
  return {
    value: seconds + fraction / 4294967296,
    data: data.slice(8)
  };
}

exports = module.exports = Packet;
