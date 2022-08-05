"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.LayerConfigManager = void 0;

var _mu = require("@feugene/mu");

var _LayerConfig = _interopRequireDefault(require("./LayerConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var layers = new Map();

var LayerConfigManager = /*#__PURE__*/function () {
  function LayerConfigManager() {
    _classCallCheck(this, LayerConfigManager);
  }

  _createClass(LayerConfigManager, [{
    key: "addLayer",
    value: function addLayer(configValue, name) {
      if ((0, _mu.isFunction)(configValue)) {
        return this.addLayer(configValue(this), name);
      }

      if (!(0, _mu.isObject)(configValue)) {
        throw Error('Invalid type of config!');
      }

      if (!(configValue instanceof _LayerConfig.default)) {
        configValue = new _LayerConfig.default({
          axiosRequestConfig: configValue
        });
      }

      configValue.setName(name);
      layers.set(configValue.getName(), configValue);
      return configValue;
    }
  }, {
    key: "getLayer",
    value: function getLayer(name) {
      var throws = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (name instanceof _LayerConfig.default) {
        return name;
      }

      var l = layers.get(name);

      if (l) {
        return l;
      }

      if (throws) {
        throw Error("Config Layer with name '".concat(name, "' not found"));
      }

      return null;
    }
  }, {
    key: "list",
    value: function list() {
      return Array.from(layers.keys());
    }
  }, {
    key: "all",
    value: function all() {
      return layers;
    }
  }, {
    key: "reset",
    value: function reset() {
      layers.clear();
      return this;
    }
    /**
     * Add a copy of an existing LayerConfig to the Layer Manager
     */

  }, {
    key: "addCopyFrom",
    value: function addCopyFrom(fromLayer, fn, newLayer) {
      var copy = this.copyLayerAndSetup(fromLayer, fn);
      return this.addLayer(copy, newLayer);
    }
    /**
     * Copy a LayerConfig from an existing LayerConfig and set it up
     */

  }, {
    key: "copyLayerAndSetup",
    value: function copyLayerAndSetup(fromLayer, fn) {
      fromLayer = this.getLayer(fromLayer, true);
      var layerCopy = this.copyLayer(fromLayer);
      layerCopy.from = fromLayer.getName();
      fn(layerCopy, fromLayer);
      return layerCopy;
    }
    /**
     * Copy a LayerConfig from an existing LayerConfig
     */

  }, {
    key: "copyLayer",
    value: function copyLayer(name) {
      if (name instanceof _LayerConfig.default) {
        name = name.getName();
      }

      var l = this.getLayer(name, true);
      return l.clone();
    }
    /**
     * Update a LayerConfig by its name
     */

  }, {
    key: "updateLayer",
    value: function updateLayer(name, fn) {
      var l = this.getLayer(name, true);
      fn(l);
      return this;
    }
  }, {
    key: "createLayer",
    value: function createLayer(options) {
      return new _LayerConfig.default(options);
    }
  }]);

  return LayerConfigManager;
}();

exports.LayerConfigManager = LayerConfigManager;
var manager = new LayerConfigManager();
var _default = manager;
exports.default = _default;
//# sourceMappingURL=LayerConfigManager.js.map