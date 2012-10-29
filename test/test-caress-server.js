var expect = require('chai').expect;
var Caress = require('../lib/caress-server');

describe("Caress Server", function () {
  it("Should create a caress server with passed in parameters", function () {
    var caress = new Caress('0.0.0.0', 3334, {debug: true, json: true});

    expect(caress.host).to.equal('0.0.0.0');
    expect(caress.port).to.equal(3334);
    expect(caress.debug).to.be.true;
    expect(caress.json).to.be.true;
  });

  it("Should create a caress server with defaults when no parameters are passed in", function () {
    var caress = new Caress();

    expect(caress.host).to.equal('127.0.0.1');
    expect(caress.port).to.equal(3333);
    expect(caress.debug).to.be.false;
    expect(caress.json).to.be.true;
  });

  it("Should emit a 'tuio' event when UDP 'message' is received", function () {
  });

  it("Should emit an 'error' event when UDP 'error' is received", function () {
  });

  it("Should emit a 'tuio' event when TCP 'data' is received", function () {
  });

  it("Should emit an 'error' event when TCP 'error' is received", function () {
  });
});