var http = require('http')
var Control = require('./lib/control')

var server = http.createServer(function (req, res) {
  var control = new Control(req, res)
  control.init()
})

var port = process.argv[2]
server.listen(port, function () {
  console.log('server start at ' + port)
})