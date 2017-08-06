var mime = require('mime')
var fs = require('fs')
var path = require('path')
var crypto = require('crypto')

function File(req, res) {
  this.req = req
  this.res = res
  this.charset = 'utf-8'
  this.init()
}

File.prototype = {
  init: function () {
    this.filePath = this.getFilePath()
    this.mime = this.getMime()
  },
  getMime: function () {
    return mime.lookup(this.filePath)
  },
  getFilePath: function () {
    if (this.filePath) {
      return this.filePath
    }
    var url = this.req.url
    this.filePath = path.join(process.cwd(), url)
    return this.filePath
  },
  getPathType: function (callback) {
    if (this.pathType) {
      return callback(null, this.pathType)
    }
    fs.stat(this.filePath, function (err, stat) {
      if (err) {
        return callback(err)
      }
      if (stat.isFile()) {
        this.pathType = 'file'
      } else if (stat.isDirectory()) {
        this.pathType = 'directory'
      } else {
        this.pathType = 'other'
      }
      callback(null, this.pathType)
    })
  },
  getSize: function (callback) {
    if (this.size) {
      return callback(null, this.hash)
    }
    fs.stat(this.filePath, function (err, result) {
      if (err) {
        return callback(err)
      }
      this.size = result.size
      callback(null, this.size)
    })
  },
  getHash: function (callback) {
    if (this.hash) {
      return callback(null, this.hash)
    }
    fs.readFile(this.filePath, 'utf8', function (err, result) {
      if (err) {
        return callback(err)
      }
      this.hash = crypto.createHash('sha1').update(result).digest('hex')
      callback(null, this.hash)
    })
  },
  getCharset: function (callback) {
    if (this.mime !== 'text/html') {
      return callback(null, this.charset)
    }
    fs.readFile(this.filePath, 'utf8', function (err, result) {
      if (err) {
        return callback(err)
      }
      var matches = result.match(/<meta[ ]+charset="([\w- ]+)">/i)
      if (matches) {
        this.charset = matches[1]
      }
      callback(null, this.charset)
    })
  },
  getStream: function () {
    return fs.createReadStream(this.filePath)
  }
}

module.exports = File