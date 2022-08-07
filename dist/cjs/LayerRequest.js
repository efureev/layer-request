"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildLayerRequest = buildLayerRequest;
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _mu = require("@feugene/mu");

var _LayerConfigManager = _interopRequireDefault(require("./LayerConfigManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var o = function o() {
  return Object.create(null);
};

var buildAxios = function buildAxios() {
  var axiosRequestConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : o();
  // to cancel the request:
  // controller.abort()
  var cancelController = new AbortController();

  var a = _axios.default.create(_objectSpread({
    signal: cancelController.signal
  }, axiosRequestConfig));

  return {
    cancelController: cancelController,
    axios: a
  };
};

var defaultBuilder = function defaultBuilder(instance) {
  var _instance$selectedCon;

  instance.setAxiosInstances(buildAxios((_instance$selectedCon = instance.selectedConfig) === null || _instance$selectedCon === void 0 ? void 0 : _instance$selectedCon.axiosRequestConfig));
};

var LayerRequest = /*#__PURE__*/function () {
  function LayerRequest() {
    var manager = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _LayerConfigManager.default;
    var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : o();

    _classCallCheck(this, LayerRequest);

    _defineProperty(this, "axiosInstances", o());

    this.manager = manager;
    this.extra = extra;
    this.builder = defaultBuilder;
  }

  _createClass(LayerRequest, [{
    key: "useConfig",
    value: function useConfig(layer) {
      var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : o();

      if (!layer) {
        var layerName = this.manager.list().shift();

        if (!layerName) {
          throw Error('Missing name of a LayerConfig');
        }

        layer = layerName;
      }

      var currentLayer = this.manager.getLayer(layer, true);
      this.selectedConfig = currentLayer.clone();
      this.selectedConfig.setName(currentLayer.getName());
      this.selectedConfig.setExtra(_objectSpread(_objectSpread({}, currentLayer.getExtra()), (0, _mu.isObject)(extra) ? extra : {}));
      this.builder(this);
      this.applyInterceptors(this.selectedConfig.interceptors);
      return this.axiosInstances.axios;
    }
    /**
     * @deprecated
     * @use `useConfig`
     */

  }, {
    key: "build",
    value: function build(layer) {
      var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : o();
      return this.useConfig(layer, extra);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.selectedConfig = undefined;
      this.builder = defaultBuilder;
      this.axiosInstances.axios = undefined;
      this.axiosInstances.cancelController = undefined;
      return this;
    }
  }, {
    key: "normalizeInterceptors",
    value: function normalizeInterceptors(callback) {
      var cb = callback(this.selectedConfig, this.extra);
      var successCb;
      var errorCb;

      if (Array.isArray(cb) && cb.length > 1) {
        successCb = cb[0];
        errorCb = (0, _mu.isFunction)(cb[1]) ? cb[1] : undefined; //(error) => Promise.reject(error)

        return [successCb, errorCb];
      }

      return [cb, undefined];
    }
  }, {
    key: "registerInterceptors",
    value: function registerInterceptors(target) {
      var _this = this;

      for (var _len = arguments.length, source = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        source[_key - 1] = arguments[_key];
      }

      source.forEach(function (callback) {
        if (!(0, _mu.isFunction)(callback)) {
          return;
        }

        target.use.apply(target, _toConsumableArray(_this.normalizeInterceptors(callback)));
      });
    }
  }, {
    key: "applyInterceptors",
    value: function applyInterceptors(interceptors) {
      if (!this.selectedConfig || !this.axiosInstances.axios) {
        throw Error('To handle request you should choose a LayerConfig with `useConfig`!');
      }

      interceptors.request && this.registerInterceptors.apply(this, [this.axiosInstances.axios.interceptors.request].concat(_toConsumableArray(interceptors.request)));
      interceptors.response && this.registerInterceptors.apply(this, [this.axiosInstances.axios.interceptors.response].concat(_toConsumableArray(interceptors.response)));
    }
  }, {
    key: "setAxiosInstances",
    value: function setAxiosInstances(instances) {
      if (!instances.axios) {
        throw Error('You should create Axios instance');
      } // @ts-ignore


      instances.axios.$layerRequest = this;
      this.axiosInstances = instances;
    }
  }, {
    key: "getAxios",
    value: function getAxios() {
      return this.axiosInstances.axios;
    }
  }, {
    key: "getCancel",
    value: function getCancel() {
      return this.axiosInstances.cancelController;
    }
  }, {
    key: "abort",
    value: function abort(reason) {
      this.axiosInstances.cancelController && this.axiosInstances.cancelController.abort(reason);
    }
  }]);

  return LayerRequest;
}();

exports.default = LayerRequest;

function buildLayerRequest() {
  var extra = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : o();
  var manager = arguments.length > 1 ? arguments[1] : undefined;
  return new LayerRequest(manager, extra);
}
//# sourceMappingURL=LayerRequest.js.map