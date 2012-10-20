var expect = require('chai').expect;

var packet = new Buffer(['\u2c73', '\u6900', '\u6673', '\u6571', '\u0000', '\u0000', '\uffff', '\uffff']);

describe("TUIO packet", function() {
	it("Runs a test!", function() {
		expect(2).to.equal(2);

    console.log(packet.toString());
	});
});