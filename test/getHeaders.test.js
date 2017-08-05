var expect = require('chai').expect
var getHeaders = require('../lib/getHeaders')

describe('test getHeaders.js', function () {
  it('test getHeaders()', function (done) {
    var filePath = __filename
    getHeaders(filePath, function (err, headers) {
      console.log(headers)
      expect(err).to.be.null
      expect(headers)
        .to.be.an('object')
        .to.has.property('server', 'static')
      expect(headers)
        .has.property('content-type', 'application/javascript; charset=UTF-8')
      expect(headers)
        .has.property('content-length')
      done()
    })
  })
})