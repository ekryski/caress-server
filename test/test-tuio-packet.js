var expect = require('chai').expect;
var Packet = require('../lib/tuio-packet');

var raw2DCursorUDPBundleWithoutSource = new Buffer('2362756e646c650000000000000000010000001c2f7475696f2f3244637572002c736900616c69766500000000000004000000342f7475696f2f3244637572002c736966666666660000000073657400000000043f115e5e3f68fc970000000000000000000000000000001c2f7475696f2f3244637572002c7369006673657100000000000000ff', 'hex');
var raw2DCursorTCPBundleWithoutSource = new Buffer('2362756e646c650000000000000000010000001c2f7475696f2f3244637572002c736900616c69766500000000000004000000342f7475696f2f3244637572002c736966666666660000000073657400000000043f115e5e3f68fc970000000000000000000000000000001c2f7475696f2f3244637572002c7369006673657100000000000000ff', 'hex');
var raw2DCursorUDPBundleWithSource = new Buffer('2362756e646c65000000000000000001000000302f7475696f2f3244637572002c737300736f7572636500005475696f506164403139322e3136382e312e3638000000000000001c2f7475696f2f3244637572002c736900616c69766500000000000000000000342f7475696f2f3244637572002c736966666666660000000073657400000000003f0c44443efd999a0000000000000000000000000000001c2f7475696f2f3244637572002c7369006673657100000000000000dc', 'hex');
var raw2DCursorTCPBundleWithSource = new Buffer('000000bc2362756e646c65000000000000000001000000302f7475696f2f3244637572002c737300736f7572636500005475696f506164403139322e3136382e312e3638000000000000001c2f7475696f2f3244637572002c736900616c69766500000000000000000000342f7475696f2f3244637572002c736966666666660000000073657400000000003ee222223f06cccd000000003e480031bf50559e0000001c2f7475696f2f3244637572002c736900667365710000000000000091', 'hex');

describe("TUIO packet array via UDP:", function() {
  it("Should create an array packet for 2D cursor bundle without source", function() {
    var packet = new Packet(raw2DCursorUDPBundleWithoutSource).toArray();
    var arrayPacket = [
      '#bundle',
      '2.3283064365386963e-10',
      [ '/tuio/2Dcur', 'alive', 4 ],
      [ '/tuio/2Dcur',
        'set',
        4,
        0.5678461790084839,
        0.9101042151451111,
        0,
        0,
        0
      ],
      [ '/tuio/2Dcur', 'fseq', 255 ]
    ];

    expect(packet).to.deep.equal(arrayPacket);
  });

  it("Should create an array packet for 2D cursor bundle with source", function() {
    var packet = new Packet(raw2DCursorUDPBundleWithSource).toArray();
    var arrayPacket = [
      '#bundle',
      '2.3283064365386963e-10',
      [ '/tuio/2Dcur', 'source', 'TuioPad@192.168.1.68' ],
      [ '/tuio/2Dcur', 'alive', 0 ],
      [ '/tuio/2Dcur',
        'set',
        0,
        0.5479166507720947,
        0.49531251192092896,
        0,
        0,
        0
      ],
      [ '/tuio/2Dcur', 'fseq', 220 ]
    ];

    expect(packet).to.deep.equal(arrayPacket);
  });
});

describe("TUIO packet array via TCP:", function() {
  it("Should create an array packet for 2D cursor bundle with source", function() {
    var packet = new Packet(raw2DCursorTCPBundleWithSource, true).toArray();
    var arrayPacket = [
      '#bundle',
      '2.3283064365386963e-10',
      [ '/tuio/2Dcur', 'source', 'TuioPad@192.168.1.68' ],
      [ '/tuio/2Dcur', 'alive', 0 ],
      [ '/tuio/2Dcur',
        'set',
        0,
        0.4416666626930237,
        0.526562511920929,
        0,
        0.1953132301568985,
        -0.813806414604187
      ],
      [ '/tuio/2Dcur', 'fseq', 145 ]
    ];

    expect(packet).to.deep.equal(arrayPacket);
  });
});

describe("TUIO JSON packet via UDP:", function() {
  it("Should create a JSON packet for 2D cursor bundle without source", function() {
    var packet = new Packet(raw2DCursorUDPBundleWithoutSource).toJSON();
    var jsonPacket = {
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

    expect(packet).to.deep.equal(jsonPacket);
  });

  it("Should create a JSON packet for 2D cursor bundle with source", function() {
    var packet = new Packet(raw2DCursorUDPBundleWithSource).toJSON();
    var jsonPacket = {
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
          xPosition: 0.5479166507720947,
          yPosition: 0.49531251192092896,
          xVelocity: 0,
          yVelocity: 0,
          motionAcceleration: 0
        },
        {
          profile: '/tuio/2Dcur',
          type: 'fseq',
          frameID: 220
        }
      ],
      duplicate: false
    };

    expect(packet).to.deep.equal(jsonPacket);
  });
});

describe("TUIO JSON packet via TCP:", function() {
  it("Should create an array packet for 2D cursor bundle with source", function() {
    var packet = new Packet(raw2DCursorTCPBundleWithSource, true).toJSON();
    var jsonPacket = {
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

    expect(packet).to.deep.equal(jsonPacket);
  });
});