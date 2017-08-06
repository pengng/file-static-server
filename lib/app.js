function App() {
  this.router = {}
  this.funcLength = 0
  var iteration = function (method) {
    this.router[method] = {}
  }
  App.prototype.methods.forEach(iteration.bind(this))
}

App.prototype = {
  methods: ['get', 'post', 'put', 'delete', 'options', 'head', 'patch'],
  _markSequence: function (func) {
    var iteration = function (item) {
      item._sequence = this.funcLength++
    }
    func.forEach(iteration.bind(this))
  },
  route: function (method, route) {
    var func = Array.prototype.slice.call(arguments, 2)
    this._markSequence(func)
    var router = this.router[method]
    if (router[route]) {
      router[route] = router[route].concat(func)
    } else {
      router[route] = func
    }
  },
  all: function () {
    var args = Array.prototype.slice.call(arguments)
    var iteration = function (method) {
      this.route.apply(this, [method].concat(args))
    }
    App.prototype.methods.forEach(iteration.bind(this))
  },
  _getQueue: function (data) {
    var queue = []
    var method = data.method.toLowerCase()
    var url = data.url
    for (var key in this.router[method]) {
      var reg = new RegExp('^' + key.replace(/\*/g, '.*') + '$', 'i')
      if (reg.test(url)) {
        queue = queue.concat(this.router[method][key])
      }
    }
    queue = queue.sort(function (a, b) {
      return a._sequence - b._sequence
    })
    return queue
  },
  export: function () {
    var connection = function (req, res) {
      var queue = this._getQueue(req)
      if (queue.length === 0) {
        return this.empty(req, res)
      } else {
        queue = queue.slice()
      }
      var next = function () {
        var current = queue.shift()
        if (typeof current === 'function') {
          current(req, res, next)
        }
      }
      next()
    }
    return connection.bind(this)
  },
  empty: function (req, res) {
    var method = req.method
    var url = req.url
    res.writeHead(404)
    res.end('Can not ' + method + ' ' + url)
  }
}

App.prototype.methods.forEach(function (method) {
  App.prototype[method] = function () {
    var args = Array.prototype.slice.call(arguments)
    this.route.apply(this, [method].concat(args))
  }
})

module.exports = App