var fs = require('fs')
var ejs = require('ejs')
var path = require('path')

function Directory(req, res, file, headers) {
  this.req = req
  this.res = res
  this.file = file
  this.headers = headers
}

Directory.prototype = {
  outputBody: function () {
    var callback = function (err, result) {
      if (err) {
        return this.empty()
      }
      var templatePath = path.join(__dirname, '../views/list.ejs')
      this.headers
        .status(200)
        .write()
      var callback = function (err, html) {
        if (err) {
          return this.empty()
        }
        this.res.end(html)
      }
      ejs.renderFile(templatePath, {
        data: result,
        current: /\/$/.test(this.req.url) ? this.req.url : this.req.url + '/',
        parent: path.resolve(this.req.url, '../')
      }, {}, callback.bind(this))
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