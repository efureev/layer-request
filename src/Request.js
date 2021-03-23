import axios from 'axios'

import isArray from '@feugene/mu/src/is/isArray'
import isObject from '@feugene/mu/src/is/isObject'
import isFunction from '@feugene/mu/src/is/isFunction'
import { buildLayerConfigManager } from './ConfigLayerManager'

/**
 * @param {Request} instance
 */
function buildAxios(instance) {
  instance.cancelToken = axios.CancelToken.source()
  instance.axios = axios.create({
    cancelToken: instance.cancelToken.token,
    ...instance.selectConfig.requestConfig,
  })
  instance.axios.wrapper = instance
}

/**
 * @param {Request} instance
 */
const defaultBuilder = (instance) => {
  buildAxios(instance)
}

export default class Request {
  constructor({ manager, extra }) {

    this.builder = defaultBuilder

    this.manager = manager || buildLayerConfigManager()

    this.extra = extra || {}

    return this
  }

  build(layer, extra) {
    if (!layer) {
      layer = this.manager.list().shift()
    }
    /**
     * @type {ConfigLayer}
     */
    this.selectConfig = this.manager.getLayer(layer, true).clone()
    if (isObject(extra)) {
      this.selectConfig.extra = {
        ...this.selectConfig.extra,
        ...extra,
      }
    }

    this.builder(this)

    this.applyInterceptors(this.selectConfig.interceptors)

    return this.axios
  }

  reset() {
    this.selectConfig = null
    this.builder = defaultBuilder
    this.axios = null

    return this
  }

  normalizeInterceptors(callback) {
    const cb = callback(this.selectConfig)
    let successCb
    let errorCb = null

    if (isArray(cb) && cb.length > 1) {
      successCb = cb[0]
      errorCb = isFunction(cb[1]) ? cb[1] : null //(error) => Promise.reject(error)
    } else {
      successCb = cb
      errorCb = null //(error) => Promise.reject(error)
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
