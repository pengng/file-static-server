var package = require('../package')

function Headers(req, res) {
  this.req = req
  this.res = res
  this.headers = {
    'server': 'static-' + package.version
  }
  this._status = 200
}

Headers.prototype = {
  getHeaders: function (name) {
    var headers = this.req.headers
    for (var key in headers) {
      if (key.toLowerCase() === name.toLowerCase()) {
        return headers[key]
      }
    }
  },
  setHeaders: function (key, value) {
    this.headers[key.toLowerCase()] = value
    return this
  },
  status: function (status) {
    this._status = status
    return this
  },
  write: function () {
    this.res.writeHead(this._status, this.headers)
    return this
  }
}

module.exports = Headers