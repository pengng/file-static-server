var fs = require('fs')
var path = require('path')


function static(dir) {
  return function (req, res) {
    var url = req.url
    var filePath = path.join(dir, url)
    fs.access(filePath, function (err) {
      if (err) {
        res.writeHead(404, {
          'Content-Type': 'text/plain',
          'Content-Length': '0'
        })
        res.end()
        return
      }
      console.log(filePath)
      fs.createReadStream(filePath).on('error', console.error).pipe(res)
    })
  }
}

module.exports = static