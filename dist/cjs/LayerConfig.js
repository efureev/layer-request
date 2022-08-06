"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mu = require("@feugene/mu");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function buildBaseAxiosConfig() {
  return {
    baseURL: "/",
    headers: {}
  };
}

var LayerConfig = /*#__PURE__*/function () {
  function LayerConfig(properties) {
    _classCallCheck(this, LayerConfig);

    _defineProperty(this, "axiosRequestConfig", {});

    _defineProperty(this, "extra", Object.create(null));

    _defineProperty(this, "interceptors", {
      request: [],
      response: []
    });

    this.axiosRequestConfig = (properties === null || properties === void 0 ? void 0 : properties.axiosRequestConfig) || buildBaseAxiosConfig();
    this.interceptors = (0, _mu.merge)({
      request: [],
      response: []
    }, properties === null || properties === void 0 ? void 0 : properties.interceptors);
  }

  _createClass(LayerConfig, [{
    key: "clone",
    value: function clone() {
      return new LayerConfig((0, _mu.clone)(this.toConfigObject()));
    }
  }, {
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }, {
    key: "setName",
    value: function setName(name) {
      if ((0, _mu.isEmpty)(name)) {
        if ((0, _mu.isEmpty)(this.axiosRequestConfig.baseURL)) {
          throw Error('You should add `name` to your layer or config must contains `baseURL` attribute!');
        }

        name = this.axiosRequestConfig.baseURL;
      }

      this.name = name;
    }
  }, {
    key: "toConfigObject",
    value: function toConfigObject() {
      return {
        axiosRequestConfig: this.axiosRequestConfig,
        interceptors: this.interceptors,
        from: this.from
      };
    }
  }, {
    key: "getExtra",
    value: function getExtra(key) {
      return key ? this.extra[key] : this.extra;
    }
  }, {
    key: "setExtra",
    value: function setExtra(data, value) {
      if (typeof data === 'string') {
        var e = Object.create(null);
        e[data] = value;
        data = e;
      }

      this.extra = _objectSpread(_objectSpread({}, this.extra), data);
    }
  }]);

  return LayerConfig;
}();

exports.default = LayerConfig;
//# sourceMappingURL=LayerConfig.js.map