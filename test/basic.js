var request = require('request'),
    vows = require('vows'),
    assert = require('assert');

var files = {
  'a.txt' : {
    code : 200,
    type : 'text/plain',
    body : 'A!!!\n',
  },
  'b.txt' : {
    code : 200,
    type : 'text/plain',
    body : 'B!!!\n',
  },
  'c.js' : {
    code : 200,
    type : 'application/javascript',
    body : 'console.log(\'C!!!\');\n',
  },
  'd.js' : {
    code : 200,
    type : 'application/javascript',
    body : 'console.log(\'C!!!\');\n',
  },
  'subdir/e.html' : {
    code : 200,
    type : 'text/html',
    body : '<b>e!!</b>\n',
  },
  'subdir/index.html' : {
    code : 200,
    type : 'text/html',
    body : 'index!!!\n',
  },
  'subdir' : {
    code : 200,
    type : 'text/html',
    body : 'index!!!\n',
  },
  'thisIsA404.txt' : {
    code : 404,
    body: '<h1>404\'d!</h1>\n'
  }
  /*, 'emptyDir': { // This one seems to time out.
    code: 200
  }*/
};

// Transforms the above into some vows, yo
module.exports = function (root, srv) {
  var tests = {},
      res = {};

  tests.topic = function () {
    var self = this;

    srv.startServer(root, self.callback);
  };

  Object.keys(files).forEach(function (f) {

    var test = {},
        expected = files[f];

    test.topic = function (host, port, app) {
      var cb = this.callback;
      var uri = 'http://'+host+':' + port + '/' + f;

      request.get(uri, cb);
    };

    test['does not throw'] = function (err, res, body) {
      assert.doesNotThrow(function () { return err; });
    }

    if (typeof(expected.code) !== undefined) {
      test['returns status '+expected.code] = function (err, res, body) {
        assert.equal(res.statusCode, expected.code);
      };
    }

    if (typeof(expected.type) !== undefined) {
      test['content-type set to '+expected.type] = function (err, res, body) {
        assert.equal(res.headers['content-type'], r.type);
      }
    }

    if (typeof(expected.body) !== undefined) {
      test['Contents of body are: '+expected.body] = function (err, res, body) {
        assert.equal(body, r.body);
      };
    }

    tests['When requesting /'+f] = test;

  });

  if (srv.type) {
    res['When using '+srv.type] = tests;
  }
  else {

    res['When using unspecified server #'+Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4)] = tests;
  }

  return res;
}
