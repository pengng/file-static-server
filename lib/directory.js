var fs = require('fs')

function Directory(req, res, file, headers) {
  this.req = req
  this.res = res
  this.file = file
  this.headers = headers
}

Directory.prototype = {
  outputBody: function () {
    console.log(this.headers)
    var callback = function (err, result) {
      if (err) {
        return this.empty()
      }
      this.headers
        .status(200)
        .write()
      this.res.end(JSON.stringify(result))
    }
    fs.readdir(this.file.filePath, callback.bind(this))
  },
  empty: function () {
    this.headers
      .status(404)
      .write()
    this.res.end()
  }
}

module.exports = Directory