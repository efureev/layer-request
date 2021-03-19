import { clone } from '@feugene/mu/src'
import { merge } from '@feugene/mu/src/object'

function buildBaseConfig() {
  return {
    baseURL: `/`,
    headers: {},
  }
}

class ConfigLayer {
  constructor({ requestConfig, interceptors } = {}) {
    this.requestConfig = requestConfig || buildBaseConfig()

    this.name = null
    this.from = null

    this.interceptors = merge(
      {
        request: [],
        response: [],
      },
      interceptors,
    )
  }

  /**
   * @return {ConfigLayer}
   */
  clone() {
    return new ConfigLayer(clone(this.toObject()))
  }

  /**
   * @return {{requestConfig: (*|{headers: {}, baseURL: string}), from: null, interceptors: Object}}
   */
  toObject() {
    return {
      requestConfig: this.requestConfig,
      interceptors: this.interceptors,
      from: this.from,
    }
  }
}

export default ConfigLayer
