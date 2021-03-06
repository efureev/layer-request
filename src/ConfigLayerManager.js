import { isEmpty, isFunction, isObject } from '@feugene/mu/src/is'
import ConfigLayer from './ConfigLayer'

/**
 * @type {Map<String, ConfigLayer>}
 */
const layers = new Map()

export class ConfigLayerManager {
  /**
   * @param {Object|ConfigLayer|Function} configValue
   * @param {String} name
   * @return {ConfigLayer}
   */
  addLayer(configValue, name = null) {
    if (isFunction(configValue)) {
      return this.addLayer(configValue(this), name)
    }

    if (!isObject(configValue)) {
      throw Error('Invalid type of config!')
    }

    if (!(configValue instanceof ConfigLayer)) {
      configValue = new ConfigLayer({ requestConfig: configValue })
    }

    if (isEmpty(name)) {
      if (isEmpty(configValue.requestConfig.baseURL)) {
        throw Error('You must add `name` to your layer or config must contains `baseURL` attribute!')
      }

      name = configValue.requestConfig.baseURL
    }

    configValue.name = name

    layers.set(name, configValue)

    return configValue
  }

  /**
   * Return config layer by it's name
   *
   * @param {String|ConfigLayer} name
   * @param {Boolean} throws
   * @return {ConfigLayer|null}
   */
  getLayer(name, throws = false) {
    if (name instanceof ConfigLayer) {
      return name
    }

    const l = layers.get(name)
    if (l) {
      return l
    }

    if (throws) {
      throw Error(`Config Layer with name '${name}' not found`)
    }

    return null
  }

  /**
   * @return {String[]}
   */
  list() {
    return Array.from(layers.keys()).map(name => name)
  }

  all() {
    return layers
  }

  reset() {
    layers.clear()

    return this
  }

  /**
   * Add copy of a existing layer to manager
   *
   * @param {String|ConfigLayer} fromLayer
   * @param {Function<(ConfigLayer)>} fn
   * @param {String|null} newLayer
   * @return {ConfigLayer}
   */
  addCopyFrom(fromLayer, fn, newLayer = null) {
    const copy = this.copyFrom(fromLayer, fn)

    this.addLayer(copy, newLayer)

    return copy
  }

  /**
   * Copy layer from existing layer and set up it
   *
   * @param {String|ConfigLayer} fromLayer
   * @param {Function<(ConfigLayer)>} fn
   * @return {ConfigLayer}
   */
  copyFrom(fromLayer, fn) {
    const copy = this.copyLayer(fromLayer)

    copy.from = fromLayer

    fn(copy)

    return copy
  }

  /**
   * Copy layer from existing layer
   *
   * @param {String|ConfigLayer} layer
   * @return {ConfigLayer}
   */
  copyLayer(layer) {
    if (layer instanceof ConfigLayer) {
      layer = layer.name
    }

    const p = this.getLayer(layer, true)
    return p.clone()
  }

  /**
   * Update config layer by it's name
   *
   * @param {String} name
   * @param {Function} fn
   * @return {ConfigLayerManager}
   */
  updateLayer(name, fn) {
    const p = this.getLayer(name, true)

    fn(p)

    return this
  }

  /**
   * Create new Layer
   *
   * @param {Object} options
   * @return {ConfigLayer}
   */
  new(options) {
    return new ConfigLayer(options)
  }
}

const manager = new ConfigLayerManager()

export function buildLayerConfigManager() {
  // manager.addLayer(new ConfigLayer())

  return manager
}

export default manager
