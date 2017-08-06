var http = require('http')
var Control = require('./lib/control')

var server = http.createServer(function (req, res) {
  var control = new Control(req, res)
  control.init()
})

server.listen(8000, function () {
  console.log('server start at ' + 8000)
})