"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayerConfigManager = void 0;
const mu_1 = require("@feugene/mu");
const LayerConfig_1 = __importDefault(require("./LayerConfig"));
const layers = new Map();
class LayerConfigManager {
    addLayer(configValue, name) {
        if ((0, mu_1.isFunction)(configValue)) {
            return this.addLayer(configValue(this), name);
        }
        if (!(0, mu_1.isObject)(configValue)) {
            throw Error('Invalid type of config!');
        }
        if (!(configValue instanceof LayerConfig_1.default)) {
            configValue = new LayerConfig_1.default({ axiosRequestConfig: configValue });
        }
        configValue.setName(name);
        layers.set(configValue.getName(), configValue);
        return configValue;
    }
    getLayer(name, throws = false) {
        if (name instanceof LayerConfig_1.default) {
            return name;
        }
        const l = layers.get(name);
        if (l) {
            return l;
        }
        if (throws) {
            throw Error(`Config Layer with name '${name}' not found`);
        }
    }
    list() {
        return Array.from(layers.keys());
    }
    all() {
        return layers;
    }
    reset() {
        layers.clear();
        return this;
    }
    /**
     * Add a copy of an existing LayerConfig to the Layer Manager
     */
    addCopyFrom(fromLayer, fn, newLayer, withExtra = false) {
        const copy = this.copyLayerAndSetup(fromLayer, fn, withExtra);
        return this.addLayer(copy, newLayer);
    }
    /**
     * Copy a LayerConfig from an existing LayerConfig and set it up
     */
    copyLayerAndSetup(fromLayer, fn, withExtra = false) {
        fromLayer = this.getLayer(fromLayer, true);
        const layerCopy = this.copyLayer(fromLayer, withExtra);
        layerCopy.from = fromLayer.getName();
        fn(layerCopy, fromLayer);
        return layerCopy;
    }
    /**
     * Copy a LayerConfig from an existing LayerConfig
     */
    copyLayer(name, withExtra = false) {
        if (name instanceof LayerConfig_1.default) {
            name = name.getName();
        }
        const l = this.getLayer(name, true);
        return l.clone(withExtra);
    }
    /**
     * Update a LayerConfig by its name
     */
    updateLayer(name, fn) {
        const l = this.getLayer(name, true);
        fn(l);
        return this;
    }
    createLayer(options) {
        return new LayerConfig_1.default(options);
    }
}
exports.LayerConfigManager = LayerConfigManager;
const manager = new LayerConfigManager();
exports.default = manager;
//# sourceMappingURL=LayerConfigManager.js.map