var async = require('async')

function Cache(req, res, file, headers) {
  this.req = req
  this.res = res
  this.headers = headers
  this.file = file
}

Cache.prototype = {
  check: function (callback) {
    var noneMatch = this.headers.getHeaders('if-none-match')
    var filePath = this.file.filePath
    this.file.getHash(function (err, result) {
      if (err) {
        return callback(err)
      }
      callback(null, result === noneMatch)
    })
  },
  createCache: function () {
    var callback = function (err, result) {
      if (err) {
        return this.empty()
      }
      var mime = this.file.getMime()
      var hash = result.getHash
      var charset = result.getCharset
      var size = result.getSize
      this.headers
        .setHeaders('content-type', mime + '; charset=' + charset)
        .setHeaders('content-length', size)
        .setHeaders('etag', hash)
        .setHeaders('cache-control', 'public; max-age=' + 1000 * 60 * 60 * 24 * 365 * 100)
        .status(200)
        .write()
      this.file
        .getStream()
        .pipe(this.res)
    }
    async.parallel({
      getHash: this.file.getHash.bind(this.file),
      getCharset: this.file.getCharset.bind(this.file),
      getSize: this.file.getSize.bind(this.file)
    }, callback.bind(this))
  },
  useCache: function () {
    this.headers
      .status(304)
      .write()
    this.res.end()
  }
}

module.exports = Cache