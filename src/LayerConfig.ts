import { clone, isEmpty, isObject, merge } from '@feugene/mu'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { Recordable } from './global'

function buildBaseAxiosConfig(): AxiosRequestConfig {
  return {
    baseURL: `/`,
    headers: {},
  }
}

export type InterceptorSuccessParam<T> = (value: T) => T | Promise<T>
export type InterceptorErrorParam = ((error: any) => any) | undefined
export type InterceptorNormal<T> = [InterceptorSuccessParam<T>, InterceptorErrorParam] // | [InterceptorSuccessParam<T>]
export type InterceptorType<T> = InterceptorSuccessParam<T> | InterceptorNormal<T>

export type InterceptorFn<T> = (layer: LayerConfig, extra: ExtraProperties) => InterceptorType<T>

export interface ConfigLayerInterceptors {
  request: InterceptorFn<AxiosRequestConfig>[]
  response: InterceptorFn<AxiosResponse>[]
}

export interface ConfigLayerConstructor {
  axiosRequestConfig: AxiosRequestConfig
  interceptors: Partial<ConfigLayerInterceptors>
  from?: string
  extra?: ExtraProperties
}

export type ExtraProperties = Recordable
export type LayerConfigStringable = LayerConfig | string

const o = () => Object.create(null)

export class LayerConfig {
  public axiosRequestConfig: AxiosRequestConfig = {}

  private name?: string
  public from?: string

  private extra: ExtraProperties = o()

  public interceptors: ConfigLayerInterceptors = {
    request: [],
    response: [],
  }

  constructor(properties?: ConfigLayerConstructor) {
    this.axiosRequestConfig = properties?.axiosRequestConfig || buildBaseAxiosConfig()

    this.interceptors = merge(
      {
        request: [],
        response: [],
      },
      <ConfigLayerInterceptors>properties?.interceptors,
    ) as ConfigLayerInterceptors

    if (properties?.extra) {
      this.setExtra(properties?.extra)
    }
  }

  public clone(): LayerConfig {
    return new LayerConfig(clone(this.toConfigObject()))
  }

  public getName(): string {
    return <string>this.name
  }

  public setName(name?: string): void {
    if (isEmpty(name)) {
      if (isEmpty(this.axiosRequestConfig.baseURL)) {
        throw Error('You should add `name` to your layer or config must contains `baseURL` attribute!')
      }

      name = this.axiosRequestConfig.baseURL
    }

    this.name = name
  }

  protected toConfigObject(): ConfigLayerConstructor {
    return {
      axiosRequestConfig: this.axiosRequestConfig,
      interceptors: this.interceptors,
      from: this.from,
    }
  }

  public getExtra(key?: string): ExtraProperties | any {
    return key ? this.extra[key] : this.extra
  }

  public setExtra(data: ExtraProperties | string, value?: any): void {
    if (typeof data === 'string') {
      const e = o()
      e[data] = value
      data = e
    }

    if (isObject(data)) {
      this.extra = {
        ...this.extra,
        ...<ExtraProperties>data,
      }
    }
  }
}

export default LayerConfig
