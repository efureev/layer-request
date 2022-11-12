import type { AxiosInstance, AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import isFunction from '@feugene/mu/is/isFunction'
import type { LayerConfigManager } from './LayerConfigManager'
import layerConfigManager from './LayerConfigManager'
import type {
  ConfigLayerInterceptors,
  ExtraProperties,
  InterceptorErrorParam,
  InterceptorFn,
  InterceptorNormal,
  InterceptorSuccessParam,
  LayerConfig,
  LayerConfigStringable,
} from './LayerConfig'
import { Undef } from './global'

type BuilderCreator = (r: LayerRequest) => void
type AxiosCreator = (axiosRequestConfig?: AxiosRequestConfig) => AxiosInstances

interface AxiosInstances {
  axios?: AxiosInstance
  cancelController?: AbortController
}

const o = () => Object.create(null)

const buildAxios: AxiosCreator = (axiosRequestConfig: AxiosRequestConfig = o()): AxiosInstances => {
  // to cancel the request:
  // controller.abort()
  const cancelController = new AbortController()

  const a = axios.create({
    signal: cancelController.signal,
    ...axiosRequestConfig,
  })

  return {
    cancelController,
    axios: a,
  }
}

const defaultBuilder: BuilderCreator = (instance: LayerRequest): void => {
  instance.setAxiosInstances(buildAxios(instance.selectedConfig?.axiosRequestConfig))
}

export default class LayerRequest {
  public readonly manager: LayerConfigManager
  public readonly extra: ExtraProperties
  public builder: BuilderCreator

  public selectedConfig?: LayerConfig

  private axiosInstances: AxiosInstances = o()

  constructor(manager: LayerConfigManager = layerConfigManager, extra: ExtraProperties = o()) {
    this.manager = manager
    this.extra = extra

    this.builder = defaultBuilder
  }

  useConfig(layer: LayerConfigStringable, extra: ExtraProperties = o()): AxiosInstance {
    if (!layer) {
      const layerName = this.manager.list().shift()
      if (!layerName) {
        throw Error('Missing name of a LayerConfig')
      }
      layer = layerName
    }

    const currentLayer: LayerConfig = <LayerConfig>this.manager.getLayer(layer, true)
    this.selectedConfig = currentLayer.clone(true)
    this.selectedConfig.setName(currentLayer.getName())

    this.selectedConfig.setExtra(extra)

    this.builder(this)

    this.applyInterceptors(this.selectedConfig.interceptors)

    return <AxiosInstance>this.axiosInstances.axios
  }

  reset() {
    this.selectedConfig = undefined
    this.builder = defaultBuilder
    this.axiosInstances.axios = undefined
    this.axiosInstances.cancelController = undefined

    return this
  }

  private normalizeInterceptors<T>(callback: InterceptorFn<T>): InterceptorNormal<T> {
    const cb = callback(<LayerConfig>this.selectedConfig, this.extra)
    let successCb: InterceptorSuccessParam<T>
    let errorCb: InterceptorErrorParam

    if (Array.isArray(cb) && cb.length > 1) {
      successCb = cb[0]
      errorCb = isFunction(cb[1]) ? cb[1] : undefined //(error) => Promise.reject(error)
      return [successCb, errorCb]
    }

    return [<InterceptorSuccessParam<T>>cb, undefined]
  }

  private registerInterceptors<T>(target: AxiosInterceptorManager<T>, ...source: InterceptorFn<T>[]) {
    source.forEach(callback => {
      if (!isFunction(callback)) {
        return
      }
      target.use<T>(...this.normalizeInterceptors<T>(callback))
    })
  }

  private applyInterceptors(interceptors: ConfigLayerInterceptors) {
    if (!this.selectedConfig || !this.axiosInstances.axios) {
      throw Error('To handle request you should choose a LayerConfig with `useConfig`!')
    }
    interceptors.request &&
    this.registerInterceptors<AxiosRequestConfig>(
      this.axiosInstances.axios.interceptors.request,
      ...interceptors.request,
    )
    interceptors.response &&
    this.registerInterceptors<AxiosResponse>(
      this.axiosInstances.axios.interceptors.response,
      ...interceptors.response,
    )
  }

  public setAxiosInstances(instances: AxiosInstances) {
    if (!instances.axios) {
      throw Error('You should create Axios instance')
    }
    // @ts-ignore
    instances.axios.$layerRequest = this
    this.axiosInstances = instances
  }

  public getAxios(): Undef<AxiosInstance> {
    return this.axiosInstances.axios
  }

  public getCancel(): Undef<AbortController> {
    return this.axiosInstances.cancelController
  }

  public abort(reason?: any): void {
    this.axiosInstances.cancelController && this.axiosInstances.cancelController.abort(reason)
  }
}

export function buildLayerRequest(extra: ExtraProperties = o(), manager?: LayerConfigManager) {
  return new LayerRequest(manager, extra)
}
