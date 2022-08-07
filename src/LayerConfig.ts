import { clone, isEmpty, isObject, merge } from '@feugene/mu'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { Recordable } from './global'

function buildBaseAxiosConfig(): AxiosRequestConfig {
  return {
    baseURL: `/`,
    headers: {},
  }
}

export type InterceptorSuccessParam<T, R = T> = (value: T) => R | Promise<R>
export type InterceptorErrorParam = ((error: any) => any) | undefined
export type InterceptorNormal<T, R = T> = [InterceptorSuccessParam<T, R>, InterceptorErrorParam]
export type InterceptorType<T, R = T> = InterceptorSuccessParam<T, R> | InterceptorNormal<T, R>

export type InterceptorFn<T, R = T> = (layer: LayerConfig, extra: ExtraProperties) => InterceptorType<T, R>

export interface ConfigLayerInterceptors {
  request: InterceptorFn<AxiosRequestConfig>[]
  response: InterceptorFn<AxiosResponse>[]
}

export interface ConfigLayerConstructor {
  axiosRequestConfig: AxiosRequestConfig
  interceptors?: Partial<ConfigLayerInterceptors>
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

    this.interceptors = merge<ConfigLayerInterceptors>(
      {
        request: [],
        response: [],
      },
      <ConfigLayerInterceptors>properties?.interceptors
    )

    if (properties?.extra) {
      this.setExtra(properties?.extra)
    }
  }

  public clone(withExtra: boolean = false): LayerConfig {
    const l = new LayerConfig(clone<ConfigLayerConstructor>(this.toConfigObject()))
    if (withExtra) {
      l.setExtra(this.getExtra())
    }

    return l
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
        ...(<ExtraProperties>data),
      }
    }
  }
}

export default LayerConfig
