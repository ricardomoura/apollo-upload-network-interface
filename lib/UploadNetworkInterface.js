'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UploadNetworkInterface = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createNetworkInterface;

var _apolloClient = require('apollo-client');

var _networkInterface = require('apollo-client/transport/networkInterface');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function createNetworkInterface(opts) {
  var uri = opts.uri;

  return new UploadNetworkInterface(uri, opts);
}

var UploadNetworkInterface = exports.UploadNetworkInterface = function (_HTTPFetchNetworkInte) {
  _inherits(UploadNetworkInterface, _HTTPFetchNetworkInte);

  function UploadNetworkInterface() {
    _classCallCheck(this, UploadNetworkInterface);

    return _possibleConstructorReturn(this, (UploadNetworkInterface.__proto__ || Object.getPrototypeOf(UploadNetworkInterface)).apply(this, arguments));
  }

  _createClass(UploadNetworkInterface, [{
    key: 'fetchFromRemoteEndpoint',
    value: function fetchFromRemoteEndpoint(req) {
      var options = this.isUpload(req) ? this.getUploadOptions(req) : this.getJSONOptions(req);
      return fetch(this._uri, options);
    }
  }, {
    key: 'isArrayOfFiles',
    value: function isArrayOfFiles(list) {
      if (Array.isArray(list)) {
        var returnValue = false;
        for (var key in list) {
          if (list[key] instanceof File) {
            returnValue = true;
          } else {
            return false;
          }
        }
        return returnValue;
      }
      return false;
    }
  }, {
    key: 'isUpload',
    value: function isUpload(_ref) {
      var request = _ref.request;

      if (request.variables) {
        for (var key in request.variables) {
          if (request.variables[key] instanceof FileList) {
            return true;
          } else if (request.variables[key] instanceof File) {
            return true;
          } else if (this.isArrayOfFiles(request.variables[key])) {
            return true;
          }
        }
      }
      return false;
    }
  }, {
    key: 'getJSONOptions',
    value: function getJSONOptions(_ref2) {
      var request = _ref2.request,
          options = _ref2.options;

      return Object.assign({}, this._opts, {
        body: JSON.stringify((0, _networkInterface.printRequest)(request)),
        method: 'POST'
      }, options, {
        headers: Object.assign({}, {
          Accept: '*/*',
          'Content-Type': 'application/json'
        }, options.headers)
      });
    }
  }, {
    key: 'getUploadOptions',
    value: function getUploadOptions(_ref3) {
      var _this2 = this;

      var request = _ref3.request,
          options = _ref3.options;

      var body = new FormData();
      var variables = {};

      var _loop = function _loop(key) {
        var v = request.variables[key];
        if (v instanceof FileList) {
          Array.from(v).forEach(function (f) {
            return body.append(key, f);
          });
        } else if (_this2.isArrayOfFiles(v)) {
          Array.from(v).forEach(function (f) {
            return body.append(key, f);
          });
        } else {
          variables[key] = v;
        }
      };

      for (var key in request.variables) {
        _loop(key);
      }

      body.append('operationName', request.operationName);
      body.append('query', (0, _apolloClient.printAST)(request.query));
      body.append('variables', JSON.stringify(variables));

      return Object.assign({}, this._opts, {
        body: body,
        method: 'POST'
      }, options, {
        headers: Object.assign({}, {
          Accept: '*/*'
        }, options.headers)
      });
    }
  }]);

  return UploadNetworkInterface;
}(_networkInterface.HTTPFetchNetworkInterface);