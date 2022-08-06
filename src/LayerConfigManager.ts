import type { AxiosRequestConfig } from 'axios'
import { isFunction, isObject } from '@feugene/mu'
import type { LayerConfigStringable } from './LayerConfig'
import LayerConfig, { ConfigLayerConstructor } from './LayerConfig'
import { Undef } from './global'

const layers = new Map<string, LayerConfig>()

export type CreateLayerConfigFunction = (manager: LayerConfigManager) => AxiosRequestConfig | LayerConfig
type CreateLayerConfig = AxiosRequestConfig | LayerConfig | CreateLayerConfigFunction
type ModifyLayerConfigFn = (l: LayerConfig) => void
type CopyLayerConfigFn = (target: LayerConfig, source: LayerConfig) => void

export class LayerConfigManager {
  addLayer(configValue: CreateLayerConfig, name?: string): LayerConfig {
    if (isFunction(configValue)) {
      return this.addLayer((<CreateLayerConfigFunction>configValue)(this), name)
    }

    if (!isObject(configValue)) {
      throw Error('Invalid type of config!')
    }

    if (!(configValue instanceof LayerConfig)) {
      configValue = new LayerConfig(<ConfigLayerConstructor>{ axiosRequestConfig: configValue })
    }

    configValue.setName(name)

    layers.set(configValue.getName(), configValue)

    return configValue
  }

  getLayer(name: LayerConfigStringable, throws: boolean = false): Undef<LayerConfig> {
    if (name instanceof LayerConfig) {
      return name
    }

    const l = layers.get(name)
    if (l) {
      return l
    }

    if (throws) {
      throw Error(`Config Layer with name '${name}' not found`)
    }
  }

  list(): string[] {
    return Array.from(layers.keys())
  }

  all(): Map<string, LayerConfig> {
    return layers
  }

  reset(): this {
    layers.clear()

    return this
  }

  /**
   * Add a copy of an existing LayerConfig to the Layer Manager
   */
  addCopyFrom(fromLayer: LayerConfigStringable, fn: CopyLayerConfigFn, newLayer?: string): LayerConfig {
    const copy = this.copyLayerAndSetup(fromLayer, fn)

    return this.addLayer(copy, newLayer)
  }

  /**
   * Copy a LayerConfig from an existing LayerConfig and set it up
   */
  copyLayerAndSetup(fromLayer: LayerConfigStringable, fn: CopyLayerConfigFn): LayerConfig {
    fromLayer = <LayerConfig>this.getLayer(fromLayer, true)
    const layerCopy = this.copyLayer(fromLayer)

    layerCopy.from = fromLayer.getName()

    fn(layerCopy, fromLayer)

    return layerCopy
  }

  /**
   * Copy a LayerConfig from an existing LayerConfig
   */
  copyLayer(name: LayerConfigStringable): LayerConfig {
    if (name instanceof LayerConfig) {
      name = name.getName()
    }

    const l = <LayerConfig>this.getLayer(name, true)
    return l.clone()
  }

  /**
   * Update a LayerConfig by its name
   */
  updateLayer(name: string, fn: ModifyLayerConfigFn): this {
    const l = this.getLayer(name, true)

    fn(<LayerConfig>l)

    return this
  }

  createLayer(options: ConfigLayerConstructor): LayerConfig {
    return new LayerConfig(options)
  }
}

const manager = new LayerConfigManager()

export default manager
