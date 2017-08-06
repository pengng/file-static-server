var fs = require('fs')
var mime = require('mime')
var async = require('async')
var package = require('../package')

function getHeaders(filePath, callback) {
  var headers = {
    'server': 'static-' + package.version
  }
  var fileType = mime.lookup(filePath)
  async.parallel({
    getStat: fs.stat.bind(fs, filePath),
    getCharset: function (next) {
      if (fileType !== 'text/html') {
        return next(null, 'utf-8')
      }
      fs.readFile(filePath, function (err, buffers) {
        if (err) {
          return next(err)
        }
        var matches = buffers.toString().match(/<meta[ ]+charset="([\w- ]+)">/i)
        if (matches) {
          next(null, matches[1])
        } else {
          next(null, 'utf-8')
        }
      })
    }
  }, function (err, result) {
    if (err) {
      return callback(err)
    }
    headers['content-type'] = fileType + '; charset=' + result.getCharset
    headers['content-length'] = result.getStat.size
    callback(null, headers)
  })
}

module.exports = getHeaders