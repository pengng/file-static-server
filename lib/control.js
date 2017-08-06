var async = require('async')
var Cache = require('./cache')
var Headers = require('./headers')
var File = require('./file')
var Directory = require('./directory')

function Control(req, res) {
  this.req = req
  this.res = res
  this.headers = new Headers(req, res)
  this.file = new File(req, res)
  this.cache = new Cache(req, res, this.file, this.headers)
  this.directory = new Directory(req, res, this.file, this.headers)
}

Control.prototype = {
  noFind: function () {
    this.headers
      .status(404)
      .write()
    this.res.end('Can not ' + this.req.method + ' ' + this.req.url)
  },
  init: function () {
    var callback = function (pathType, next) {
      if (pathType === 'file') {
        this.cache.check(next)
      } else if (pathType === 'directory') {
        this.directory.outputBody()
      } else {
        this.noFind()
      }
    }
    var callback2 = function (err, isCache) {
      if (err) {
        return this.noFind()
      }
      if (isCache) {
        return this.cache.useCache()
      }
      this.cache.createCache()
    }
    async.waterfall([
      this.file.getPathType.bind(this.file),
      callback.bind(this)
    ], callback2.bind(this))
  }
}

module.exports = Control