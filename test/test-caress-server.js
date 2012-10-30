var expect = require('chai').expect;
var Caress = require('../lib/caress-server');
var dgram = require('dgram');
var net = require('net');

describe("Caress Server", function () {
  describe("Initialization", function () {
    it("Should create a caress server with defaults when no parameters are passed in", function () {
      var caress = new Caress();

      expect(caress.host).to.equal('127.0.0.1');
      expect(caress.port).to.equal(3333);
      expect(caress.debug).to.be.false;
      expect(caress.json).to.be.true;
    });

    it("Should create a caress server with passed in parameters", function () {
      var caress = new Caress('0.0.0.0', 3334, {debug: true, json: true});

      expect(caress.host).to.equal('0.0.0.0');
      expect(caress.port).to.equal(3334);
      expect(caress.debug).to.be.true;
      expect(caress.json).to.be.true;
    });
  });

  describe("Event emitting", function () {
    it("Should emit a 'tuio' event when UDP 'message' is received", function (done) {
      // SETUP
      var caress = new Caress('0.0.0.0', 3335);
      var client = dgram.createSocket("udp4");
      var message = new Buffer('2362756e646c650000000000000000010000001c2f7475696f2f3244637572002c736900616c69766500000000000004000000342f7475696f2f3244637572002c736966666666660000000073657400000000043f115e5e3f68fc970000000000000000000000000000001c2f7475696f2f3244637572002c7369006673657100000000000000ff', 'hex');
      var expected = {
        bundle: true,
        messages: [
          {
            profile: '/tuio/2Dcur',
            type: 'alive',
            sessionIds: [4]
          },
          {
            profile: '/tuio/2Dcur',
            type: 'set',
            sessionId: 4,
            xPosition: 0.5678461790084839,
            yPosition: 0.9101042151451111,
            xVelocity: 0,
            yVelocity: 0,
            motionAcceleration: 0 },
          {
            profile: '/tuio/2Dcur',
            type: 'fseq',
            frameID: 255
          }
        ],
        duplicate: false
      };

      // TEST
      client.send(message, 0, message.length, 3335, "0.0.0.0", function(err, bytes) {
        client.close();
      });

      // VERIFY
      caress.on('tuio', function(msg){
        expect(msg).to.deep.equal(expected);
        done();
      });
    });

    it("Should emit an 'error' event when UDP 'error' is received");

    it("Should emit a 'tuio' event when TCP 'data' is received", function (done) {
      // SETUP
      var caress = new Caress('0.0.0.0', 3336);
      var message = new Buffer('000000bc2362756e646c65000000000000000001000000302f7475696f2f3244637572002c737300736f7572636500005475696f506164403139322e3136382e312e3638000000000000001c2f7475696f2f3244637572002c736900616c69766500000000000000000000342f7475696f2f3244637572002c736966666666660000000073657400000000003ee222223f06cccd000000003e480031bf50559e0000001c2f7475696f2f3244637572002c736900667365710000000000000091', 'hex');
      var expected = {
        bundle: true,
        messages: [
          {
            profile: '/tuio/2Dcur',
            type: 'source',
            address: 'TuioPad@192.168.1.68'
          },
          {
            profile: '/tuio/2Dcur',
            type: 'alive',
            sessionIds: [0]
          },
          {
            profile: '/tuio/2Dcur',
            type: 'set',
            sessionId: 0,
            xPosition: 0.4416666626930237,
            yPosition: 0.526562511920929,
            xVelocity: 0,
            yVelocity: 0.1953132301568985,
            motionAcceleration: -0.813806414604187
          },
          {
            profile: '/tuio/2Dcur',
            type: 'fseq',
            frameID: 145
          }
        ],
        duplicate: false
      };

      // TEST
      var client = new net.createConnection({port: 3336, host: '0.0.0.0'}, function(){
        client.end(message);
      });

      // VERIFY
      caress.on('tuio', function(msg){
        expect(msg).to.deep.equal(expected);
        done();
      });
    });

    it("Should emit an 'error' event when TCP 'error' is received");
  });
});