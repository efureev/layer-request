import { isFunction, isObject } from '@feugene/mu';
import LayerConfig from './LayerConfig';
const layers = new Map();
export class LayerConfigManager {
  addLayer(configValue, name) {
    if (isFunction(configValue)) {
      return this.addLayer(configValue(this), name);
    }

    if (!isObject(configValue)) {
      throw Error('Invalid type of config!');
    }

    if (!(configValue instanceof LayerConfig)) {
      configValue = new LayerConfig({
        axiosRequestConfig: configValue
      });
    }

    configValue.setName(name);
    layers.set(configValue.getName(), configValue);
    return configValue;
  }

  getLayer(name, throws = false) {
    if (name instanceof LayerConfig) {
      return name;
    }

    const l = layers.get(name);

    if (l) {
      return l;
    }

    if (throws) {
      throw Error(`Config Layer with name '${name}' not found`);
    }

    return null;
  }

  list() {
    return Array.from(layers.keys()); //.map(name => name)
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


  addCopyFrom(fromLayer, fn, newLayer) {
    const copy = this.copyFrom(fromLayer, fn);
    return this.addLayer(copy, newLayer);
  }
  /**
   * Copy a LayerConfig from an existing LayerConfig and set it up
   */


  copyFrom(fromLayer, fn) {
    fromLayer = this.getLayer(fromLayer, true);
    const layerCopy = this.copyLayer(fromLayer);
    layerCopy.from = fromLayer.getName();
    fn(layerCopy, fromLayer);
    return layerCopy;
  }
  /**
   * Copy a LayerConfig from an existing LayerConfig
   */


  copyLayer(name) {
    if (name instanceof LayerConfig) {
      name = name.getName();
    }

    const l = this.getLayer(name, true);
    return l.clone();
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
    return new LayerConfig(options);
  }

}
const manager = new LayerConfigManager();
export default manager;
//# sourceMappingURL=LayerConfigManager.js.map