import axios from 'axios'

import isArray from '@feugene/mu/src/is/isArray'
import { buildLayerConfigManager } from './ConfigLayerManager'

/*
 const buildResponseWrapper = (config) => {
 return isFunction(config.responseWrapper)
 ? config.responseWrapper(config)
 : defaultResponseWrapper(config.responseWrapper || {})
 }*/

function buildAxios(instance, config) {
  instance.axios = axios.create(config.requestConfig)
  instance.axios.wrapper = instance
  //instance.axios.reconfigure = instance.buildReconfigureFn(instance)
}

/*function buildConfig(config, instance) {
 if (config.isResponseWrap) {
 config.responseWrapper = buildResponseWrapper(config)

 if (isFunction(config.responseWrapper.fn)) {
 if (!instance.fillWrapperer) {
 config.responseWrapper.fn(instance)
 instance.fillWrapperer = true
 }
 }
 } else {
 config.responseWrapper = null
 instance.fillWrapperer = false
 }
 }*/

/**
 * @param {Request} instance
 * @param {String} config
 * @return {AxiosInstance}
 */
const defaultBuilder = (instance, config) => {
  buildAxios(instance, config)
  // buildConfig(instance.config, instance)
  /*

   if (instance.config.enabledCORS) {
   instance.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
   }
   */

  /*
   if (isFunction(instance.config.afterBuilding)) {
   (instance.config.afterBuilding)(instance)
   }
   */

  return instance.axios
}

export default class Request {
  constructor({ manager, extra }) {

    this.builder = defaultBuilder

    this.manager = manager || buildLayerConfigManager()

    this.extra = extra || {}

    return this
  }

  build(layer) {
    const config = this.manager.getLayer(layer, true)

    this.builder(this, config)

    this.applyInterceptors(config.interceptors)

    return this.axios
  }

  reset() {
    this.builder = defaultBuilder

    this.axios = null

    return this
  }

  normalizeInterceptors(callback) {
    const cb = callback(this.config)
    let successCb
    let errorCb

    if (isArray(cb) && cb.length > 1) {
      successCb = cb[0]
      errorCb = isFunction(cb[1]) ? cb[1] : (error) => Promise.reject(error)
    } else {
      successCb = cb
      errorCb = (error) => Promise.reject(error)
    }

    return [successCb, errorCb]
  }

  /**
   * @param target
   * @param source
   */
  registerInterceptors(target, ...source) {
    source.forEach((callback) => {
      target.use(...this.normalizeInterceptors(callback))
    })
  }

  applyInterceptors(interceptors) {
    this.registerInterceptors(this.axios.interceptors.request, ...interceptors.request)
    this.registerInterceptors(this.axios.interceptors.response, ...interceptors.response)
  }
}
