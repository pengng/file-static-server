var fs = require('fs')
var path = require('path')
var async = require('async')
var getHeaders = require('./getHeaders')
var App = require('./app')
var app = new App()

app.get('/', function (req, res) {
  res.end('get /')
})

var middleware = function (req, res, next) {
  req.data = '根目录'
  next()
}

app.post('/abcd?', middleware, function (req, res) {
  res.end('post to /test' + req.data)
})

app.put('/file', function (req, res) {
  res.end('put to /file')
})

app.head('/h', function (req, res) {
  res.end('head the /h')
})

/**
function static(dir) {
  return function (req, res) {
    var url = req.url
    var filePath = path.join(dir, url)
    async.series([
      fs.access.bind(fs, filePath),
      getHeaders.bind(null, filePath)
    ], function (err, result) {
      if (err) {
        res.writeHead(404)
        return res.end()
      }
      var headers = result[1]
      res.writeHead(200, headers)
      fs.createReadStream(filePath)
        .on('error', function (err) {
          res.writeHead(500)
          res.end(err)
        })
        .pipe(res)
    })
  }
}
*/

module.exports = app.export.bind(app)