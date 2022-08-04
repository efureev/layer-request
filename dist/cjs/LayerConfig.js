"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mu = require("@feugene/mu");

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
    key: "toConfigObject",
    value: function toConfigObject() {
      return {
        axiosRequestConfig: this.axiosRequestConfig,
        interceptors: this.interceptors,
        from: this.from
      };
    }
  }, {
    key: "clone",
    value: function clone() {
      return new LayerConfig((0, _mu.clone)(this.toConfigObject()));
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
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }]);

  return LayerConfig;
}();

exports.default = LayerConfig;
//# sourceMappingURL=LayerConfig.js.map