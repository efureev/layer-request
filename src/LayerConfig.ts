import { clone, isEmpty, merge } from '@feugene/mu'
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
}

export type ExtraProperties = Recordable
export type LayerConfigStringable = LayerConfig | string

export default class LayerConfig {
  public axiosRequestConfig: AxiosRequestConfig = {}

  protected name?: string
  public from?: string
  protected parent?: string

  public extra: ExtraProperties = Object.create(null)

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
      <ConfigLayerInterceptors>properties?.interceptors
    ) as ConfigLayerInterceptors
  }

  public toConfigObject(): ConfigLayerConstructor {
    return {
      axiosRequestConfig: this.axiosRequestConfig,
      interceptors: this.interceptors,
      from: this.from,
    }
  }

  public clone(): LayerConfig {
    return new LayerConfig(clone(this.toConfigObject()))
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

  public getName(): string {
    return <string>this.name
  }
}
