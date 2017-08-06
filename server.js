var http = require('http')
var static = require('./index')
var path = require('path')

var server = http.createServer(static(path.join(__dirname, 'public')))
server.on('request', function (req, res) {
  // res.end('success')
})

server.listen(8000, function () {
  console.log('server start at ' + 8000)
})