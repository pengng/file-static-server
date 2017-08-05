var fs = require('fs')
var mime = require('mime')

function getHeaders(path, callback) {
  var headers = {
    'server': 'static',
    'content-type': mime.lookup(path) + '; charset=UTF-8'
  }
  fs.stat(path, function (err, stat) {
    if (err) {
      headers['content-length'] = 0
      return callback(new Error('no access to File'))
    }
    headers['content-length'] = stat.size
    callback(null, headers)
  })
}

module.exports = getHeaders